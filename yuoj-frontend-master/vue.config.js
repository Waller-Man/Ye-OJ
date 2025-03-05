const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config) {
    config.plugin("monaco").use(new MonacoWebpackPlugin());
    config.plugin("html").tap((args) => {
      args[0].title = "yeoj-frontend"; // 修改此处为你的标题
      return args;
    });
  },
});
