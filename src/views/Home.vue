<script lang="ts" setup>
import Popper from 'vue3-popper';

const store = useStore();

const isCopied = ref(false);

const link = computed(() => {
  return `${window.location.origin}?exportUrl=${encodeURIComponent(store.exportUrl)}`;
});

const onDonate = () => {
  store.coffeeMenu = true;
};

const copyLink = () => {
  navigator.clipboard.writeText(link.value);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

const resetExport = () => {
  store.binaryData = null;
  store.dataLoaded = false;
  store.exportNeeded = true;
};

const context = computed(() => {
  if (store.exportUrl === '/demo.bin.zip') {
    return {
      heading: 'You\'re currently viewing randomised demo data.',
      btn: 'Upload My Export',
      btnIcon: 'mdi:upload',
      action: resetExport,
    };
  }
  if (store.binarySource === 'upload') {
    return {
      heading: 'You can download and host a binary for easy use.',
      btn: 'Download My Binary',
      btnIcon: 'mdi:download',
      action: () => store.downloadBinary(),
    };
  }
  return {
    heading: 'Share this export with others.',
    showShare: true,
    action: copyLink,
  };
});

</script>

<template>
  <div class="home-wrap">
    <h1>Welcome to Slax Pro</h1>
    <p>A <i>Free &amp; Professional</i> viewer for slack-like export content.</p>
    <p>Click a channel on the left to start viewing!</p>
    <h3> {{ context.heading }}</h3>
    <button v-if="context.btn" class="btn" @click="context.action">
      <icon :icon="context.btnIcon" />
      {{ context.btn }}
    </button>
    <div v-show="context.showShare" class="input-group">
      <input
        v-model="link"
        type="text"
        readonly
      >
      <div>
        <popper placement="top" hover arrow>
          <button class="btn btn-icon" @click="copyLink">
            <icon v-show="!isCopied" icon="mdi:clipboard-outline" />
            <icon v-show="isCopied" icon="mdi:clipboard-check-outline" />
          </button>
          <template #content>
            <span :class="{ 'success-text': isCopied }">
              {{ isCopied ? 'Copied!' : 'Copy Link' }}
            </span>
          </template>
        </popper>
      </div>
    </div>
    <h3>
      Found this useful? Maybe you'd like to:
    </h3>
    <button class="btn btn-primary btn-bmc" @click="onDonate">
      <img
        src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg"
        alt="Buy me a coffee"
        style="height: 20px; margin-right: 8px"
      >
      Buy me a coffee
    </button>
    <p>
      <small>
        This project is in <b>no</b> way affiliated with nor endorsed by Slack.
        <br>
        This is Slax, which is very different from Slack. (and more pro)
      </small>
    </p>
  </div>
</template>

<style scoped>

h1 {
  margin: 0;
}

.home-wrap {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.btn-bmc {
  background: #5F7FFF;
  display: inline-block;
}

</style>
