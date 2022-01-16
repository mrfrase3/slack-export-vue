<script setup lang="ts">
import debounce from 'lodash/debounce';
import formatMessage from '../../util/formatMessage';
import Message from './message.vue';
import { computed, nextTick, ref, watch } from 'vue';

const step = 30;
const skip = ref(step);
const scrollId = ref('');
const loading = ref(true);

const props = defineProps<{
  users: any,
  channels: any[],
  currentChannel: string,
}>()

const channel = computed(() => {
  return props.channels.find(c => c.name === props.currentChannel) || {
    name: '',
    rootMessages: [],
  };
});

const messages = computed(() => {
  return channel.value.rootMessages.slice(channel.value.rootMessages.length - skip.value);
});

const scrollToBottom = () => {
  const div = window.document.getElementById('message-list-content');
  if (!div) return;
  div.scrollTop = div.scrollHeight - div.clientHeight;
};

const scrollToBottomDebounced = debounce(() => {
  scrollToBottom();
}, 1000);

const getMoreMessages = () => {
  if (loading.value) return;
  const div = window.document.getElementById('message-list-content');
  if (channel.value.rootMessages.length && (div?.scrollTop || 0) < 5) {
    scrollId.value = messages.value[0]?.client_msg_id;
    skip.value = Math.min(skip.value + step, channel.value.rootMessages.length);
  }
};

const getMoreMessagesDebounced = debounce(getMoreMessages, 200);

const aboveMessage = (i : number) => {
  if (i > 0) {
    return messages.value[i - 1];
  }
  return null;
};

const noop = () => {};

watch(channel, () => {
  loading.value = true;
  skip.value = step;
  setTimeout(() => {
    if (!loading.value) return;
    loading.value = false;
    scrollToBottom();
    scrollToBottomDebounced();
    setTimeout(() => {
      loading.value = false;
    }, 50);
  }, 500);
});

watch(messages, () => {
  if (scrollId.value) {
    const div = window.document.getElementById(scrollId.value);
    if (div) {
      div.scrollIntoView(true);
    }
    setTimeout(() => {
      scrollId.value = '';
    }, 50);
  } else if (loading.value) {
    scrollToBottom();
    scrollToBottomDebounced();
    setTimeout(() => {
      loading.value = false;
    }, 50);
  }
});

</script>

<template>
  <div class="message-list">
    <div class="message-list-header">
      <div class="message-list-header-title">
        #{{channel.name}}
        <div
          v-if="channel?.topic?.value"
          class="message-list-header-topic"
          v-html="formatMessage(channel?.topic?.value, users, channels)"
        ></div>
      </div>
      <div class="message-list-header-actions">
      </div>
    </div>
    <div id="message-list-content">
      <div
        v-if="!scrollId && !loading && channel.rootMessages.length > skip"
        class="top"
        v-observe-visibility="{ callback: getMoreMessagesDebounced, throttle: 300 }"
      >
        <button @click="getMoreMessages">
          Load more
        </button>
      </div>
      <div
        v-if="channel.rootMessages.length === skip"
        class="no-messages"
      >
        No more messages to show, this is the beginning of the channel.
      </div>
      <message
        v-for="(message, i) in messages"
        :key="message.ts"
        :users="users"
        :channels="channels"
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

.message-list-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ccc;
}

.message-list-header-title {
  font-size: 20px;
  font-weight: 500;
}

.message-list-header-topic {
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin-top: 4px;
}

.message-list-header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#message-list-content {
  flex: 1;
  overflow-y: auto;
}

.no-messages {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 16px;
}
</style>
