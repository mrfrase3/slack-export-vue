<script setup lang="ts">

const store = useStore();
const props = defineProps<{
  message: Message
}>();

const replyUserImgs = computed(() => {
  return props.message.replyUserIds?.map((userId: string) => {
    const user = store.users[userId];
    return {
      src: user.image24 || user.image72,
      alt: user.name,
    };
  }).splice(0, 5) || [];
});

const latest = computed(() => {
  return dayjs(props.message.latestReply);
});

</script>

<template>
  <a class="replies-btn">
    <div class="user-avatars">
      <img v-for="(userImg, i) in replyUserImgs" :key="i" v-bind="userImg">
    </div>
    <div class="replies-count">
      <span class="replies-count-text">
        {{ message.replyCount }}
        replies
      </span>
    </div>
    <div class="replies-info">
      <span class="last-reply">
        Last reply {{ latest.fromNow() }}
      </span>
      <span class="cta">
        View thread
      </span>
    </div>
    <div class="chevron">
      <icon icon="mdi:chevron-right" />
    </div>
  </a>
</template>

<style scoped>
.replies-btn {
  color: #888;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  margin-top: 4px;
  max-width: 600px;
  font-size: 14px;
}

.user-avatars img {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 4px;
}

.replies-count {
  color: rgb(18, 100, 163);
  font-weight: 700;
  margin-left: 4px;
  margin-right: 8px;
}

.replies-count:hover {
  text-decoration: underline;
}

.chevron {
  flex: 1;
  text-align: right;
  display: none;
  padding-right: 8px;
}

.replies-btn:hover {
  background-color: #fff;
  border: 1px solid #ccc;
}
.replies-btn .replies-info .cta {
  display: none;
}
.replies-btn:hover .replies-info .cta {
  display: inline;
}
.replies-btn:hover .replies-info .last-reply {
  display: none;
}
.replies-btn:hover .chevron {
  display: initial;
}
</style>
