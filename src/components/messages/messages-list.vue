<script setup lang="ts">
import { set } from 'lodash';
import chunk from 'lodash/chunk';
import ChatHeader from '../nav/chat-header.vue';

const store = useStore();
const route = useRoute();

const step = 30;
const pageTop = ref(0);
const pageBottom = ref(0);
const messages = ref([] as Message[]);

const channel = computed(() => {
  return store.channels?.find((c: Channel) => c.id === route.params?.channelId);
});

const messageChunks = computed(() => {
  return chunk([...(channel.value?.rootMessages ?? [])].reverse(), step) as Message[][];
});

const loadTopMessages = ($state: any) => {
  setTimeout(() => {
    if (!channel.value || !messageChunks.value[pageTop.value]) {
      $state.loaded();
      return;
    }
    const chunk = [...messageChunks.value[pageTop.value]] as Message[];
    messages.value.unshift(...chunk.reverse());
    pageTop.value++;
    if (pageTop.value >= messageChunks.value.length) {
      $state.complete();
    } else {
      $state.loaded();
    }
  }, 100);
};

const loadBottomMessages = ($state: any) => {
  setTimeout(() => {
    if (pageBottom.value <= 0) {
      $state.complete();
      return;
    }
    if (!channel.value || !messageChunks.value[pageBottom.value]) {
      $state.loaded();
      return;
    }
    const chunk = [...messageChunks.value[pageBottom.value]] as Message[];
    messages.value.push(...chunk.reverse());
    pageBottom.value++;
    if (pageBottom.value <= 0) {
      $state.complete();
    } else {
      $state.loaded();
    }
  }, 100);
};

const resetPaging = (force = false) => {
  let startPage = 0;
  const threadRef = `${route.query.threadRef}`;
  if (threadRef.startsWith(channel.value?.id) && messageChunks.value?.length && !force) {
    const threadId = Number(threadRef.split('-')[1]);
    messageChunks.value.forEach((chunk, i) => {
      if (chunk.some((m: Message) => m.id === threadId)) {
        startPage = i;
      }
    });
    setTimeout(() => {
      const el = document.querySelector(`#message-${threadId}`);
      if (el) {
        el.scrollIntoView();
      }
    }, 100);
  }
  pageTop.value = startPage + 1;
  pageBottom.value = startPage - 1;
  const chunk = (messageChunks.value[startPage] ? [...messageChunks.value[startPage]] : []) as Message[];
  messages.value = chunk.reverse();
  if (force) {
    nextTick(() => {
      const el = document.querySelector('#message-list-content');
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
};

const aboveMessage = (i: number) => {
  if (i > 0) return messages.value[i - 1];
  return null;
};

watch(channel, () => {
  resetPaging();
});

onMounted(() => {
  resetPaging();
});

</script>

<template>
  <div v-if="channel?.id" class="message-list">
    <chat-header :title="`#${channel.name}`" :subtitle="channel.topic" show-menu-button />
    <div id="message-list-content">
      <infinite-loading :identifier="channel?.id" target="#message-list-content" top :first-load="false" @infinite="loadTopMessages">
        <template #complete>
          <div class="no-messages">
            No more messages to show, this is the beginning of the channel.
          </div>
        </template>
      </infinite-loading>
      <message
        v-for="(message, i) in messages"
        :key="channel.rootMessages.indexOf(message)"
        :message="message"
        :above-message="aboveMessage(i)"
        :channel-id="channel.id"
      />
      <button v-show="pageBottom > 0" class="scroll-bottom-btn" @click="resetPaging(true)">
        <icon icon="mdi:arrow-down-circle-outline" />
        Scroll to Latest Messages
      </button>
      <infinite-loading :identifier="channel?.id" target="#message-list-content" :first-load="false" @infinite="loadBottomMessages">
        <template #complete>
          <span />
        </template>
      </infinite-loading>
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
  overflow-y: overlay;
  padding-bottom: 32px;
}

.no-messages {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 16px;
}
.scroll-bottom-btn {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 18px;
  border: 1px solid #aaa;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
}

.scroll-bottom-btn:hover {
  background: #eee;
}

.scroll-bottom-btn .icon {
    margin-right: 8px;
    font-size: 1.2em;
}
</style>
