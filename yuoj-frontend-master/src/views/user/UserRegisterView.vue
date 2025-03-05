<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 16px">User Registration</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        label="Account"
        :rules="[{ required: true, message: 'Account is required' }]"
      >
        <a-input
          v-model="form.userAccount"
          placeholder="Enter account (minimum 4 characters)"
        />
      </a-form-item>

      <a-form-item
        field="userPassword"
        label="Password"
        :rules="[{ required: true, message: 'Password is required' }]"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="Enter password (minimum 8 characters)"
        />
      </a-form-item>

      <a-form-item
        field="checkPassword"
        label="Confirm Password"
        :rules="[{ required: true, message: 'Please confirm password' }]"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="Confirm password"
        />
      </a-form-item>

      <a-form-item>
        <a-space :size="16">
          <a-button type="primary" html-type="submit" style="width: 120px">
            Register
          </a-button>
          <a-button type="outline" @click="router.push('/user/login')">
            Back to Login
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  UserControllerService,
  type UserRegisterRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

interface RegisterForm extends UserRegisterRequest {
  checkPassword: string;
}

const form = reactive<RegisterForm>({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

const router = useRouter();

const handleSubmit = async () => {
  try {
    // 明确创建符合后端要求的请求对象
    const request: UserRegisterRequest = {
      userAccount: form.userAccount,
      userPassword: form.userPassword,
      // 如果后端定义中已有checkPassword字段，则此处保留
      checkPassword: form.checkPassword,
    };

    // 发送JSON格式请求体
    const res = await UserControllerService.userRegisterUsingPost(request); // 要求OpenAPI生成的方法接收对象参数

    if (res.code === 0) {
      message.success("Registration successful!");
      setTimeout(() => {
        router.push({ path: "/user/login", replace: true });
      }, 1000);
    } else {
      message.error("Registration failed: " + res.message);
    }
  } catch (error: any) {
    message.error("Registration failed: " + error.message);
  }
};
</script>

<style scoped>
#userRegisterView {
  padding: 20px;
  text-align: center;
}
</style>
