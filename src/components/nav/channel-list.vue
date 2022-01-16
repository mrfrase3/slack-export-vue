<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  channels: any[],
  currentChannel: string,
}>()

const emit = defineEmits(['update:currentChannel'])

</script>

<template>
  <div class="channel-list">
    <div class="title">
      Channels
    </div>
    <ul>
      <li v-for="channel in channels" :key="channel.name">
        <a
          :href="`#${channel.name}`"
          :class="{ active: currentChannel === channel.name }"
          @click.prevent="emit('update:currentChannel', channel.name)"
        >
          <span style="padding-right: 8px;">#</span>
          {{ channel.name }}
        </a>
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

a {
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

a:hover {
  background-color: #350D36;
}

a.active {
  background-color: #1164a3;
}
</style>
