
<script setup lang="ts">
import sample from 'lodash/sample';

const store = useStore();

const text = ref('');

const msg = computed(() => ({
  ...(store.channels?.[0]?.rootMessages?.[0] || {}),
  text: text.value,
} as Message));

const addMention = () => {
  text.value += `<@${sample(Object.keys(store.users))}>`;
};

const addChannel = () => {
  text.value += `<#${sample(store.channels).id}>`;
};

const addShout = () => {
  text.value += '<!channel>';
};

</script>

<template>
  <modal v-bind="$attrs">
    <template #activator="{ on }">
      <slot name="activator" :on="on" />
    </template>
    <template #header>
      <h3>Format Previewer</h3>
    </template>
    <message
      :message="msg"
      :above-message="null"
      :channel-id="store.channels?.[0]?.id || ''"
      hide-date-rule
    />
    <textarea
      v-model="text"
      rows="5"
      class="textarea"
    />
    <button @click="addMention">
      @user
    </button>
    <button @click="addChannel">
      #channel
    </button>
    <button @click="addShout">
      @channel
    </button>
  </modal>
</template>

<style scoped>
.textarea {
  width: 95%;
  margin-top: 32px;
}
</style>
