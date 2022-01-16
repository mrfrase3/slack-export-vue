<script setup lang="ts">
import { ref, computed } from 'vue';
import Modal from '../nav/modal.vue';
import Message from '../messages/message.vue';

const props = defineProps<{
  users: any,
  channels: any[],
}>()

const text = ref('');
const message = computed(() => ({
  ...(props.channels?.[0]?.rootMessages?.[0] || {}),
  text: text.value,
}));

</script>

<template>
  <modal>
    <template #activator="{ on }">
      <button v-on="on">Format Preview</button>
    </template>
    <template #header>
      <h3>Format Previewer</h3>
    </template>
    <message
      :message="message"
      :users="props.users"
      :channels="props.channels"
      :above-message="{ ts: message.ts - 1 }"
    />
    <textarea
      rows="5"
      v-model="text"
      class="textarea"
    ></textarea>
  </modal>
</template>

<style scoped>
.textarea {
  width: 100%;
  margin-top: 8px;
}
</style>