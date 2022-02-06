<script setup lang="ts">
import Popper from 'vue3-popper';

const store = useStore();

const showFormatModal = process.env.NODE_ENV === 'development';

const resetExport = () => {
  store.binaryData = null;
  store.dataLoaded = false;
  store.exportNeeded = true;
};

</script>

<template>
  <div class="sidebar-footer">
    <popper
      v-if="store.binarySource === 'upload' || true"
      content="Download Binary"
      placement="top"
      hover arrow
    >
      <icon class="action-icon" icon="mdi:download" @click="store.downloadBinary()" />
    </popper>
    <popper content="Upload Export" placement="top" hover arrow>
      <icon class="action-icon" icon="mdi:upload" @click="resetExport" />
    </popper>
    <message-format-modal v-if="showFormatModal">
      <template #activator="{ on }">
        <icon class="action-icon" icon="mdi:format-font" v-on="on" />
      </template>
    </message-format-modal>
    <div class="spacer" />
    <popper content="GitHub" placement="top" hover arrow>
      <a href="https://github.com/mrfrase3/slack-export-vue" target="_blank">
        <icon class="action-icon" icon="mdi:github" />
      </a>
    </popper>
    <coffee />
  </div>
</template>

<style scoped>

.sidebar-footer {
  padding: 16px;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.action-icon {
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  padding-right: 16px;
}

.spacer {
  flex: 1;
}
</style>
