declare module 'vite-plugin-optimizer'
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
declare module "src/*";

declare module 'electron-updater'