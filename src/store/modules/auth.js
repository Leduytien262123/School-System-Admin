import { defineStore } from "pinia";
import {
  usePermissionStore,
  useRouterStore,
  useTabStore,
  useUserStore,
} from "@/store";
import { decodeJWT, isTokenExpired, getTokenExpirationTime } from "@/utils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: undefined,
  }),
  getters: {
    isLoggedIn: (state) => {
      // Kiểm tra token có tồn tại và chưa hết hạn
      return !!state.accessToken && !isTokenExpired(state.accessToken);
    },
    tokenInfo: (state) => {
      if (!state.accessToken) return null;
      return decodeJWT(state.accessToken);
    },
    tokenExpirationTime: (state) => {
      if (!state.accessToken) return null;
      return getTokenExpirationTime(state.accessToken);
    },
  },
  actions: {
    setToken(data) {
      if (data?.success && data?.data && data?.data?.accessToken) {
        const token = data.data.accessToken;
        const user = data.data.user; // Lấy toàn bộ thông tin user từ API

        // Decode token để kiểm tra
        const tokenInfo = decodeJWT(token);

        if (!tokenInfo) {
          return false;
        }

        // Kiểm tra token có hết hạn không
        if (isTokenExpired(token)) {
          return false;
        }

        // Lưu token
        this.accessToken = token;

        // Lưu token vào cookie với thời hạn theo exp time của token
        const expirationSeconds = tokenInfo.exp - Math.floor(Date.now() / 1000);
        document.cookie = `auth_token=${token}; path=/; max-age=${expirationSeconds}; SameSite=Lax`;

        // Lưu toàn bộ thông tin user vào user store (sẽ tự động persist)
        const userStore = useUserStore();
        userStore.setUser(user);

        return true;
      } else {
        console.error("Invalid login response format:", data);
        return false;
      }
    },

    // Lấy token từ cookie khi khởi tạo app
    loadTokenFromCookie() {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        if (token && token !== "undefined") {
          // Kiểm tra token có hết hạn không
          if (isTokenExpired(token)) {
            this.resetToken();
            return false;
          }

          this.accessToken = token;

          const userStore = useUserStore();
          if (userStore.userInfo) {
            return true;
          }

          const tokenInfo = decodeJWT(token);
          if (tokenInfo) {
            const user = {
              id: tokenInfo.user_id,
              username: tokenInfo.username,
              role: tokenInfo.role,
            };
            userStore.setUser(user);
            return true;
          }
        }
      }

      return false;
    },

    // Kiểm tra và refresh token nếu cần
    checkTokenValidity() {
      if (!this.accessToken) {
        return false;
      }

      if (isTokenExpired(this.accessToken)) {
        this.logout();
        return false;
      }

      return true;
    },

    resetToken() {
      this.accessToken = undefined;
      // Xóa token khỏi cookie
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    toLogin() {
      const { router, route } = useRouterStore();
      router.replace({
        path: "/login",
        query: route.query?.redirect
          ? route.query
          : { redirect: route.fullPath },
      });
    },
    async switchCurrentRole(data) {
      this.resetLoginState();
      await nextTick();
      this.setToken(data);
    },
    resetLoginState() {
      const { resetUser } = useUserStore();
      const { resetRouter } = useRouterStore();
      const { resetPermission, accessRoutes } = usePermissionStore();
      const { resetTabs } = useTabStore();

      resetRouter(accessRoutes);
      resetUser();
      resetPermission();
      resetTabs();
      this.resetToken();
    },
    async logout() {
      sessionStorage.setItem("isFromLogout", "true");

      this.resetLoginState();
      this.toLogin();
    },
  },
  persist: {
    key: "vue-naivue-admin_auth",
    paths: ["accessToken"],
  },
});
