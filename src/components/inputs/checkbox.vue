<script lang="ts" setup>

const props = defineProps<{
  modelValue: boolean
  label?: string
  hint?: string
  disabled?: boolean
}>();

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};

</script>

<template>
  <div class="checkbox-wrap" @click="toggle">
    <icon
      :icon="`mdi:${props.modelValue ? 'checkbox-marked' : 'checkbox-blank-outline'}`"
      class="checkbox-icon"
    />
    <div class="checkbox-text">
      <div class="checkbox-label">
        <slot name="label">
          {{ props.label }}
        </slot>
      </div>
      <div class="checkbox-hint">
        <slot name="hint">
          {{ props.hint }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  text-align: left;
}

.checkbox-icon {
  font-size: 2em;
}

.checkbox-text {
  flex: 1;
  padding-left: 8px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}

.checkbox-hint {
  font-size: 12px;
  color: #ddd;
}

</style>
