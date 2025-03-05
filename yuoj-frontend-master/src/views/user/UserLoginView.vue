<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">User Login</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="Account ">
        <a-input v-model="form.userAccount" placeholder="Enter account" />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="Password (8+ characters)"
        label="Password"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="Enter password"
        />
      </a-form-item>
      <a-form-item>
        <a-space :size="16" style="width: 100%; justify-content: space-between">
          <a-button type="primary" html-type="submit" style="width: 120px">
            Login
          </a-button>
          <a-button type="outline" @click="router.push('/user/register')">
            Go to Register
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("Login failed," + res.message);
  }
};
</script>
