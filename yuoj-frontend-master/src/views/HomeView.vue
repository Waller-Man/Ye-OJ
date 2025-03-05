<template>
  <div class="profile-container">
    <!-- 未登录状态 -->
    <div v-if="!isLogin" class="welcome-section">
      <h1>Welcome to YeOJ</h1>
      <p>Start your coding journey with us</p>
      <a-space :size="24">
        <a-button type="primary" @click="router.push('/user/login')"
          >Login Now</a-button
        >
        <a-button type="outline" @click="router.push('/user/register')"
          >Register Account</a-button
        >
      </a-space>
    </div>

    <!-- 已登录状态 -->
    <div v-else class="user-profile">
      <h2 style="margin-bottom: 24px; text-align: center">Personal Center</h2>

      <a-form
        :model="form"
        layout="vertical"
        auto-label-width
        style="max-width: 480px; margin: 0 auto"
        @submit="handleSubmit"
      >
        <!-- 用户名 -->
        <a-form-item
          field="userName"
          label="Username"
          :rules="[{ required: true, message: 'Username cannot be empty' }]"
        >
          <a-input
            v-model="form.userName"
            placeholder="Please enter username"
            allow-clear
          />
          <template #extra>
            <div class="original-info" v-if="originalUserInfo.userName">
              Original username: {{ originalUserInfo.userName }}
            </div>
          </template>
        </a-form-item>

        <!-- 个人简介 -->
        <a-form-item
          field="userProfile"
          label="Bio"
          :rules="[{ max: 100, message: 'Max 100 characters' }]"
        >
          <a-textarea
            v-model="form.userProfile"
            placeholder="Introduce yourself... "
            :max-length="100"
            show-word-limit
          />
          <template #extra>
            <div class="original-info" v-if="originalUserInfo.userProfile">
              Previous Bio:
              {{ originalUserInfo.userProfile || "No introduction yet" }}
            </div>
          </template>
        </a-form-item>

        <!-- 系统信息 -->
        <a-descriptions
          :data="systemInfo"
          :column="1"
          bordered
          layout="inline-horizontal"
          class="system-info"
        >
          <template #label="{ label }">
            <span class="info-label">{{ label }}</span>
          </template>
        </a-descriptions>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-space
            :size="16"
            style="justify-content: space-between; width: 100%"
          >
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              style="width: 120px"
            >
              Save Changes
            </a-button>
            <a-button
              type="outline"
              status="danger"
              @click="handleLogout"
              style="margin-left: auto"
            >
              Logout
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
// 修改导入路径，根据实际文件位置调整
import { UserControllerService } from "../../generated/services/UserControllerService";
import dayjs from "dayjs";

// 定义类型（如果服务未生成）
interface UserUpdateMyRequest {
  userName?: string;
  userProfile?: string;
  userAvatar?: string;
}

const store = useStore();
const router = useRouter();
const loading = ref(false);

const isLogin = computed(() => {
  return store.state.user.loginUser?.userRole !== "notLogin";
});

const form = reactive({
  userName: "",
  userProfile: "",
});
// 新增原信息存储
const originalUserInfo = reactive({
  userName: "",
  userProfile: "",
});

// 初始化用户数据
onMounted(async () => {
  if (isLogin.value) {
    await store.dispatch("user/getLoginUser");
    const user = store.state.user.loginUser;
    if (user) {
      form.userName = user.userName || "";
      form.userProfile = user.userProfile || "";

      // 保存原信息用于对比
      originalUserInfo.userName = user.userName || " Not Set";
      originalUserInfo.userProfile = user.userProfile || "No Bio Added";
    }
  }
});
// 系统信息数据格式化
const systemInfo = computed(() => {
  const user = store.state.user.loginUser || {};
  const formatTime = (time: string) =>
    time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "Not Updated Yet";

  return [
    { label: "User Role", value: formatUserRole(user.userRole) }, // 角色本地化
    { label: "Joined On", value: formatTime(user.createTime) },
    { label: "Last Updated", value: formatTime(user.updateTime) },
  ];
});

const formatUserRole = (role: string) => {
  const roles: Record<string, string> = {
    admin: "Administrator",
    user: "Regular User",
    notLogin: "Not Logged In",
    ban: "Banned",
  };
  return roles[role] || "Unknown Role";
};

// 提交更新的优化实现
const handleSubmit = async () => {
  try {
    loading.value = true;

    // 构造符合 UserUpdateMyRequest 的请求体
    const updateRequest: UserUpdateMyRequest = {
      userName: form.userName,
      userProfile: form.userProfile,
    };

    // 调用更新接口的正确endpoint
    const res = await UserControllerService.updateMyUserUsingPost(
      updateRequest
    );

    if (res.code === 0) {
      Message.success("Changes Saved");
      // 强制刷新用户数据
      await store.dispatch("user/getLoginUser");
      const user = store.state.user.loginUser;
      if (user) {
        originalUserInfo.userName = user.userName || "Not Set";
        originalUserInfo.userProfile = user.userProfile || "No Bio Added";
      }
    } else {
      Message.error(res.message || "Save Failed");
    }
  } catch (error: any) {
    Message.error(`Request Error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// 退出登录的优化实现
const handleLogout = async () => {
  try {
    const { code } = await UserControllerService.userLogoutUsingPost();
    if (code === 0) {
      store.commit("user/resetUser");
      localStorage.removeItem("oj_user_data");
      // 非替换导航，保持历史记录
      await router.push("/user/login");
      Message.success("Logout Successful");
    }
  } catch (error: any) {
    Message.error(`Logout Failed: ${error.message}`);
    console.error("Logout error:", error);
  }
};
</script>

<style scoped>
.profile-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 80px 20px;

  h1 {
    font-size: 2.2rem;
    margin-bottom: 16px;
    color: var(--color-text-1);
  }

  p {
    color: var(--color-text-2);
    margin-bottom: 32px;
    font-size: 1.1rem;
  }
}

.user-profile {
  background: var(--color-bg-2);
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.system-info {
  margin: 20px 0;

  :deep(.arco-descriptions-label) {
    color: var(--color-text-2);
    width: 100px;
  }

  :deep(.arco-descriptions-value) {
    color: var(--color-text-1);
  }
}

.original-info {
  font-size: 0.9rem;
  color: var(--color-text-3);
  margin-top: 6px;
  padding-left: 4px;
}
</style>
