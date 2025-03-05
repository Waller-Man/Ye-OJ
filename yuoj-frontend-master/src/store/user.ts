// src/store/modules/user.ts
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

// 本地存储键名常量
const STORAGE_USER_KEY = "oj_user_data";

export default {
  namespaced: true,
  state: () => ({
    loginUser: JSON.parse(localStorage.getItem(STORAGE_USER_KEY)!) || {
      userName: "Guest",
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  actions: {
    async getLoginUser({ commit }) {
      try {
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res?.code === 0 && res.data) {
          commit("updateUser", {
            ...res.data,
            userRole: res.data.userRole || ACCESS_ENUM.USER,
          });
        }
      } catch (error) {
        console.error("用户状态获取失败:", error);
        commit("updateUser", {
          userName: "Guest",
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = {
        ...state.loginUser,
        ...payload,
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(state.loginUser));
    },
  },
} as StoreOptions<any>;
