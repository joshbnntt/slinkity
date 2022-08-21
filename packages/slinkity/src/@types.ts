import type { ViteDevServer, InlineConfig as ViteInlineConfig } from 'vite';

type Prop = {
  name: string;
  value: any;
  getSerializedValue(): string;
}

type PageUrl = string;
type IslandId = string;
type InputPath = string;
type PropId = string;

export type PropsByInputPath = Map<InputPath, {
  hasStore: boolean;
  props: Record<PropId, Prop>;
  clientPropIds: Set<PropId>;
}>

export type SsrIslandsByInputPath = Map<InputPath, Record<IslandId, {
  islandPath: string;
  propIds: Set<string>;
  isUsedOnClient: boolean;
  slots: Record<string, string>;
}>>

export type RenderedContent = {
  content: string;
  inputPath: string;
}

export type UrlToRenderedContentMap = Map<PageUrl, RenderedContent>;

export type ExtToRendererMap = Map<string, Renderer>;

export type CssUrlsByInputPath = Map<string, Set<string>>;

export type ViteServerFactory = {
  /** Get an existing Vite server, or initialize a new server if none exists */
  getOrInitialize(): Promise<ViteDevServer>;
};

export type PluginGlobals = {
  viteServer: ViteServerFactory;
  propsByInputPath: PropsByInputPath;
  ssrIslandsByInputPath: SsrIslandsByInputPath;
  urlToRenderedContentMap: UrlToRenderedContentMap;
  extToRendererMap: ExtToRendererMap;
  cssUrlsByInputPath: CssUrlsByInputPath;
}

export type SlinkityStore = <T>(initialValue: T, options: never) => {
  isSlinkityStoreFactory: true;
  id: string;
  value: T;
  get(): T;
}

export type Renderer = {
  name: string;
  extensions: string[];
  clientEntrypoint: string;
  ssr(params: { Component: any; props: any }): { html: string };
  viteConfig?: ViteInlineConfig;
  page?(params: { Component: any }): {
    getData(): Promise<any>;
    getIslandMeta(): Promise<any>;
  };
}

export type IslandExport = boolean | {
  /**
   * Conditions to hydrate this island, including 'idle', 'media(query)', 'visible', etc
   * Defaults to 'load'
   */
  on?: string[];
  /**
   * Props to pass to this hydrated component
   * Defaults to an empty object, so be careful!
   * If you're new to Slinkity, we recommend reading our "Be mindful about your data" docs first:
   * https://slinkity.dev/docs/component-pages-layouts/#%F0%9F%9A%A8-(important!)-be-mindful-about-your-data
   * @param eleventyData Page data from 11ty's data cascade
   */
  props(eleventyData: any): Record<string, any> | Promise<Record<string, any>>;
}

export type UserConfig = {
  islandsDir?: string;
  renderers?: Renderer[];
}
