<script setup lang="ts">
import Popper from 'vue3-popper';

const store = useStore();
const props = defineProps<{
  react: Reaction
}>();

const colonEmoji = computed(() => `:${props.react.name}:`);
const emojiHtml = computed(() => emoji.replace_colons(colonEmoji.value));
const src = computed(() => emojiHtml.value.match(/https?:\/\/[^)]+/)?.[0]);

const userNames = computed(() => {
  let names = props.react.userIds.map((userId: string, i: number) => {
    const user = store.users[userId];
    let prefix = '';
    if (i !== 0 && i === props.react.userIds.length - 1) prefix = 'and ';

    return `${prefix}${user?.name}`;
  }).filter(Boolean).sort().slice(0, 10).join(', ');
  if (props.react.userIds.length > 10) names += ` +${props.react.userIds.length - 10} more`;

  return names;
});

</script>

<template>
  <popper placement="top" hover arrow>
    <div class="react-chip">
      <span v-html="emojiHtml" />
      <span class="react-count">
        {{ react.count }}
      </span>
    </div>
    <template #content>
      <div class="react-popper-content">
        <img :src="src" :alt="react.name">
        <br>
        <strong class="names">{{ userNames }}</strong>
        reacted with
        <strong>{{ colonEmoji }}</strong>
      </div>
    </template>
  </popper>
</template>

<style scoped>
.react-chip {
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  padding: 4px 6px;
  border-radius: 24px;
  background-color: #fafafa;
  color: #333;
  line-height: 16px;
  cursor: pointer;
  margin-right: 4px;
  margin-bottom: 4px;
  border: 1px solid #fafafa;
}

.react-chip:hover {
  background-color: #fff;
  border: 1px solid #ccc;
}

.react-chip .react-count {
  font-size: 12px;
  margin-left: 4px;
}

.react-popper-content {
  max-width: 200px;
  padding: 16px;
  border-radius: 8px;
  background-color: #333;
  color: #ccc;
  text-align: center;
  font-size: 14px;
}

.react-popper-content .names {
  color: white;
}

.react-popper-content img {
  width: 64px;
  height: 64px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
