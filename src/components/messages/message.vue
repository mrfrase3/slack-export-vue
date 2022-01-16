<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import formatMessage from '../../util/formatMessage';
import Gallery from '../files/gallery.vue';
import ReactChip from './react-chip.vue';
import RepliesButton from './replies-button.vue';

const messages = ref([] as any[]);

const props = defineProps<{
  users: any,
  channels: any[],
  message: any,
  aboveMessage: any | null,
}>()

const isNewDate = computed(() => {
  const cDate = dayjs(props.message.ts * 1000).format('YYYY-MM-DD');
  const aDate = dayjs(props.aboveMessage?.ts * 1000).format('YYYY-MM-DD');
  return !props.aboveMessage || cDate !== aDate;
});

const isContinued = computed(() => {
  return !isNewDate.value && props.message.user === props.aboveMessage?.user;
});

const timestamp = computed(() => {
  return dayjs((props.message?.ts || 0) * 1000);
});

const user = computed(() => {
  return props.message.user_profile
    || props.users[props.message.user]?.profile;
});

const justEmoji = computed(() => {
  return props.message.text.match(/^:[+a-z0-9_-]+:$/i);
});

</script>

<template>
  <div :id="message.client_msg_id">
    <div v-if="isNewDate" class="message-list-date-wrap">
      <hr>
      <div class="message-list-date">
        {{timestamp.format('MMMM Do, YYYY')}}
      </div>
    </div>
    <div :class="{ message: true, continued: isContinued }" v-if="message">
      <div class="message-left">
        <div v-if="!isContinued" class="message-avatar">
          <img :src="user?.image_72" alt="">
        </div>
        <span v-else>{{timestamp.format('h:mm')}}</span>
      </div>
      <div class="message-main">
        <div v-if="!isContinued" class="message-header">
          <span class="message-author">
            {{ user?.display_name || user?.real_name || user?.name }}
          </span>
          <span class="message-timestamp">
            {{ timestamp?.format('h:mm a').toUpperCase() }}
          </span>
        </div>
        <div
          v-if="message.text"
          :class="{ 'message-content': true, 'just-emoji': justEmoji }"
          v-html="formatMessage(message.text, users, channels)"
        >
        </div>
        <gallery v-if="message.files?.length" :files="message.files" />
        <div v-if="message.reactions?.length" class="message-reactions">
          <react-chip
            v-for="reaction in message.reactions"
            :key="reaction.name"
            :react="reaction"
            :users="users"
          />
        </div>
        <replies-button
          v-if="message.replies?.length"
          :message="message"
          :users="users"
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

.message-content:deep(.message-link),
.message-content:deep(.mention) {
  cursor: pointer;
  color: rgb(18, 100, 163);
  text-decoration: none;
}

.message-content:deep(.mention) {
  background-color: rgba(29, 155, 209, 0.1);
  padding: 1px 2px;
  padding-top: 0;
  border-radius: 3px;
}

.message-content:deep(.message-link:hover),
.message-content:deep(.mention:hover) {
  color: rgb(11, 76, 140);
  text-decoration: underline;
}

.message-content:deep(ul) {
  padding: 0;
  margin: 0;
}

.message-content:deep(ul li) {
  list-style: none;
  margin-left: 28px;
}
.message-content:deep(ul[data-indent="1"] li) {
  margin-left: calc(28px * 2);
}
.message-content:deep(ul[data-indent="2"] li) {
  margin-left: calc(28px * 3);
}
.message-content:deep(ul[data-indent="3"] li) {
  margin-left: calc(28px * 4);
}
.message-content:deep(ul[data-indent="4"] li) {
  margin-left: calc(28px * 5);
}
.message-content:deep(ul[data-indent="5"] li) {
  margin-left: calc(28px * 6);
}
.message-content:deep(ul[data-indent="6"] li) {
  margin-left: calc(28px * 7);
}

.message-content:deep(ul li:before) {
  content: "•";
  margin-right: 6px;
  margin-left: -28px;
  font-size: 20px;
  vertical-align: bottom;
  display: inline-block;
  white-space: nowrap;
  line-height: 1;
  width: 22px;
  text-align: center;
}

.message-content:deep(ul[data-indent="1"] li:before),
.message-content:deep(ul[data-indent="4"] li:before) {
  content: "◦";
}
.message-content:deep(ul[data-indent="2"] li:before),
.message-content:deep(ul[data-indent="5"] li:before) {
  content: "▪︎";
}

.message-content:deep(.emoji) {
  font-size: 24px;
}
.message-content.just-emoji:deep(.emoji) {
  font-size: 36px;
}
</style>
