<script lang="ts" setup>
import omit from 'lodash/omit';

const route = useRoute();
const router = useRouter();
const store = useStore();

const threadRef = ref(`${route.query.threadRef ?? ''}`);
const routeThreadRef = computed(() => {
  return `${route.query.threadRef ?? ''}`;
});

const channel = computed(() => {
  const channelId = threadRef.value.split('-')[0];
  return store.channels?.find((c: Channel) => c.id === channelId);
});

const message = computed(() => {
  const messageId = Number(threadRef.value.split('-')[1]);
  return channel.value?.rootMessages?.find((m: Message) => m.id === messageId);
});

const replies = computed(() => {
  const messageId = Number(threadRef.value.split('-')[1]);
  if (!message.value?.replyMessageIds?.length) return [];
  return channel.value?.messages?.filter((m: Message) => m.threadId === messageId
    || message.value?.replyMessageIds?.indexOf(m.id) !== -1) || [];
});

const close = () => {
  router.push({
    query: omit(route.query, 'threadRef'),
  });
};

const getAboveMessage = (i: number): Message => {
  if (i > 0) return replies.value[i - 1];
  return { ...message.value, userId: '' } as Message;
};

watch(routeThreadRef, () => {
  threadRef.value = `${route.query.threadRef ?? ''}`;
});

</script>

<template>
  <chat-header
    v-if="channel?.id"
    title="Thread"
    :subtitle="`#${channel?.name}`"
    :subtitle-to="{ params: { channelId: channel.id }, query: { ...route.query }, name: 'channel' }"
    show-close-button
    @close="close"
  />
  <div class="thread-list">
    <Message
      :message="message"
      :above-message="null"
      :channel-id="channel?.id || ''"
      style="margin: 16px 0;"
      id-ref="thread"
      hide-date-rule
      hide-replies
    />
    <hr>
    <div class="replies-count">
      <small>{{ replies.length }} Repl{{ replies.length === 1 ? 'y' : 'ies' }}</small>
    </div>
    <Message
      v-for="(reply, i) in replies"
      :key="reply.id"
      :message="reply"
      :above-message="getAboveMessage(i)"
      :channel-id="channel?.id"
      :class="{ last: i === replies.length - 1 }"
      hide-date-rule
      hide-replies
    />
  </div>
</template>

<style scoped>
hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ddd;
}

.thread-list {
  flex: 1;
  overflow-y: auto;
  overflow-y: overlay;
}

.last {
  margin-bottom: 64px;
}

.replies-count {
  padding: 0 16px;
  background: #fff;
  margin-top: -21px;
  width: fit-content;
}
</style>
