<script setup lang="ts">
import formatMessage from '../../util/formatMessage';

const messages = ref([] as any[]);
const store = useStore();

const props = defineProps<{
  message: Message
  aboveMessage: Message | null
  hideDateRule?: boolean
  hideReplies?: boolean
}>();

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
    ? timestamp.value?.format('Do MMM, YYYY [at] h:mm a')
    : timestamp.value?.format('h:mm a').toUpperCase();
});

</script>

<template>
  <div v-if="message?.id" :id="`message-${message.id}`">
    <div v-if="isNewDate && !hideDateRule" class="message-list-date-wrap">
      <hr>
      <div class="message-list-date">
        {{ timestamp.format('MMMM Do, YYYY') }}
      </div>
    </div>
    <div v-if="message" :class="{ message: true, continued: isContinued }">
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
        <file-gallery v-if="message.files?.length" :files="message.files" />
        <div v-if="message.reactions?.length" class="message-reactions">
          <react-chip
            v-for="reaction in message.reactions"
            :key="reaction.name"
            :react="reaction"
          />
        </div>
        <replies-button
          v-if="message.replyCount && !props.hideReplies"
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
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 20px;
}

.message.continued {
  padding-top: 0;
}

.message:hover {
  background: #f5f5f5;
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
</style>
