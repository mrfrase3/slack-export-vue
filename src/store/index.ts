import { defineStore } from 'pinia';
import { Archive } from 'libarchive.js/main.js';
import sortBy from 'lodash/sortBy';
import { Document } from 'flexsearch';
import type { Content, JSONContent } from '@tiptap/vue-3';
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
    exportUrl: localStorage.getItem('exportUrl') || null,
    binaryData: null as null | Buffer,
    binarySource: 'download',
    status: 'Loading...',
    users: {} as Record<string, User>,
    channels: [] as Channel[],
    messagesById: {} as Record<string, Message>,
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
    activeSearch: {
      type: 'oneLine',
      content: [{
        type: 'paragraph',
      }],
    } as Content,
    lastMentionQuery: '',
    messageIndex: new Document({
      document: {
        id: 'id',
        tag: 'tag',
        index: 'content',
      },
      worker: true,
      charset: 'latin:advanced',
    }),
  }),

  actions: {
    async loadBinary(url?: string) {
      try {
        if (!this.binaryData) {
          this.status = 'Downloading...';
          const res = await fetch(url || '/export.bin.zip');
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
          if (url) this.setExportUrl(url);
        } else {
          this.binarySource = 'upload';
          this.setExportUrl(null);
        }
        this.status = 'Extracting...';
        const { channels, users } = await binary.decode(this.binaryData);
        this.channels = [];
        this.users = {};
        this.messagesById = {};
        this.channels = channels.map((c: Channel) => ({ ...c, rootMessages: c.messages?.filter((m: Message) => !m.threadId) }));
        const usersMap = {} as Record<string, User>;
        users.forEach((user: User) => { usersMap[user.id] = user; });
        this.users = usersMap;
        this.status = 'Indexing...';
        const docs = [] as any[];
        const messagesById = {} as Record<string, Message>;
        channels.forEach((channel: Channel) => {
          channel.messages.forEach((message: Message) => {
            if (message.type.startsWith('bot') || !message.userId) return;
            docs.push({
              id: `${message.channelId}-${message.id}`,
              tag: message.tags,
              content: message.text.replace(/(<[^>]+>)|\*|_|•|◦|▪︎/g, ''),
            });
            messagesById[`${message.channelId}-${message.id}`] = message;
          });
        });
        sortBy(docs, (d: any) => Number(d.id.split('-')[1]) * -1).forEach((doc: any) => this.messageIndex.add(doc));
        this.messagesById = messagesById;
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

    processMessage(message: any, channel: any): Message {
      const tags = [];
      const type = message.subtype || message.type || 'message';
      if (!type?.startsWith('bot') && message.user) {
        tags.push(`in:${channel.id}`);
        if (message.user) tags.push(`from:${message.user}`);
        message.text.match(/<@(U[\w]+)>/g)?.forEach((mention: string) => {
          const userId = mention.replace(/<@(U[\w]+)>/, '$1');
          tags.push(`mentions:${userId}`);
        });
      }
      return {
        id: ts(message.ts),
        type,
        text: message.text?.trim() || '',
        userId: message.user,
        channelId: channel.id,
        ts: ts(message.ts),
        tags,
        isEdited: !!message.edited,
        editedAt: message.edited?.ts ? ts(message.edited.ts) : undefined,
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
          thumbWidth: a.thumb_width,
          thumbHeight: a.thumb_height,
          imageUrl: a.image_url,
          imageWidth: a.image_width,
          imageHeight: a.image_height,
          authorName: a.author_name,
          authorUrl: a.author_link,
          videoHtml: a.video_html,
          videoWidth: a.video_html_width,
          videoHeight: a.video_html_height,
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
        messages: channel.messages?.map((m: any) => this.processMessage(m, channel)) || [],
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
                .map((m: any) => this.processMessage(m, c)),
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

    async updateBinary(channels: Channel[], users: User[]) {
      this.binaryData = await binary.encode({ channels, users });
    },

    async checkIfBinZip(file: File) {
      try {
        this.status = 'Checking Files...';
        const archive = await Archive.open(file);
        const dir = await archive.getFilesObject() as any;
        if (!dir['export.bin']) return false;
        const binFile = await dir['export.bin']?.extract() as File;
        this.binaryData = Buffer.from(await binFile.arrayBuffer());
        this.exportNeeded = false;
        await this.loadBinary();
        return true;
      } catch (e: any) {
        return false;
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

    setExportUrl(url: string | null) {
      this.exportUrl = url;
      if (url) localStorage.setItem('exportUrl', url);
      else localStorage.removeItem('exportUrl');
    },

    searchUsers(query: string) {
      this.lastMentionQuery = query;
      return sortBy(
        Object.values(this.users).filter((u: User) => u.name.toLowerCase().includes(query.toLowerCase())),
        [(u: User) => u.name.toLowerCase().indexOf(query.toLowerCase()), (u: User) => u.name.toLowerCase()],
      );
    },

    searchChannels(query: string) {
      this.lastMentionQuery = query;
      return sortBy(
        this.channels.filter((c: Channel) => c.name.toLowerCase().includes(query.toLowerCase())),
        [(c: Channel) => c.name.toLowerCase().indexOf(query.toLowerCase()), (c: Channel) => c.name.toLowerCase()],
      );
    },

    async searchMessages(query: string | JSONContent[], limit = 50, offset = 0) {
      let searchText = '';
      const tags = [] as string[];
      if (typeof query === 'string') {
        query.match(/((mentions)|(from)|(in)):\w+/g)?.forEach((tag) => {
          tags.push(tag);
        });
        searchText = query.replace(/((mentions)|(from)|(in)):\w+/g, '');
      } else {
        query.forEach((content) => {
          if (content.type === 'text') {
            searchText += content.text;
          } else if (content.type === 'mention') {
            if (content.attrs?.id) tags.push(content.attrs?.id);
          }
        });
      }
      searchText = searchText.replace(/(\s{2,})|\+/g, ' ').trim() || '';
      let bool = 'and';
      if (tags.filter(t => t.startsWith('from:')).length > 1) bool = 'or';
      if (tags.filter(t => t.startsWith('in:')).length > 1) bool = 'or';
      if (!searchText && !tags.length) return [];
      // the flexsearch library forces to index by tags if there's no searchText
      // so we find them ourselves, which is probably faster anyway
      if (!searchText) {
        const results = [] as Message[];
        Object.values(this.messagesById).forEach((m: Message) => {
          if (tags[bool === 'and' ? 'every' : 'some']((t: string) => m.tags.includes(t))) results.push(m);
        });
        return sortBy(results, (m: Message) => m.ts * -1).slice(offset, offset + limit);
      }
      const results = await this.messageIndex.searchAsync({
        query: searchText,
        limit,
        offset,
        ...(tags.length ? { index: 'content', tag: tags, bool } : {}),
      });
      const ids = results[0]?.result || [] as string[];
      return ids.map((id: string) => this.messagesById[id]);
    },
  },
});
