declare module 'base-href-webpack-plugin' {
  interface BaseHrefWebpackPluginOptions {
    baseHref?: string
  }

  class BaseHrefWebpackPlugin {
    constructor(options: BaseHrefWebpackPluginOptions);

    apply(compiler: any);
  }
}
