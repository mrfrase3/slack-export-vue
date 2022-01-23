<script setup lang="ts">
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';

const store = useStore();
const route = useRoute();
const router = useRouter();

const threadRef = computed(() => {
  return route.query?.threadRef;
});

const closeSidebars = () => {
  store.leftSidebar = false;
  router.push({
    query: {
      ...omit(route.query, ['threadRef']),
    },
  });
};

const onWidthChange = debounce(() => store.onWidthChange(), 100);
onMounted(() => window.addEventListener('resize', onWidthChange));
onUnmounted(() => window.removeEventListener('resize', onWidthChange));

</script>

<template>
  <load-splash />
  <div :class="{ sidebar: true, closed: !store.leftSidebar }">
    <router-link class="no-link" :to="{ name: 'home', params: {}, query: { ...route.query } }">
      <h1>#️⃣ Slack Export Vue</h1>
    </router-link>
    <channel-list />
    <!-- <message-format-modal /> -->
    <sidebar-footer />
  </div>
  <div :class="{ 'thread-sidebar': true, closed: !threadRef }">
    <thread-sidebar />
  </div>
  <transition name="fade">
    <div v-show="store.leftSidebar || threadRef" class="sidebar-overlay" @click="closeSidebars()" />
  </transition>
  <div :class="{ main: true, 'offset-right': !!threadRef }">
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
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  color: #fff;
}

.sidebar .channel-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.thread-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 25vw;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ccc;
  background-color: #fff;
  transition: right 0.2s ease-in-out;
}

.thread-sidebar.closed {
  right: -25vw;
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

.main.offset-right {
  right: 25vw;
}

.sidebar-overlay {
  display: none;
}

@media screen and (max-width: 1264px) {
  .thread-sidebar {
    width: 33vw;
  }
  .thread-sidebar.closed {
    right: -33vw;
  }
  .main.offset-right {
    right: 33vw;
  }
}

@media screen and (max-width: 960px) {
  .sidebar {
    width: 256px;
    max-width: 100%;
    left: 0;
    transition: left 0.2s ease-in-out;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .main {
    left: 0;
    right: 0!important;
  }

  .sidebar.closed {
    left: -100%;
  }

  .thread-sidebar {
    width: 360px;
    max-width: 100%;
  }
  .thread-sidebar.closed {
    right: -360px;
  }
}

</style>
