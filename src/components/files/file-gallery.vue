<script setup lang="ts">

const props = defineProps<{
  files: FileObject[]
}>();

const isHidden = ref(false);

const displayName = computed(() => {
  if (props.files.length === 1) return props.files[0].name;

  return `${props.files.length} Files`;
});

</script>

<template>
  <div class="file-list">
    <div class="file-list-header">
      <span class="file-list-header-title">
        {{ displayName }}
      </span>
      <span class="file-list-header-actions">
        <icon :icon="`mdi:chevron-${isHidden ? 'right' : 'down'}-circle`" @click="isHidden = !isHidden" />
      </span>
    </div>
    <file-preview v-for="file in files" v-show="!isHidden" :key="file.id" :file="file" />
  </div>
</template>

<style scoped>
.file-list {
  display: flex;
  flex-wrap: wrap;
}

.file-list-header {
  color: #777;
  font-size: 12px;
  width: 100%;
}

.file-list-header-actions {
  padding-left: 4px;
  cursor: pointer;
}

</style>
