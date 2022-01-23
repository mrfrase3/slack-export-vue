import type { Ref } from 'vue';

interface StateHandler {
  loading(): void
  loaded(): void
  complete(): void
  error(): void
}

const stateHandler = (state: Ref) => ({
  loading() {
    state.value = 'loading';
  },
  loaded() {
    state.value = 'loaded';
  },
  complete() {
    state.value = 'complete';
  },
  error() {
    state.value = 'error';
  },
} as StateHandler);

function infiniteEventEmitter(emit: Function, stateHandler: StateHandler) {
  return () => {
    stateHandler.loading();
    emit('infinite', stateHandler);
  };
}

function isVisible(el: Element, view: Element) {
  const rect = el.getBoundingClientRect();
  return Math.abs(rect.top) * 2 <= view.clientHeight || !view.clientHeight;
}

interface InfiniteLoadingParams {
  state?: Ref
  distance?: number
  target?: string
  emitInfiniteEvent: () => void
  top?: boolean
  firstLoad?: boolean
}

// generate event handler
const getEventHandler = (el: Element, { state, distance, emitInfiniteEvent, top }: InfiniteLoadingParams) => {
  return () => {
    if (!state) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const validState = state.value === 'loaded' || !state.value;

    if (top && Math.ceil(scrollTop) - (distance || 0) <= 0 && validState) emitInfiniteEvent();
    if (!top && Math.ceil(scrollTop) + clientHeight >= scrollHeight - (distance || 0) && validState) { emitInfiniteEvent(); }
  };
};

const startScrollEvent = (params: InfiniteLoadingParams, id: string): () => void => {
  if (params.target && !document.querySelector(params.target)) {
    throw new Error('Vue3 infinite loading: target prop should be a valid css selector');
  }

  const el = params.target ? document.querySelector(params.target) : document.documentElement;
  const target = params.target ? document.querySelector(params.target) : window;
  const infiniteLoading = document.getElementById(id);

  if (!el || !target) throw new Error('Vue3 infinite loading: target prop should be a valid css selector');
  if (!infiniteLoading) throw new Error('Vue3 infinite loading: infinite-loading element not found');

  if (isVisible(infiniteLoading, el) && params.firstLoad) params.emitInfiniteEvent();

  const eventHandler = getEventHandler(el, params);
  target.addEventListener('scroll', eventHandler);

  // remove scroll event
  return () => {
    target.removeEventListener('scroll', eventHandler);
  };
};

export { stateHandler, infiniteEventEmitter, startScrollEvent, InfiniteLoadingParams, StateHandler };
