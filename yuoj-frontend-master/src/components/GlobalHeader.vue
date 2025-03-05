<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">Ye OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="140px">
      <!-- 新登录状态显示 -->
      <div v-if="isLogin" class="user-info">Hello {{ loginUserName }}</div>
      <router-link v-else :to="{ name: 'User Login' }" class="login-link">
        Login Now
      </router-link>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const store = useStore();

// 初始化时获取登录状态
onMounted(async () => {
  await store.dispatch("user/getLoginUser");
});

// 登录状态计算属性
const isLogin = computed(() => {
  return store.state.user.loginUser?.userRole !== ACCESS_ENUM.NOT_LOGIN;
});

// 用户名显示计算属性
const loginUserName = computed(() => {
  return store.state.user.loginUser?.userName || "User";
});

// 原有功能和逻辑保持不变
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) return false;
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

const selectedKeys = ref([useRoute().path]);

router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({ path: key });
};
</script>

<style scoped>
/* 原有样式保留 */
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

/* 新增用户信息样式 */
.user-info {
  color: var(--color-text-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.login-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
