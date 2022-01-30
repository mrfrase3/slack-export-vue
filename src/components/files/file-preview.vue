<script setup lang="ts">

const props = defineProps<{
  file: FileObject
  maxWidth?: number
  maxHeight?: number
}>();

const type = computed(() => {
  return props.file.mimeType.split('/')[0];
});

const src = computed(() => {
  return props.file.src;
});

const style = computed(() => {
  if (!props.file.width || !props.file.height || !props.maxWidth) return {};
  const maxWidth = props.maxWidth;
  const maxHeight = props.maxHeight || 360;
  const fileWidth = props.file.width;
  const fileHeight = props.file.height;
  const ratio = fileWidth / fileHeight;
  const height = Math.min(ratio > 1 ? maxWidth / ratio : maxHeight, fileHeight);
  return {
    // width: `${props.file.width}px`,
    height: `${height}px`,
  };
});

</script>

<template>
  <div class="file-preview" :style="maxHeight ? { maxHeight: `${maxHeight}px` } : {}">
    <video v-if="type === 'video'" :src="src" controls :style="style" />
    <a v-else :href="src" target="_blank" @click.stop="">
      <img v-if="type === 'image'" :src="src" :alt="props.file.name" :style="style">
      <div
        v-else
        :style="maxHeight ? { height: `${maxHeight}px`, width: `${maxHeight}px` } : {}"
        class="unknown-preview"
      >
        <icon icon="mdi:file-download-outline" style="font-size: 48px;" />
        <div v-if="!maxHeight || maxHeight > 150" class="file-name">{{ props.file.name }}</div>
      </div>
    </a>
  </div>
</template>

<style scoped>

.file-preview {
  /* display: inline-block; */
  max-height: 360px;
  margin-right: 4px;
  margin-bottom: 4px;
}

.file-preview a {
  display: inline-block;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.file-preview a:hover {
  text-decoration: none;
}

.file-preview video {
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.file-preview img {
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.unknown-preview {
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;
  flex-direction: column;
}

.unknown-preview:hover {
  background: #ddd;
}

.unknown-preview .file-name {
  font-size: 12px;
  padding: 8px;
}

</style>
