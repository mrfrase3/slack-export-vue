import { defineStore } from 'pinia';
import { Archive } from 'libarchive.js/main.js';
import sortBy from 'lodash/sortBy';
import binary from '../util/binary';

Archive.init({
  workerUrl: '/libarchive.js/worker-bundle.js',
});

const extractJson = async(dir: any, path: string) => {
  // const file = await dir[path].extract();
  const text = await dir[path].text();
  return JSON.parse(text);
};

const ts = (timeStamp: number | string) => Math.floor(Number(timeStamp) * 1000);

const getDeviceType = (width: number) => {
  if (width < 600) return 'xs';
  if (width < 960) return 'sm';
  if (width < 1264) return 'md';
  return 'lg';
};

export const useStore = defineStore('store', {
  state: () => ({
    dataLoaded: false,
    exportNeeded: false,
    binaryData: null as null | Buffer,
    binarySource: 'download',
    status: 'Loading...',
    users: {} as Record<string, User>,
    channels: [] as Channel[],
    exportConfig: {
      preferDisplayName: true,
      hideChannelMessages: true,
      skipArchivedChannels: true,
      removeLinkPreviews: false,
    },
    coffeeMenu: false,
    leftSidebar: false,
    deviceWidth: window.innerWidth,
    deviceType: getDeviceType(window.innerWidth),
  }),

  actions: {
    async loadBinary() {
      try {
        if (!this.binaryData) {
          this.status = 'Downloading...';
          const res = await fetch('/export.bin.zip');
          if (!res.ok) {
            this.exportNeeded = true;
            this.status = 'Waiting for export';
            return;
          }
          const archive = await Archive.open(new File([await res.arrayBuffer()], 'export.bin.zip'));
          const dir = await archive.extractFiles();
          const binFile = dir['export.bin'] as File;
          this.binaryData = Buffer.from(await binFile.arrayBuffer());
          this.binarySource = 'download';
        } else {
          this.binarySource = 'upload';
        }
        this.status = 'Extracting...';
        const { channels, users } = await binary.decode(this.binaryData);
        this.channels = channels.map((c: Channel) => ({ ...c, rootMessages: c.messages?.filter((m: Message) => !m.threadId) }));
        users.forEach((user: User) => { this.users[user.id] = user; });
        this.status = 'Done';
        this.dataLoaded = true;
      } catch (e: any) {
        this.status = `Error: ${e.message}`;
        console.error(e);
      }
    },

    processUser(user: any): User {
      return {
        id: user.id,
        name: (this.exportConfig.preferDisplayName ? user.profile?.display_name : user.profile?.real_name)
          || user.profile?.real_name || user.name || '',
        image: user.profile?.image_1024 || user.profile?.image_512 || user.profile?.image_192,
        image24: user.profile?.image_24,
        image72: user.profile?.image_72,
      };
    },

    processMessage(message: any): Message {
      return {
        id: ts(message.ts),
        type: message.subtype || message.type || 'message',
        text: message.text?.trim() || '',
        userId: message.user,
        ts: ts(message.ts),
        isEdited: !!message.edited,
        threadId: message.parent_user_id ? ts(message.thread_ts) : undefined,
        replyCount: message.reply_count || message.replies?.length,
        replyUsersCount: message.reply_users_count || message.replies_users?.length,
        latestReply: message.latest_reply ? ts(message.latest_reply) : undefined,
        replyMessageIds: message.replies?.map((r: any) => ts(r.ts)),
        replyUserIds: message.reply_users,
        reactions: message.reactions?.map((r: any) => ({
          name: r.name,
          count: r.count,
          userIds: r.users,
        })),
        files: message.files?.map((f: any) => ({
          id: f.id,
          name: f.name || f.filetype ? `${f.id}.${f.filetype}` : 'Untitled',
          mimeType: f.mimetype,
          src: f.url_private,
          width: f.original_w,
          height: f.original_h,
        })).filter((f: FileObject) => f.src && f.mimeType && f.id),
        attachments: message.attachments?.map((a: any) => ({
          serviceName: a.service_name,
          serviceIcon: a.service_icon,
          title: a.title,
          titleUrl: a.title_link,
          text: a.text,
          thumbUrl: a.thumb_url,
          imageUrl: a.image_url,
          quoteId: a.ts ? ts(a.ts) : undefined,
          channelId: a.channel_id,
        })).filter((a: any) => !!a.quoteId || !this.exportConfig.removeLinkPreviews),
      };
    },

    processChannel(channel: any): Channel {
      return {
        id: channel.id,
        name: channel.name,
        isArchived: channel.is_archived,
        isGeneral: channel.is_general,
        topic: channel.topic?.value,
        purpose: channel.purpose?.value,
        // pinnedMessageIds: channel.pins?.map((i: any) => ts(i.created)),
        messages: channel.messages?.map((m: any) => this.processMessage(m)) || [],
      };
    },

    async loadExport(file: File) {
      try {
        this.exportNeeded = false;
        this.status = 'Extracting...';
        const archive = await Archive.open(file);
        const dir = await archive.extractFiles() as any;
        this.status = 'Processing Channels...';
        const allChannels = await extractJson(dir, 'channels.json');
        const allUsers = await extractJson(dir, 'users.json');
        const users = allUsers.map((u: any) => this.processUser(u));
        const channels = allChannels
          .filter((c: any) => !c.is_archived || !this.exportConfig.skipArchivedChannels)
          .map((c: any) => this.processChannel(c));
        await channels.reduce(async(promise: typeof Promise, c: Channel, i: number) => {
          await promise;
          this.status = `Processing Messages for #${c.name} (${i + 1}/${channels.length})`;
          const messages: any[] = [];
          await Promise.all(Object.keys(dir[c.name]).map(async(path) => {
            const dateMessages = await extractJson(dir[c.name], path);
            messages.push(
              ...dateMessages
                .filter((m: any) => !m.subtype?.startsWith('channel_') || !this.exportConfig.hideChannelMessages)
                .map((m: any) => this.processMessage(m)),
            );
          }));
          c.messages = sortBy(messages, 'ts');
        }, Promise.resolve());
        this.status = 'Making Binary...';
        this.binaryData = await binary.encode({ channels, users });
      } catch (e: any) {
        this.status = `Error: ${e.message}`;
        console.error(e);
      }
    },

    async downloadBinary() {
      if (!this.binaryData) {
        return;
      }
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const blob = new Blob([this.binaryData], { type: 'application/octet-stream' });
      zip.file('export.bin', blob);
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.bin.zip';
      a.click();
      URL.revokeObjectURL(url);
    },

    toggleSidebar() {
      this.leftSidebar = !this.leftSidebar;
    },

    onWidthChange() {
      this.deviceWidth = window.innerWidth;
      this.deviceType = getDeviceType(this.deviceWidth);
    },
  },
});
