<script lang="ts" setup>
import { highlight } from '../../util/highlight';

const store = useStore();
const props = defineProps<{
  type: 'users' | 'channels'
  items: User[] | Channel[]
  command: (itemObject: any) => void
}>();

const selectedIndex = ref(0);

interface ActionItem {
  user?: User
  channel?: Channel
  action: string
  id: string
}

const actionItems = computed(() => {
  if (props.type !== 'users') {
    return props.items.map(item => ({
      action: 'In',
      id: `in:${item.id}`,
      channel: item,
    } as ActionItem));
  }
  const items = [] as ActionItem[];
  props.items.forEach((item) => {
    items.push({
      user: item,
      action: 'From',
      id: `from:${item.id}`,
    });
    items.push({
      user: item,
      action: 'Mentions',
      id: `mentions:${item.id}`,
    });
  });
  return items;
});

const totalItems = computed(() => {
  return actionItems.value.length;
});

const selectItem = (index: number) => {
  const item = actionItems.value[index];

  if (item) {
    props.command(item);
  }
};

const upHandler = () => {
  selectedIndex.value = ((selectedIndex.value + totalItems.value) - 1) % totalItems.value;
};

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % totalItems.value;
};

const enterHandler = () => {
  selectItem(selectedIndex.value);
};

interface VueKeyboardEvent {
  event: KeyboardEvent
}

const onKeyDown = ({ event }: VueKeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }

  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }

  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }

  return false;
};

const getId = (item: ActionItem) => {
  return (props.type === 'users' ? item.user?.id : item.channel?.id) || item.id;
};

watch(props.items, () => {
  selectedIndex.value = 0;
});

watch(selectedIndex, () => {
  const item = actionItems.value[selectedIndex.value];
  document.getElementById(`mention-item-${item.action}-${getId(item)}`)?.scrollIntoView({ block: 'nearest' });
});

defineExpose({
  onKeyDown,
});

</script>

<template>
  <div class="mention-items">
    <template v-if="totalItems">
      <button
        v-for="(item, index) in actionItems"
        :id="`mention-item-${item.action}-${getId(item)}`"
        :key="index"
        class="mention-item"
        :class="{ 'is-selected': index === selectedIndex, 'action-width': props.type === 'users' }"
        @click="selectItem(index)"
        @mouseenter="selectedIndex = index"
      >
        <span class="mention-action">{{ item.action }}:</span>
        <img v-if="item.user?.image24" :src="item.user.image24" alt="" class="mention-item-img">
        <span v-if="props.type === 'channels'">#</span>
        <span v-html="highlight(item.user?.name || item.channel?.name, store.lastMentionQuery, 'mention-hl')" />
      </button>
    </template>
    <button v-else class="mention-item">
      No result
    </button>
  </div>
</template>

<style scoped>

.mention-items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #FFF;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow: auto;
  overflow: overlay;
}

.mention-item {
  display: flex;
  align-items: center;
  margin: 0;
  width: 100%;
  background: transparent;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.mention-item.is-selected {
  border-color: #666;
}

.mention-item:deep(.mention-hl) {
  background-color: rgba(var(--color-primary-rgb), 0.2);
}

.mention-item-img {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  margin-right: 4px;
}

.mention-action {
  font-size: 0.75em;
  margin-right: 4px;
  color: rgba(var(--color-primary-rgb), 0.8);
  font-weight: 600;
  text-align: right;
}

.mention-item.action-width .mention-action{
  width: 70px;
}
</style>
