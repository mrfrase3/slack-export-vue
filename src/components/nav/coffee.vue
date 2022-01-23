<script lang="ts" setup>
import Popper from 'vue3-popper';

const store = useStore();
const firstClick = ref(false);

const id = 'mrfrase3';
const description = 'Support me on Buy me a coffee!';
const bcmLink = computed(() => {
  return `https://www.buymeacoffee.com/widget/page/${id}?description=${encodeURIComponent(description)}&color=${encodeURIComponent('#5F7FFF')}`;
});

watchEffect(() => {
  if (!store.coffeeMenu) return;
  firstClick.value = true;
});

</script>

<template>
  <popper placement="top" class="coffee-pop" :show="store.coffeeMenu">
    <div class="coffee-btn" @click="store.coffeeMenu = !store.coffeeMenu">
      <icon v-show="store.coffeeMenu" icon="mdi:close" />
      <img
        v-show="!store.coffeeMenu"
        src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg"
        alt="Buy me a coffee"
        style="height: 20px"
      >
    </div>
    <template #content>
      <iframe
        v-if="firstClick || store.coffeeMenu"
        :src="bcmLink"
        title="Buy me a coffee"
        class="bmc-iframe"
      />
    </template>
  </popper>
</template>

<style scoped>

.coffee-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #5F7FFF;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bmc-iframe {
  margin: 0px;
  border: 0px;
  height: calc(100vh - 140px);
  opacity: 1;
  width: calc(100vw - 38px);
  max-width: 350px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 16px;
  background: url(https://cdn.buymeacoffee.com/assets/img/widget/loader.svg) center center / 64px no-repeat rgb(255, 255, 255);
  z-index: 999999;
  transition: all 0.4s ease 0s;
  max-height: 620px;
}

.coffee-pop:deep(.popper) {
  padding: 0;
  background-color: transparent;
}

</style>
