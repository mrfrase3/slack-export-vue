import { Node } from '@tiptap/core';

const OneLineNode = Node.create({
  name: 'oneLine',
  topNode: true,
  content: 'block',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const content = this.editor.getJSON().content?.[0]?.content;
        if (!content?.length) return false;
        this.options.onEnter(content);
        return true;
      },
    };
  },
});

export default OneLineNode;
