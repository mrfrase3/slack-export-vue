<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import TextNode from '@tiptap/extension-text';
import ParagraphNode from '@tiptap/extension-paragraph';
import MentionNode from '@tiptap/extension-mention';
import { Placeholder } from '@tiptap/extension-placeholder';
import type { JSONContent } from '@tiptap/vue-3';
import OneLineNode from '../../util/tiptap-oneline';
import suggestion from './suggestion';

const store = useStore();
const router = useRouter();
const emit = defineEmits(['close']);

const renderLabel = ({ node }: any) => {
  const [action, id] = node.attrs.id.split(':');
  if (action === 'from' || action === 'mentions') {
    return `${action}:@${store.users[id].name}`;
  } else if (action === 'in') {
    const channel = store.channels.find((c: Channel) => c.id === id);
    return `${action}:#${channel.name}`;
  }
  return '';
};

const editor = new Editor({
  autofocus: true,
  extensions: [
    OneLineNode.configure({
      onEnter: (content: JSONContent) => {
        router.push({
          path: '/search',
          query: { query: JSON.stringify(content) },
        });
        emit('close');
      },
    }),
    TextNode,
    ParagraphNode,
    Placeholder.configure({
      placeholder: 'Type @ or # to search for users or channels',
    }),
    MentionNode.configure({
      HTMLAttributes: {
        class: 'search-mention',
      },
      renderLabel,
      suggestion: suggestion('@', 'users'),
    }),
    MentionNode.configure({
      HTMLAttributes: {
        class: 'search-mention',
      },
      renderLabel,
      suggestion: suggestion('#', 'channels'),
    }),
  ],
  content: store.activeSearch,
  onUpdate() {
    store.activeSearch = editor.getJSON();
  },
});

const clearContent = () => {
  editor.commands.clearContent();
  store.activeSearch = editor.getJSON();
};

watch(store.activeSearch, () => {
  if (JSON.stringify(editor.getJSON()) !== JSON.stringify(store.activeSearch)) {
    editor.commands.setContent(store.activeSearch, false);
  }
});

onBeforeUnmount(() => {
  editor.destroy();
});

defineExpose({
  editor,
  clearContent,
});

</script>

<template>
  <div v-if="editor" class="search-input">
    <editor-content :editor="editor" />
  </div>
</template>

<style scoped>
.search-input {
  flex: 1;
}

.search-input:deep(.ProseMirror p) {
  margin: 0;
}

.search-input:deep(.ProseMirror:focus-visible) {
  outline: none;
}

.search-input:deep(.search-mention) {
    background-color: rgba(29,155,209,0.1);
    padding: 0 6px;
    margin: 0 4px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px;
    line-height: 20px;
    display: inline-block;
}

.search-input:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
