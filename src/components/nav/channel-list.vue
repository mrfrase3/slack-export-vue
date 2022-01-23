<script setup lang="ts">

const store = useStore();
const route = useRoute();

const isActive = (channel: Channel) => {
  return route.params.channelId === channel.id;
};

</script>

<template>
  <div class="channel-list">
    <div class="title">
      Channels
    </div>
    <ul>
      <li v-for="channel in store.channels" :key="channel.id">
        <router-link
          :to="{ params: { channelId: channel.id }, query: { ...route.query }, name: 'channel' }"
          :class="{ link: true, active: isActive(channel) }"
        >
          <span style="padding-right: 8px;">#</span>
          {{ channel.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.title {
  padding-left: 16px;
  padding-right: 16px;
  line-height: 28px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.link {
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 28px;
  transition: background-color 0.2s ease;
}

.link:hover {
  background-color: #350D36;
}

.link.active {
  background-color: #1164a3;
}

@media screen and (max-width: 960px) {
  .link {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style>
