<script lang="ts" setup>

const store = useStore();

const props = defineProps<{
  message: Message
}>();

const channel = computed(() => {
  return store.channels.find((c: Channel) => c.id === props.message.channelId);
});

const date = computed(() => {
  return dayjs(props.message.ts).format('MMM Do, YYYY');
});

</script>

<template>
  <router-link
    :to="`/channel/${channel.id}?threadRef=${channel.id}-${message.id}`"
    class="search-result-link"
  >
    <div class="search-result">
      <div class="search-result-header">
        <strong># {{ channel.name }}</strong>
        <span class="em">&mdash;</span>
        <span class="search-result-date">{{ date }}</span>
        <span class="hover-msg">View in channel</span>
      </div>
      <message
        :message="message"
        :channel-id="channel.id"
        :above-message="null"
        :file-max-height="75"
        name-date-format="h:mm a"
        hide-date-rule
        small-replies
      />
    </div>
  </router-link>
</template>

<style scoped>

.search-result-link {
  display: block;
  margin-bottom: 16px;
  text-decoration: none;
  color: inherit;
}

.search-result {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 12px 12px;
  border-radius: 16px;
}

.search-result-header {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.hover-msg {
  display: none;
  margin-left: 16px;
}

.search-result:hover .search-result-header strong,
.search-result:hover .search-result-header .search-result-date {
  color: rgb(18,100,164);
}

.search-result:hover .hover-msg {
  display: inline-block;
}

.search-result .em {
  margin: 0 4px;
}

.search-result:deep(.message) {
  background: #fff;
  padding: 0;
}

.search-result:deep(.message-content) {
  max-height: 256px;
  overflow: hidden;
}

</style>
