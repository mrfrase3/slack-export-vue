<script lang="ts" setup>
import debouncePromise from 'debounce-promise';

const route = useRoute();
const router = useRouter();
const store = useStore();

const results = ref([] as Message[]);
const limit = 50;

const query = computed(() => {
  if (!store.dataLoaded || route.name !== 'search') {
    return null;
  }
  return (route.query.query && JSON.parse(`${route.query.query}`)) || null;
});

const page = computed(() => {
  if (!store.dataLoaded || route.name !== 'search') {
    return 0;
  }
  return Number(route.query.page || 0);
});

const setPage = (page: number) => {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      page: page || undefined,
    },
  });
};

const loadResults = async() => {
  if (!query.value) {
    return;
  }

  const msgs = await store.searchMessages(query.value, limit, limit * page.value);
  // console.log('results', msgs);
  results.value = msgs;
};

const debouncedLoadResults = debouncePromise(() => loadResults(), 100);

onMounted(() => {
  if (!route.query.query) {
    router.push('/');
    return;
  }
  loadResults();
});

watch(query, (to, from) => {
  if (to && JSON.stringify(to) !== JSON.stringify(from)) {
    if (from) setPage(0);
    debouncedLoadResults();
    if (!from && JSON.stringify(to) !== JSON.stringify(store.activeSearch.content[0].content)) {
      store.activeSearch.content[0].content = to;
    }
  }
});

watch(page, async(to, from) => {
  if (to !== from) {
    await debouncedLoadResults();
    nextTick(() => {
      const el = document.getElementById('search-top');
      el?.scrollIntoView();
    });
  }
});

</script>

<template>
  <div class="results-list">
    <div id="search-top" />
    <h1>
      <search-text v-if="query" :content="query" prefix="Search Results For: " large />
    </h1>
    <p v-if="page > 0">
      Results
      <span>
        {{ (page * limit) + 1 }}
        &mdash;
        {{ (page * limit) + results.length }}
      </span>
    </p>
    <search-result
      v-for="(message, i) in results"
      :key="i"
      :message="message"
    />
    <div v-if="results.length === 0" class="no-results">
      <p>No results found.</p>
    </div>
    <div v-else-if="page !== 0 || results.length === limit" class="pagination">
      <button
        class="btn btn-icon"
        :class="{ disabled: page < 1 }"
        @click="page > 0 && setPage(page - 1)"
      >
        <icon icon="mdi:chevron-left-circle-outline" />
      </button>
      <span class="pagination-page">
        {{ (page * limit) + 1 }}
        &mdash;
        {{ (page * limit) + results.length }}
      </span>
      <button
        class="btn btn-icon"
        :class="{ disabled: results.length < limit }"
        @click="results.length === limit && setPage(page + 1)"
      >
        <icon icon="mdi:chevron-right-circle-outline" />
      </button>
    </div>
  </div>
</template>

<style scoped>

.results-list {
  padding: 16px;
  background: #f8f8f8;
  min-height: calc(100% - var(--navbar-height));
}

.no-results {
  text-align: center;
  font-size: 1.5em;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-page {
  margin: 0 8px;
}

</style>
