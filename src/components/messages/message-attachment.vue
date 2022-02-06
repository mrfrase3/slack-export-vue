<script lang="ts" setup>
import formatMessage from '../../util/formatMessage';

const store = useStore();
const props = defineProps<{
  attachment: Attachment
  msg: Message
}>();
const wrapper = ref(null as null | HTMLDivElement);
const videoPlay = ref(false);

const imageFile = computed((): FileObject | null => {
  if (!props.attachment.imageUrl) {
    return null;
  }
  return {
    id: '1',
    name: 'image.png',
    mimeType: 'image/png',
    src: props.attachment.imageUrl,
    width: props.attachment.imageWidth,
    height: props.attachment.imageHeight,
  };
});

const serviceIcon = computed((): string | null => {
  if (!props.attachment.serviceIcon) {
    return null;
  }
  return `https://slack-imgs.com/?c=1&o1=wi32.he32.si&url=${encodeURIComponent(props.attachment.serviceIcon)}`;
});

const videoThumbStyle = computed(() => {
  if (!props.attachment.thumbHeight || !props.attachment.thumbWidth) return {};
  const ratio = props.attachment.thumbWidth / props.attachment.thumbHeight;
  const width = Math.min(360, props.attachment.thumbWidth);
  const height = width / ratio;
  return {
    backgroundImage: `url(${props.attachment.thumbUrl})`,
    width: `${width}px`,
    height: `${height}px`,
  };
});

const quote = computed(() => {
  if (!props.attachment.quoteId) return null;
  const key = `${props.attachment.channelId}-${props.attachment.quoteId}`;
  return store.messagesById[key];
});

const quoteChannel = computed(() => {
  if (!quote.value) return null;
  return store.channels.find((c: Channel) => c.id === quote.value.channelId);
});

const quoteTime = computed(() => {
  if (!quote.value) return '';
  return dayjs(quote.value.ts).format('MMM Do, YYYY');
});

const service = computed(() => {
  if (quote.value) {
    const user = store.users[quote.value.userId];
    return {
      name: user.name,
      icon: user.image24,
    };
  }
  return {
    name: props.attachment.serviceName,
    icon: serviceIcon.value,
  };
});

</script>

<template>
  <blockquote ref="wrapper" class="formatter-bq">
    <div v-if="service" class="attach-service">
      <img v-if="service.icon" :src="service.icon" alt="">
      {{ service.name }}
      <a
        v-if="attachment.authorName && !quote"
        class="attach-author"
        :href="attachment.authorUrl"
        target="_blank"
      >
        {{ attachment.authorName }}
      </a>
    </div>
    <div class="attach-main">
      <div class="attach-content">
        <a class="attach-title" :href="attachment.titleUrl" target="_blank">
          {{ attachment.title }}
        </a>
        <div class="attach-text" v-html="formatMessage(attachment.text || '', store.users, store.channels)" />
        <router-link v-if="quote" class="quote-link" :to="`/channel/${quote.channelId}?threadRef=${quote.channelId}-${quote.id}`">
          <span>Posted in #{{ quoteChannel.name }}</span>
          <span>{{ quoteTime }}</span>
          <span>View message</span>
        </router-link>
      </div>
      <div v-if="attachment.thumbUrl && !attachment.videoHtml" class="attach-thumbnail">
        <img :src="attachment.thumbUrl" alt="">
      </div>
    </div>
    <div v-if="attachment.videoHtml">
      <div class="video-thumbnail" :style="videoThumbStyle">
        <div v-if="!videoPlay" class="video-actions">
          <button class="btn btn-icon" @click="videoPlay = true">
            <icon icon="mdi:play-outline" />
          </button>
          <a class="btn btn-icon" :href="attachment.titleUrl" target="_blank">
            <icon icon="mdi:open-in-new" />
          </a>
        </div>
        <div v-else class="video-player" v-html="attachment.videoHtml" />
      </div>
    </div>
    <file-preview
      v-if="imageFile"
      :file="imageFile"
      :max-width="wrapper?.offsetWidth"
      :max-height="200"
    />
  </blockquote>
</template>

<style scoped>

.formatter-bq {
  margin: 8px 0;
}

.attach-service {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-weight: 600;
}

.attach-service img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.attach-author {
  margin-left: 4px;
  border-left: 1px solid #ddd;
  padding-left: 4px;
  color: #999;
  font-weight: normal;
  text-decoration: none;
}

.attach-author:hover {
  text-decoration: underline;
  color: #666;
}

.attach-main {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 4px;
}

.attach-content {
  flex: 1;
}

.attach-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: rgb(18, 100, 163);
  text-decoration: none;
}

.quote-link {
  font-size: 12px;
  text-decoration: none;
  color: #666;
}

.quote-link span {
  padding-right: 4px;
}
.quote-link span:not(:first-child) {
  border-left: 1px solid #ddd;
  padding-left: 4px;
}
.quote-link span:last-child {
  color: rgb(18, 100, 163);
}
.quote-link span:hover {
  text-decoration: underline;
}

.attach-thumbnail {
  max-width: 80px;
  max-height: 80px;
  border-radius: 4px;
  margin-left: 4px;
}

.attach-thumbnail img {
  max-width: 100%;
  max-height: 100%;
}

.video-thumbnail {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 16px;
  color: white;
}

.video-actions button {
  margin-right: 24px;
}

.video-actions .btn {
  font-size: 3em;
}

.video-player iframe{
  width: 100%;
  height: 100%;
}

</style>
