<script lang="ts" setup>

const store = useStore();

const showSearchBox = ref(false);

</script>

<template>
  <search-box v-if="showSearchBox" @close="showSearchBox = false" />
  <div class="navbar">
    <button class="searchbar" @click="showSearchBox = true">
      <search-text
        v-if="store.activeSearch?.content?.[0]?.content?.length"
        :content="store.activeSearch.content[0].content"
        prefix="Search: "
      />
      <span v-else>Search Export</span>
      <div class="spacer" />
      <span class="search-icon">
        <icon icon="mdi:search" />
      </span>
    </button>
  </div>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  padding: 0 16px;
  background: var(--color-primary);
  color: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchbar {
  flex: 2;
  max-width: 730px;
  height: 24px;
  font-size: 13px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background-color: rgba(256, 256, 256, 0.15);
  color: rgba(256, 256, 256, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.searchbar:hover {
  background-color: rgba(256, 256, 256, 0.25);
}

.searchbar .search-icon {
  font-size: 16px;
  height: 16px;
}

</style>
