<script lang="ts" setup>
import type { JSONContent } from '@tiptap/vue-3';

const store = useStore();
const props = defineProps<{
  content: JSONContent[]
  prefix?: string
  large?: boolean
}>();

const getName = (item: JSONContent) => {
  const [action, id] = item.attrs?.id.split(':');
  if (action === 'from' || action === 'mentions') {
    return `${action}:@${store.users[id].name}`;
  } else if (action === 'in') {
    const channel = store.channels.find((c: Channel) => c.id === id);
    return `${action}:#${channel.name}`;
  }
  return '';
};

const getImgSrc = (item: JSONContent) => {
  const [action, id] = item.attrs?.id.split(':');
  if (action === 'from' || action === 'mentions') {
    return props.large ? store.users[id]?.image72 : store.users[id]?.image24;
  }
  return '';
};

</script>

<template>
  <span class="search-text">
    <span v-if="props.prefix" class="search-text-prefix">{{ props.prefix }}</span>
    <span
      v-for="(item, i) in props.content"
      :key="i"
      class="search-text-item"
    >
      <span
        v-if="item.type === 'text'"
        class="search-text-item-text"
      >
        {{ item.text }}
      </span>
      <span
        v-else-if="item.type === 'mention'"
        :class="{ 'search-text-item-mention': true, 'with-img': !!getImgSrc(item), 'large': props.large }"
      >
        <img v-if="getImgSrc(item)" :src="getImgSrc(item)" alt="">
        {{ getName(item) }}
      </span>
    </span>
  </span>
</template>

<style scoped>

.search-text-item-mention {
  background-color: rgba(29,155,209,0.1);
  padding: 0 6px;
  margin: 0 4px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  line-height: 20px;
  display: inline-block;
}

.search-text-item-mention.with-img {
  padding-left: 26px;
}

.search-text-item-mention img {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-left: -26px;
  margin-bottom: -6px;
}

.search-text-item-mention.large {
  font-size: 28px;
  line-height: 32px;
}

.search-text-item-mention.with-img.large {
  padding-left: 38px;
}

.search-text-item-mention.large img {
  width: 32px;
  height: 32px;
  margin-left: -38px;
  margin-bottom: -5px;
}

</style>
