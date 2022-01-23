<script setup lang="ts">
import chunk from 'lodash/chunk';
import InfiniteLoading from 'v3-infinite-loading';
import ChatHeader from '../nav/chat-header.vue';

const store = useStore();
const route = useRoute();

const step = 30;
const page = ref(0);
const messages = ref([] as Message[]);

const channel = computed(() => {
  return store.channels?.find((c: Channel) => c.id === route.params?.channelId);
});

const messageChunks = computed(() => {
  return chunk([...(channel.value?.rootMessages ?? [])].reverse(), step) as Message[][];
});

const loadMessages = ($state: any) => {
  setTimeout(() => {
    if (!channel.value || !messageChunks.value[page.value]) {
      $state.loaded();
      return;
    }
    const chunk = [...messageChunks.value[page.value]] as Message[];
    messages.value.unshift(...chunk.reverse());
    page.value++;
    if (page.value >= messageChunks.value.length) {
      $state.complete();
    } else {
      $state.loaded();
    }
  }, 100);
};

const aboveMessage = (i: number) => {
  if (i > 0) return messages.value[i - 1];
  return null;
};

watch(channel, () => {
  messages.value = [];
});

</script>

<template>
  <div v-if="channel?.id" class="message-list">
    <chat-header :title="`#${channel.name}`" :subtitle="channel.topic" show-menu-button />
    <div id="message-list-content">
      <infinite-loading :identifier="channel?.id" target="#message-list-content" top first-load @infinite="loadMessages">
        <template #complete>
          <div class="no-messages">
            No more messages to show, this is the beginning of the channel.
          </div>
        </template>
      </infinite-loading>
      <message
        v-for="(message, i) in messages"
        :key="message.ts"
        :message="message"
        :above-message="aboveMessage(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#message-list-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 32px;
}

.no-messages {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 16px;
}

</style>
