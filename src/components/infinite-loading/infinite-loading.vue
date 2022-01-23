<script setup lang="ts">
import type { InfiniteLoadingParams } from './util';
import {
  infiniteEventEmitter,
  startScrollEvent,
  stateHandler,
} from './util';

const props = withDefaults(defineProps<{
  top?: boolean
  target?: string
  distance?: number
  identifier?: string | number
  firstLoad?: boolean
}>(), {
  top: false,
  distance: 0,
  firstLoad: true,
});

const slots = useSlots();
const emit = defineEmits(['infinite']);
const state = ref('');
const prevHeight = ref(0);
const id = ref(`v3-infinite-loading-${`${Math.random()}`.substring(2)}`);
const removeScrollEvent = ref(() => {});

const params = computed(() => ({
  state,
  target: props.target,
  distance: props.distance,
  top: props.top,
  firstLoad: props.firstLoad,
  emitInfiniteEvent: infiniteEventEmitter(emit, stateHandler(state)),
} as InfiniteLoadingParams));

watch(state, (newVal) => {
  const el = (props.target && document.querySelector(props.target)) || document.documentElement;
  if (newVal === 'loaded' && top) {
    Promise.resolve().then(() => {
      el.scrollTop = el.scrollHeight - prevHeight.value;
    });
    prevHeight.value = el.scrollHeight;
  }
  if (newVal === 'complete') removeScrollEvent.value();
});

watch(() => props.identifier, () => {
  state.value = '';
  removeScrollEvent.value();
  removeScrollEvent.value = startScrollEvent(params.value, id.value);
});

onMounted(() => {
  removeScrollEvent.value = startScrollEvent(params.value, id.value);
  const el = (props.target && document.querySelector(props.target)) || document.documentElement;
  prevHeight.value = el.scrollHeight;
});
onUnmounted(() => {
  removeScrollEvent.value();
});
</script>

<template>
  <div :id="id" class="v3-infinite-loader">
    <slot v-if="state == 'loading'" name="spinner">
      <Spinner />
    </slot>
    <slot v-if="state == 'complete'" name="complete">
      <span> {{ slots?.complete || "No more results!" }} </span>
    </slot>
    <slot v-if="state == 'error'" name="error" :retry="params.emitInfiniteEvent">
      <span class="state-error">
        <span>{{ slots?.error || "Oops something went wrong!" }}</span>
        <button class="retry" @click="params.emitInfiniteEvent">retry</button>
      </span>
    </slot>
  </div>
</template>

<style scoped>
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.retry {
  margin-top: 8px;
  padding: 2px 6px 4px 6px;
  width: 60px;
  color: inherit;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  border: 2px solid currentColor;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}
.retry:hover {
  opacity: 0.8;
}

.v3-infinite-loader {
  text-align: center;
  padding: 4px 0;
}
</style>
