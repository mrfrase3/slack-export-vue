import { createApp } from 'vue'
import { ObserveVisibility } from 'vue-observe-visibility'
import App from './App.vue'
import './util/dayjs';
import 'emoji-js/lib/emoji.css';

createApp(App)
  .directive("observe-visibility", {
    beforeMount: (el, binding, vnode) => {
      (vnode as any).context = binding.instance
      ObserveVisibility.bind(el, binding, vnode)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
  })
  .mount('#app')
