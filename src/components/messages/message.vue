<script setup lang="ts">
import Popper from 'vue3-popper';
import formatMessage from '../../util/formatMessage';

const store = useStore();
const route = useRoute();

const props = defineProps<{
  message: Message
  aboveMessage: Message | null
  channelId: string
  hideDateRule?: boolean
  hideReplies?: boolean
  smallReplies?: boolean
  nameDateFormat?: string
  idRef?: string
  fileMaxHeight?: number
}>();

const messages = ref([] as any[]);
const copyCopy = ref('Copy Link');

const timestamp = computed(() => {
  return dayjs(props.message?.ts);
});

const isNewDate = computed(() => {
  const cDate = timestamp.value.format('YYYY-MM-DD');
  const aDate = dayjs(props.aboveMessage?.ts).format('YYYY-MM-DD');
  return !props.aboveMessage || cDate !== aDate;
});

const isContinued = computed(() => {
  return !isNewDate.value && props.message.userId === props.aboveMessage?.userId;
});

const user = computed(() => {
  if (props.message.type.startsWith('bot')) {
    return {
      name: 'Bot',
      image: '/robot.png',
      image24: '/robot.png',
      image72: '/robot.png',
    } as unknown as User;
  }
  return store.users[props.message.userId];
});

const justEmoji = computed(() => {
  return props.message.text.match(/^(:[+a-z0-9_-]+:)+$/i);
});

const nameDate = computed(() => {
  return props.hideDateRule && isNewDate.value
    ? timestamp.value?.format(props.nameDateFormat || 'Do MMM, YYYY [at] h:mm a')
    : timestamp.value?.format('h:mm a').toUpperCase();
});

const id = computed(() => {
  return `${props.idRef || 'message'}-${props.message.id}`;
});

const threadRefMainId = computed(() => {
  const threadRef = route.query.threadRef || '';
  const message = store.messagesById[threadRef];
  if (!message?.threadId) return message?.id;
  return store.messagesById[`${props.channelId}-${message.threadId}`]?.id;
});

const isActive = computed(() => {
  const threadId = `${route.query.threadRef || ''}`.split('-')[1];
  return id.value === `message-${threadId}` || id.value === `message-${threadRefMainId.value}`;
});

// combine logic for showing/hiding each action to show if any are true
const showActions = computed(() => {
  return !props.message.threadId;
});

const copyLink = () => {
  const link = `${window.location.origin}/channel/${props.channelId}?threadRef=${props.channelId}-${props.message.id}`;
  navigator.clipboard.writeText(link);
  copyCopy.value = 'Copied!';
  setTimeout(() => {
    copyCopy.value = 'Copy Link';
  }, 2000);
};

</script>

<template>
  <div v-if="message?.id" :id="id">
    <div v-if="isNewDate && !hideDateRule" class="message-list-date-wrap">
      <hr>
      <div class="message-list-date">
        {{ timestamp.format('MMMM Do, YYYY') }}
      </div>
    </div>
    <div v-if="message" :class="{ message: true, continued: isContinued, active: isActive }">
      <div v-show="showActions" class="message-actions">
        <Popper v-if="!message.threadId" :show="copyCopy === 'Copied!' || null" placement="top" hover arrow>
          <button class="copy-link-btn" @click="copyLink">
            <icon icon="mdi:link-variant" />
          </button>
          <template #content>
            <div :class="{ 'copy-link-pop-text': true, success: copyCopy === 'Copied!' }">
              {{ copyCopy }}
            </div>
          </template>
        </Popper>
      </div>
      <div class="message-left">
        <div v-if="!isContinued" class="message-avatar">
          <img :src="user?.image72" alt="">
        </div>
        <span v-else>{{ timestamp.format('h:mm') }}</span>
      </div>
      <div class="message-main">
        <div v-if="!isContinued" class="message-header">
          <span class="message-author">
            {{ user?.name }}
          </span>
          <span class="message-timestamp">
            {{ nameDate }}
          </span>
        </div>
        <div
          v-if="message.text"
          :class="{ 'message-content': true, 'just-emoji': justEmoji, 'non-message': message.type !== 'message' }"
          v-html="formatMessage(message.text, store.users, store.channels)"
        />
        <file-gallery v-if="message.files?.length" :files="message.files" :max-height="fileMaxHeight" />
        <div v-if="message.reactions?.length || (message.replyCount && smallReplies)" class="message-reactions">
          <react-chip
            v-for="reaction in message.reactions"
            :key="reaction.name"
            :react="reaction"
          />
          <div
            v-if="message.replyCount && smallReplies"
            :style="{ marginLeft: message.reactions?.length ? '16px' : '0' }"
            class="small-replies"
          >
            <icon icon="mdi:message-reply-text-outline" />
            <span>
              {{ message.replyCount }}
              {{ message.replyCount === 1 ? 'reply' : 'replies' }}
            </span>
          </div>
        </div>
        <replies-button
          v-if="message.replyCount && !props.hideReplies && !props.smallReplies"
          :message="message"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

.message-list-date-wrap {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 16px 0;
}

.message-list-date-wrap hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ddd;
}

.message-list-date {
  margin-top: -23px;
  background: white;
  padding: 4px 8px;
  border: solid 1px #ddd;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
}

.message {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 20px;
}

.message.continued {
  padding-top: 4px;
}

.message:hover {
  background: #f5f5f5;
}

.message.active {
  background: rgb(255, 197, 38, 0.2);
}

.message-actions {
  position: absolute;
  top: -16px;
  right: 32px;
  display: none;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.message:hover .message-actions {
  display: block;
}
.message.continued .message-actions {
    top: -32px;
}

.copy-link-btn {
  padding: 4px 6px;
  height: 32px;
  font-size: 1.4em;
  background-color: #fff;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.copy-link-btn:hover {
  background-color: #eee;
}

.copy-link-pop-text {
  white-space: nowrap;
  width: 70px;
  text-align: center;
}
.copy-link-pop-text.success {
  color: #4caf50;
}

.message-left {
  width: 36px;
  text-align: right;
  color: #aaaaaa00;
}

.message-main {
  padding-left: 8px;
  overflow-wrap: anywhere;
  flex: 1;
  max-width: calc(100% - 44px);
}

.message-author {
  font-weight: 900;
}

.message-timestamp {
  font-size: 12px;
  color: #aaaaaa;
  margin-left: 4px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  overflow: hidden;
}

.message-avatar img {
  width: 100%;
}

.message:hover .message-left {
  color: #aaaaaa;
}

.message-reactions {
  margin-top: 4px;
}

.message-content {
  white-space: pre-wrap;
}

.message-content.non-message {
  color: #777;
}

.message-content:deep(.emoji) {
  font-size: 24px;
}
.message-content.just-emoji:deep(.emoji) {
  font-size: 36px;
}

.small-replies {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.small-replies:hover {
  text-decoration: underline;
}

.small-replies .icon {
  margin-right: 4px;
}

.message-reactions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
