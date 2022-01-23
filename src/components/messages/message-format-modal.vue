
<script setup lang="ts">

const store = useStore();

const text = ref('');
const message = computed(() => ({
  ...(store.channels?.[0]?.rootMessages?.[0] || {}),
  text: text.value,
} as Message));

</script>

<template>
  <modal>
    <template #activator="{ on }">
      <button v-on="on">
        Format Preview
      </button>
    </template>
    <template #header>
      <h3>Format Previewer</h3>
    </template>
    <message
      :message="message"
      :above-message="null"
      :channel-id="store.channels?.[0]?.id || ''"
      hide-date-rule
    />
    <textarea
      v-model="text"
      rows="5"
      class="textarea"
    />
  </modal>
</template>

<style scoped>
.textarea {
  width: 100%;
  margin-top: 8px;
}
</style>
