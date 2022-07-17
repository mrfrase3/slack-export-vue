<script lang="ts" setup>

const store = useStore();
const file = ref(null as null | File);
const isDragging = ref(false);
const isValidDrag = ref(false);
const showInvalid = ref(false);
const isChecking = ref(false);

const zipIcon = computed(() => {
  if (showInvalid.value) return 'mdi:alert-outline';
  if (!isDragging.value) return 'mdi:folder-zip-outline';
  if (isValidDrag.value) return 'mdi:basketball-hoop-outline';
  return 'mdi:alert-outline';
});

const isInvalid = computed(() => {
  if (showInvalid.value) return true;
  if (!isDragging.value) return false;
  if (isValidDrag.value) return false;
  return true;
});

const colorClass = computed(() => {
  if (isInvalid.value) return 'error';
  if (isDragging.value) return 'success';
  return '';
});

const fsArr = (files: FileList | undefined): File[] => {
  if (!files) return [];
  return Array.from(files);
};

const checkDrag = (e: DragEvent) => {
  showInvalid.value = false;
  isDragging.value = true;
  isValidDrag.value = !!e.dataTransfer?.types.includes('Files');
};

const resetDrag = () => {
  showInvalid.value = false;
  isDragging.value = false;
  isValidDrag.value = false;
};

const onFileChange = async(e: any) => {
  e.preventDefault();
  const target = e.dataTransfer ?? e.target;
  file.value = fsArr(target.files).find((f: File) => f.type === 'application/zip') ?? null;
  resetDrag();
  showInvalid.value = !file.value;
  if (file.value) {
    isChecking.value = true;
    if (await store.checkIfBinZip(file.value)) {
      file.value = null;
    }
    isChecking.value = false;
  }
};

const onExport = async() => {
  if (file.value) {
    await store.loadExport(file.value);
    await store.loadBinary();
    file.value = null;
  }
};

const onDemo = async() => {
  await store.loadBinary('/demo.bin.zip');
};

onMounted(() => {
  store.loadBinary();
});

</script>

<template>
  <div v-show="!store.dataLoaded" class="loading-splash moving-gradient">
    <div v-show="!store.exportNeeded || isChecking">
      <img alt="Loading" src="@/assets/loading.svg">
      <br>
      <br>
      <strong>{{ store.status }}</strong>
      <br>
      <button v-if="store.status.startsWith('Error:')" @click="store.exportNeeded = true">
        Back
      </button>
    </div>
    <div v-show="store.exportNeeded && !isChecking">
      <input
        v-show="false"
        :key="file?.name"
        ref="fileInput"
        type="file"
        accept=".zip"
        @change="onFileChange"
      >
      <div class="header">
        <h1>
          <img src="/slax.svg" alt="" style="height: 1em; margin-right: 8px">
          Slax Pro
        </h1>
        <p>A <i>Free &amp; Professional</i> viewer for slack-like export content.</p>
      </div>
      <div
        v-show="!file"
        :class="`drop-area ${colorClass}`"
        @drop.prevent="onFileChange"
        @dragenter="checkDrag"
        @dragover.prevent="checkDrag"
        @dragleave="resetDrag"
        @click="($refs.fileInput as HTMLInputElement).click()"
      >
        <icon class="zip-icon" :icon="zipIcon" />
        <div v-if="!isInvalid && !isDragging">
          <strong>Drop .zip file here</strong>
          <br>
          <small>or click to select</small>
        </div>
        <div v-else-if="!isInvalid">
          <strong>Kobe!</strong>
        </div>
        <div v-else>
          <strong>File must be a .zip</strong>
          <br>
          <small>Please try again</small>
        </div>
      </div>
      <div v-show="!file" class="actions demo">
        <button class="btn btn-text" @click="onDemo">
          <span>Load Demo Export</span>
        </button>
      </div>
      <div v-show="file" class="config">
        <h2>Export Preferences</h2>
        <span>
          <icon icon="mdi:folder-zip-outline" />
          <strong>{{ file?.name }}</strong>
        </span>
        <checkbox
          v-model="store.exportConfig.preferDisplayName"
          label="Prefer display name"
          hint="e.g. 'mrfrase3' instead of 'Fraser The Third'"
        />
        <checkbox
          v-model="store.exportConfig.hideChannelMessages"
          label="Hide channel messages"
          hint="Hide user join/leave messages"
        />
        <checkbox
          v-model="store.exportConfig.skipArchivedChannels"
          label="Skip archived channels"
          hint="Skip channels that have been archived"
        />
        <checkbox
          v-model="store.exportConfig.removeLinkPreviews"
          label="Remove link previews"
          hint="Remove the image/description under messages with links"
        />
        <div class="actions">
          <button class="btn btn-text" @click="file = null">
            Back
          </button>
          <div class="spacer" />
          <button class="btn" @click="onExport">
            <icon icon="mdi:cog" />
            <span>Process</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-splash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999;
  color: white;
}

.loading-splash > div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading-splash > strong {
  margin-top: 8px;
}

.loading-splash .header {
  background: #ffffff20;
  padding: 16px;
  border-radius: 16px;
  width: fit-content;
  margin-bottom: 32px;
  margin-left: auto;
  margin-right: auto;
}

.loading-splash .header h1,
.loading-splash .header p {
  margin: 4px 0;
}

.moving-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  height: 100vh;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.drop-area {
  background: rgba(var(--color-primary-rgb), 0.15);
  border: 1px dashed var(--color-primary);
  border-radius: 12px;
  padding: 16px;
  width: 80vw;
  max-width: 600px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.drop-area:hover {
  background: rgba(var(--color-primary-rgb), 0.3);
  border: 1px solid var(--color-primary);
}

.drop-area.success {
  color: #23d5ab;
}
.drop-area.error {
  color: #e73c7e;
}

.drop-area strong {
  font-size: 2em;
}

.drop-area .zip-icon {
  font-size: 4em;
  margin-bottom: 8px;
}

.config h2 {
  margin-top: 0;
  margin-bottom: 0;
}

.config > span {
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.config > span:deep(.icon) {
  margin-right: 4px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.actions.demo {
  justify-content: center;
}
</style>
