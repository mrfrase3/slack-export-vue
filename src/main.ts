import { Buffer } from 'buffer';
import './global.d.ts';
import { createApp } from 'vue';
import { ObserveVisibility } from 'vue-observe-visibility';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './util/dayjs';
import './global.css';
import './util/formatMessage.css';

window.Buffer = Buffer;

createApp(App)
  .directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
      (vnode as any).context = binding.instance;
      ObserveVisibility.bind(el, binding, vnode);
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
  })
  .use(createPinia())
  .use(router)
  .mount('#app');
