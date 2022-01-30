import { VueRenderer } from '@tiptap/vue-3';
import type { SuggestionKeyDownProps, SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import tippy, { sticky } from 'tippy.js';
import type { Instance } from 'tippy.js';
import { PluginKey } from 'prosemirror-state';
import MentionList from './mention-list.vue';

export default (char: string, type = 'users'): Omit<SuggestionOptions, 'editor'> => {
  const store = useStore();
  return {
    char,
    items: ({ query }: { query: string }) => {
      return type === 'users'
        ? store.searchUsers(query).slice(0, 30)
        : store.searchChannels(query).slice(0, 30);
    },
    pluginKey: new PluginKey(type),
    render: () => {
      let component: VueRenderer;
      let popup: Instance[];

      return {
        onStart: (args: SuggestionProps) => {
          component = new VueRenderer(MentionList, {
            props: { ...args, type },
            editor: args.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: args.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            sticky: true,
            plugins: [sticky],
          });
        },

        onUpdate(args: SuggestionProps) {
          component.updateProps({ ...args, type });

          popup[0].setProps({
            getReferenceClientRect: args.clientRect,
          });
        },

        onKeyDown(args: SuggestionKeyDownProps) {
          if (args.event.key === 'Escape') {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(args, type);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
};
