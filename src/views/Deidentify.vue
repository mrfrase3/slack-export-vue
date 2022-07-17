<script lang="ts" setup>
import { faker } from '@faker-js/faker';

const store = useStore();

const getVideoHtml = (width?: number, height?: number) => `
<iframe
  width="${width || 560}"
  height="${height || 315}"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
`;

const onDeidentify = async() => {
  const idMap = {} as Record<string, string>;
  const genId = (oldId: string) => {
    const prefix = oldId.substring(0, 1);
    const random = Math.random().toString(36).substring(2, 100).toUpperCase();
    const newId = `${prefix}${random.substring(0, oldId.length - 1)}`;
    idMap[oldId] = newId;
    return newId;
  };

  const newestMsgTs = Object.values(store.messagesById as Record<string, Message>)
    .reduce<number>((a: number, msg: Message) => Math.max(a, msg.ts), 0);
  const timeDiff = Date.now() - newestMsgTs;

  const getUserName = () => store.exportConfig.preferDisplayName ? faker.internet.userName() : faker.name.findName();

  const users = Object.values(store.users as Record<string, User>)
    .map((user: User) => {
      const id = genId(user.id);
      const image = user.image && faker.image.avatar();
      return {
        id,
        name: getUserName(),
        image,
        image24: image,
        image72: image,
      };
    }) as User[];

  store.channels.forEach((channel: Channel) => genId(channel.id));

  const randomId = (prefix: string) => {
    const ids = Object.values(idMap).filter(id => id.startsWith(prefix));
    return ids[Math.floor(Math.random() * ids.length)];
  };
  const deidentifyText = (text: string) => {
    return faker.lorem.text().replace(/^|\s(\w+)\s/g, (match, word) => {
      const roll = Math.random();
      let newWord = word;
      if (roll < 0.02) newWord = `<@${randomId('U')}>`;
      else if (roll < 0.025) newWord = `<#${randomId('C')}>`;
      return match.replace(word, newWord);
    });
  };

  const channels = store.channels.map((channel: Channel) => {
    const cid = idMap[channel.id];
    const messages = channel.messages.map((msg) => {
      const tags = msg.tags?.map((tag) => {
        const [prefix, oldId] = tag.split(':');
        return `${prefix}:${idMap[oldId]}`;
      });
      return {
        id: msg.id + timeDiff,
        ts: msg.ts + timeDiff,
        channelId: cid,
        type: msg.type,
        userId: msg.userId && idMap[msg.userId],
        text: msg.text && deidentifyText(msg.text),
        tags,
        isEdited: msg.isEdited,
        editedAt: msg.editedAt && (msg.editedAt + timeDiff),
        threadId: msg.threadId && (msg.threadId + timeDiff),
        replyCount: msg.replyCount,
        replyUsersCount: msg.replyUsersCount,
        latestReply: msg.latestReply && (msg.latestReply + timeDiff),
        replyMessageIds: msg.replyMessageIds?.map(ts => ts + timeDiff),
        replyUserIds: msg.replyUserIds?.map(uid => idMap[uid]),
        reactions: msg.reactions?.map(react => ({
          ...react,
          userIds: react.userIds?.map(uid => idMap[uid]),
        })),
        files: msg.files?.map((file) => {
          let src = faker.image.cats(file.width, file.height);
          if (file.mimeType.startsWith('video')) {
            src = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4';
          } else if (file.mimeType === 'application/pdf') {
            src = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
          }
          const ext = file.name.includes('.') ? file.name.split('.').pop() : faker.system.fileExt(file.mimeType);
          return {
            id: genId(file.id),
            src,
            name: `${faker.internet.domainWord()}.${ext}`,
            width: file.width,
            height: file.height,
            mimeType: file.mimeType,
          };
        }),
        attachments: msg.attachments?.map((att) => {
          return {
            serviceName: att.serviceName,
            serviceIcon: att.serviceIcon,
            title: att.title && faker.commerce.productName(),
            titleUrl: att.titleUrl && faker.image.cats(),
            text: att.text && deidentifyText(att.text),
            thumbUrl: att.thumbUrl && faker.image.cats(att.thumbWidth, att.thumbHeight),
            thumbWidth: att.thumbWidth,
            thumbHeight: att.thumbHeight,
            imageUrl: att.imageUrl && faker.image.cats(att.imageWidth, att.imageHeight),
            imageWidth: att.imageWidth,
            imageHeight: att.imageHeight,
            authorName: att.authorName && getUserName(),
            authorUrl: att.authorUrl && faker.image.avatar(),
            videoHtml: att.videoHtml && getVideoHtml(att.videoWidth, att.videoHeight),
            videoWidth: att.videoWidth,
            videoHeight: att.videoHeight,
            quoteId: att.quoteId && (att.quoteId + timeDiff),
            channelId: att.channelId && idMap[att.channelId],
          };
        }),
      } as Message;
    });
    return {
      id: cid,
      name: faker.internet.domainWord(),
      purpose: channel.purpose && faker.lorem.sentence(),
      topic: channel.topic && faker.lorem.sentence(),
      isArchived: channel.isArchived,
      isGeneral: channel.isGeneral,
      messages,
    };
  }).filter((chan: Channel) => chan.messages?.length) as Channel[];

  await store.updateBinary(channels, users);
  await store.loadBinary();
};

</script>

<template>
  <div class="page-wrap">
    <h1>Remove Identifying Data</h1>
    <button class="btn" @click="onDeidentify">
      <icon icon="mdi:incognito" />
      <span>De-identify</span>
    </button>
  </div>
</template>
<style scoped>

.page-wrap {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

</style>
