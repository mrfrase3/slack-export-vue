<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import SearchInput from './search-input.vue';

const store = useStore();
const emit = defineEmits(['close']);
const searchInput = ref(null as null | typeof SearchInput);

defineExpose({
  searchInput,
});

</script>

<template>
  <div class="search-input-spash" @click="emit('close')">
    <div class="search-input-container" @click.stop="">
      <div class="search-area">
        <div class="search-box-icon main-icon">
          <icon icon="mdi:search" />
        </div>
        <search-input ref="searchInput" @close="emit('close')" />
        <button
          v-show="store.activeSearch?.content?.[0]?.content?.length"
          class="clear-btn"
          @click="searchInput?.clearContent()"
        >
          Clear
        </button>
        <button class="close-icon" @click="emit('close')">
          <icon icon="mdi:close" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.search-input-spash {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.search-input-container {
  width: 100%;
  max-width: 900px;
  max-height: 500px;
  margin-top: calc((var(--navbar-height) - 24px) / 2);
  background-color: #fff;
  color: black;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.search-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.search-box-icon {
  margin-left: 28px;
  margin-right: 12px;
  font-size: 20px;
  height: 20px;
}

.search-box-icon.main-icon {
  color: #666;
}

.close-icon {
  background: transparent;
  border: 0;
  padding: 0 8px;
  font-size: 20px;
  height: 20px;
  color: #666;
  margin-right: 16px;
  cursor: pointer;
}

.clear-btn {
  padding: 0 16px;
  background: transparent;
  border: none;
  border-right: 1px solid #ddd;
  color: #666;
  cursor: pointer;
}

</style>
