/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue3-popper' {
  import type { Component } from 'vue';
  const file: Component;
  export default file;
}

declare module 'v3-infinite-loading' {
  import type { Component } from 'vue';
  const file: Component;
  export default file;
}

declare module 'js-binary';
