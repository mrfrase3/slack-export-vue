<script setup lang="ts">

</script>

<template>
  <load-splash />
  <div class="sidebar">
    <h1>#️⃣ Slack Export Vue</h1>
    <channel-list />
    <!-- <message-format-modal /> -->
    <sidebar-footer />
  </div>
  <div class="main">
    <router-view />
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
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 1rem;
  text-align: center;
}

.sidebar .channel-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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

</style>
