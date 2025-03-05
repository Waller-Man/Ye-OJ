<template>
  <a-config-provider :locale="enUS">
    <div id="app">
      <!-- 用户相关路由 -->
      <template v-if="route.path.startsWith('/user')">
        <router-view />
      </template>

      <!-- 主应用布局 -->
      <template v-else>
        <BasicLayout />
      </template>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import BasicLayout from "@/layouts/BasicLayout";
import enUS from "@arco-design/web-vue/es/locale/lang/en-us"; // 导入英文语言包

const route = useRoute();

/**
 * 全局初始化函数
 * 建议在此初始化以下内容：
 * 1. 用户认证状态检查
 * 2. 全局配置加载
 * 3. 埋点初始化
 * 4. 异常监控初始化
 */
const doInit = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("[Init] Application bootstrap");
    console.log("[Init] Current environment:", process.env.NODE_ENV);
  }

  // 示例：加载重要配置
  // initializeAppConfig();
};

onMounted(() => {
  doInit();
});
</script>

<style>
#app {
  /* 建议添加字体家族统一配置 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;

  /* 基础样式规范 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
