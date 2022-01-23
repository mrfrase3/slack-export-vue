<script setup lang="ts">

const emit = defineEmits(['update:modelValue']);

const dialog = ref(false);
const unloaded = ref(true);

const props = withDefaults(defineProps<{
  modelValue?: boolean
  maxWidth?: number | string
  persistent?: boolean
}>(), {
  modelValue: undefined,
  maxWidth: 500,
  persistent: false,
});

const useInternal = computed(() => typeof props.modelValue === 'undefined');
const isOpen = computed(() => useInternal.value ? dialog.value : props.modelValue);

const toggleOpen = (val = true) => {
  if (useInternal.value) {
    dialog.value = val;
  } else {
    emit('update:modelValue', val);
  }
};

watch(isOpen, (val) => {
  if (val) { unloaded.value = false; }
});

</script>

<template>
  <div>
    <slot
      name="activator"
      :on="{ click: () => toggleOpen() }"
    />
  </div>
  <transition name="modal">
    <div v-if="!unloaded" v-show="isOpen" class="modal-mask" @click.stop="!persistent && toggleOpen(false)">
      <div class="modal-wrapper">
        <div
          :style="{ maxWidth: (typeof maxWidth === 'number') ? `${maxWidth}px` : maxWidth }"
          class="modal-container"
          @click.stop=""
        >
          <div class="modal-header">
            <slot name="header">
              Default Header
            </slot>
          </div>

          <div class="modal-body">
            <slot>
              Default Body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="toggleOpen(false)">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  color: black;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.35s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
