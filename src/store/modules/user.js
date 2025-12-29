import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,
  }),
  getters: {
    userId() {
      return this.userInfo?.id;
    },
    username() {
      return this.userInfo?.username;
    },
    nickName() {
      return this.userInfo?.fullname || this.userInfo?.nickName;
    },
    email() {
      return this.userInfo?.email;
    },
    role() {
      return this.userInfo?.role;
    },
    isActive() {
      return this.userInfo?.is_active;
    },
    currentRole() {
      return this.userInfo?.currentRole || { name: this.userInfo?.role };
    },
    roles() {
      return this.userInfo?.roles || [];
    },
    avatar() {
      return this.userInfo?.avatar || null;
    },
  },
  actions: {
    setUser(user) {
      this.userInfo = user || null;
    },
    resetUser() {
      this.$reset();
    },
  },
  persist: {
    key: "vue-naivue-admin_user",
    storage: localStorage,
    paths: ["userInfo"], // Chỉ persist userInfo
  },
});
