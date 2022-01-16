<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import processExport from './util/processExport';
import ChannelList from './components/nav/channel-list.vue';
import MessagesList from './components/messages/list.vue';
import formatModal from './components/messages/format-modal.vue';

const loading = ref(true);
const status = ref('');
const channels = ref([] as any[]);
const users = ref({} as any);
const currentChannel = ref(location.hash.replace(/^\#/, '') || 'general');

watchEffect(() => {
  if (currentChannel.value) {
    location.hash = currentChannel.value;
  }
});

processExport(status).then(({ channels: chnls, users: usrs }) => {
  loading.value = false;
  channels.value = chnls;
  users.value = usrs;
});

</script>

<template>
  <div v-show="loading" class="loading-splash moving-gradient">
    <div>
      <img alt="Loading" src="./assets/loading.svg" />
      <br>
      <strong>{{status}}</strong>
    </div>
  </div>
  <div class="sidebar">
    <h1>#️⃣ Slack Export Vue</h1>
    <channel-list
      :channels="channels"
      v-model:current-channel="currentChannel"
    />
    <format-modal :channels="channels" :users="users" />
  </div>
  <div class="main">
    <messages-list v-bind="{ currentChannel, channels, users }" />
  </div>
</template>

<style>
@import url(https://fonts.googleapis.com/css?family=Lato:400,500,700,900,italic,italic700);

#app {
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 256px;
  background: #481449;
  color: #fff;
  font-weight: 500;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
}

.sidebar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 1rem;
  text-align: center;
}

.main {
  position: absolute;
  top: 0;
  left: 256px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.loading-splash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999;
}

.loading-splash div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading-splash strong {
  color: white;
  margin-top: 8px;
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
</style>
