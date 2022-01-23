<script lang="ts" setup>
import Popper from 'vue3-popper';
import formatMessage from '../../util/formatMessage';

const store = useStore();
const props = defineProps<{
  title: string
  subtitle?: string
  subtitleTo?: any
  showMenuButton?: boolean
  showCloseButton?: boolean
}>();
const emit = defineEmits(['close']);
</script>

<template>
  <div class="chat-header">
    <div v-if="props.showMenuButton" class="chat-header-actions">
      <button
        class="btn btn-icon menu-button"
        @click="store.toggleSidebar()"
      >
        <icon icon="mdi:menu-open" />
      </button>
    </div>
    <div class="chat-header-title spacer">
      <strong>{{ props.title }}</strong>
      <popper v-if="props.subtitle && !props.subtitleTo" arrow hover placement="bottom" class="chat-header-subtitle">
        <span
          v-html="formatMessage(props.subtitle, store.users, store.channels)"
        />
        <template #content>
          <div class="subtitle-popout" v-html="formatMessage(props.subtitle, store.users, store.channels)" />
        </template>
      </popper>
      <router-link
        v-if="props.subtitle && props.subtitleTo"
        :to="props.subtitleTo"
        class="chat-header-subtitle"
        v-text="props.subtitle"
      />
    </div>
    <div v-if="props.showCloseButton" class="chat-header-actions">
      <button
        class="btn btn-icon"
        @click="emit('close')"
      >
        <icon icon="mdi:close" />
      </button>
    </div>
  </div>
</template>

<style scoped>

.chat-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #ccc;
  height: 48px;
}

.chat-header-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

.chat-header-subtitle {
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  padding-left: 8px;
  max-height: 1em;
}

:global(.chat-header-subtitle > div:first-child) {
  max-height: 1em;
}

.subtitle-popout {
  font-size: 16px;
}

.chat-header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.menu-button {
  display: none;
  height: 32px;
}

@media screen and (max-width: 960px) {
  .menu-button {
    display: block;
  }
}
</style>
