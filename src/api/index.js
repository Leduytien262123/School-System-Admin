import { request } from "@/utils";

// S3 Upload Class
class UploadToS3 {
  constructor() {
    this.currentRequest = null;
  }

  async getUrlUpload(
    filename,
    contentEncoding = "blob",
    contentType = "image/jpeg"
  ) {
    const data = {
      key: filename,
      content_encoding: contentEncoding,
      content_type: contentType,
    };
    return request.post("/api/admin/upload/s3", data);
  }

  async upload(
    filename,
    data,
    { contentEncoding = "blob", contentType = "image/jpeg" } = {},
    onProgressCallback = null
  ) {
    try {
      const response = await this.getUrlUpload(
        filename,
        contentEncoding,
        contentType
      );

      const url = response.data?.data?.upload_url;
      const directUrl = response.data?.data?.direct_url;

      if (!directUrl) {
        throw new Error("Failed to get upload URL");
      }

      let buf;
      switch (contentEncoding) {
        case "base64":
          const binaryString = atob(
            data.replace(/^data:image\/\w+;base64,/, "")
          );
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          buf = bytes.buffer;
          break;
        case "blob":
          buf = data;
          break;
        default:
          throw new Error("Invalid content encoding!");
      }

      return new Promise((resolve, reject) => {
        this.currentRequest = new XMLHttpRequest();
        const xhr = this.currentRequest;

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", contentType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            if (onProgressCallback) {
              onProgressCallback(progress);
            }
          }
        };

        xhr.onload = () => {
          this.currentRequest = null;
          if (xhr.status === 200 || xhr.status === 204) {
            resolve({
              status: "success",
              data: {
                direct_url: directUrl,
                fileUrl: directUrl,
              },
            });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          this.currentRequest = null;
          reject(new Error("Upload failed"));
        };

        xhr.send(buf);
      });
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  abortUpload() {
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
}

// Create instance
const s3Uploader = new UploadToS3();

export default {
  // S3 Upload APIs
  uploadS3: (data) => request.post("/api/admin/upload/s3", data),
  uploadToS3: (filename, data, options, onProgress) =>
    s3Uploader.upload(filename, data, options, onProgress),

  // Authentication APIs
  login: (data) => request.post("/api/auth/login", data, { needToken: false }),
  logout: () => request.post("/api/auth/logout", {}, { needTip: false }),
  refreshToken: () => request.post("/api/auth/refresh", {}),
  getCaptcha: () =>
    request.get("/api/auth/captcha", {
      needToken: false,
      responseType: "blob",
    }),

  // Dashboard
  getDashboardOverview: () => request.get("/api/admin/dashboard/overview"),
  getDashboardAnalytics: () => request.get("/api/admin/dashboard/analytics"),
  getDashboardAlerts: () => request.get("/api/admin/dashboard/alerts"),

  // Provinces
  getProvinces: (params = {}) =>
    request.get("/api/common/provinces", { params }),
  getWards: (params = {}) => request.get("/api/common/wards", { params }),

  getMenus: (params = {}) => request.get("/api/admin/menus", { params }),
  getMenuById: (id) => request.get(`/api/admin/menu/${id}`),
  createMenu: (data) => request.post("/api/admin/menu", data),
  updateMenu: (id, data) => request.put(`/api/admin/menu/${id}`, data),
  deleteMenu: (id) => request.delete(`/api/admin/menu/${id}`),

  getMenusGroup: (params = {}) =>
    request.get("/api/admin/menu-groups", { params }),
  getMenuGroupById: (id) => request.get(`/api/admin/menu-groups/${id}`),
  createMenuGroup: (data) => request.post("/api/admin/menu-groups", data),
  updateMenuGroup: (id, data) =>
    request.put(`/api/admin/menu-groups/${id}`, data),
  deleteMenuGroup: (id) => request.delete(`/api/admin/menu-groups/${id}`),

  // User APIs
  getUser: () => request.get("/api/user/profile"),
  updateProfile: (data) => request.put("/api/user/profile", data),
  changePassword: (data) => request.post("/api/user/change-password", data),

  // Role & Permission APIs
  getRolePermissions: () => request.get("/api/admin/roles/permissions"),
  switchCurrentRole: (role) => request.post("/api/user/switch-role", { role }),
  validateMenuPath: (path) =>
    request.get("/api/permissions/validate-menu", { params: { path } }),

  // Categories APIs
  getAuthorities: (params = {}) =>
    request.get("/api/admin/edu-authorities", { params }),
  getAuthoritiesById: (params) =>
    request.get(`/api/admin/edu-authorities/detail`, { params }),
  createAuthorities: (data) => request.post("/api/admin/edu-authorities", data),
  updateAuthorities: (data) => request.put(`/api/admin/edu-authorities`, data),
  deleteAuthorities: (params) =>
    request.delete(`/api/admin/edu-authorities`, { params }),

  // Schools APIs
  getSchools: (params = {}) => request.get("/api/admin/schools", { params }),
  getSchoolById: (params) =>
    request.get(`/api/admin/schools/detail`, { params }),
  createSchool: (data) => request.post("/api/admin/schools", data),
  updateSchool: (data) => request.put(`/api/admin/schools`, data),
  deleteSchool: (params) => request.delete(`/api/admin/schools`, { params }),

  // Products APIs
  getProducts: (params = {}) => request.get("/api/admin/products", { params }),
  getProductById: (id) => request.get(`/api/admin/product/${id}`),
  createProduct: (data) => request.post("/api/admin/product", data),
  updateProduct: (id, data) => request.put(`/api/admin/product/${id}`, data),
  deleteProduct: (id) => request.delete(`/api/admin/product/${id}`),

  // Orders APIs
  getOrders: (params = {}) => request.get("/api/admin/orders", { params }),
  getOrderById: (id) => request.get(`/api/admin/order/${id}`),
  createOrder: (data) => request.post("/api/admin/order", data),
  updateOrder: (id, data) => request.put(`/api/admin/order/${id}`, data),
  deleteOrder: (id) => request.delete(`/api/admin/order/${id}`),

  // Discounts APIs
  getDiscounts: (params = {}) =>
    request.get("/api/admin/discounts", { params }),
  getDiscountById: (id) => request.get(`/api/admin/discount/${id}`),
  createDiscount: (data) => request.post("/api/admin/discount", data),
  updateDiscount: (id, data) => request.put(`/api/admin/discount/${id}`, data),
  deleteDiscount: (id) => request.delete(`/api/admin/discount/${id}`),
  pauseDiscount: (id) => request.put(`/api/admin/discount/${id}/pause`),
  resumeDiscount: (id) => request.put(`/api/admin/discount/${id}/resume`),

  // BlogCategories APIs
  getBlogCategories: (params = {}) =>
    request.get("/api/admin/news-categories", { params }),
  getBlogCategoryById: (id) => request.get(`/api/admin/new-category/${id}`),
  createBlogCategory: (data) => request.post("/api/admin/new-category", data),
  updateBlogCategory: (id, data) =>
    request.put(`/api/admin/new-category/${id}`, data),
  deleteBlogCategory: (id) => request.delete(`/api/admin/new-category/${id}`),

  // Blogs APIs
  getBlogs: (params = {}) => request.get("/api/admin/news", { params }),
  getBlogById: (id) => request.get(`/api/admin/new/${id}`),
  createBlog: (data) => request.post("/api/admin/new", data),
  updateBlog: (id, data) => request.put(`/api/admin/new/${id}`, data),
  deleteBlog: (id) => request.delete(`/api/admin/new/${id}`),

  // Tags APIs
  getTags: (params = {}) => request.get("/api/admin/tags", { params }),
  getTagById: (id) => request.get(`/api/admin/tag/${id}`),
  createTag: (data) => request.post("/api/admin/tag", data),
  updateTag: (id, data) => request.put(`/api/admin/tag/${id}`, data),
  deleteTag: (id) => request.delete(`/api/admin/tag/${id}`),

  // User Management APIs (Admin)
  getUsers: (params = {}) => request.get("/api/admin/users", { params }),
  createUser: (data) => request.post("/api/admin/users", data),
  getUserById: (params) => request.get(`/api/admin/user/detail`, { params }),
  updateUser: (params, data) => request.put(`/api/admin/user`, data),
  deleteUser: (params) => request.delete(`/api/admin/user`, { params }),
  resetUserPassword: (params, data) =>
    request.post(`/api/admin/user/reset-password`, data),

  // Role Management APIs (Admin)
  getAllRoles: (params = {}) => request.get("/api/admin/roles", { params }),
  createRole: (data) => request.post("/api/admin/roles", data),
  updateRole: (id, data) => request.put(`/api/admin/roles/${id}`, data),
  deleteRole: (id) => request.delete(`/api/admin/roles/${id}`),
  addRoleUsers: (roleId, data) =>
    request.post(`/api/admin/roles/${roleId}/users`, data),
  removeRoleUsers: (roleId, data) =>
    request.delete(`/api/admin/roles/${roleId}/users`, { data }),

  // Permission Management APIs (Admin)
  getMenuTree: () => request.get("/api/admin/permissions/menu-tree"),
  getButtons: (parentId) =>
    request.get(`/api/admin/permissions/buttons/${parentId}`),
  addPermission: (data) => request.post("/api/admin/permissions", data),
  updatePermission: (id, data) =>
    request.put(`/api/admin/permissions/${id}`, data),
  deletePermission: (id) => request.delete(`/api/admin/permissions/${id}`),
  getAllPermissionTree: () => request.get("/api/admin/permissions/tree"),
};
