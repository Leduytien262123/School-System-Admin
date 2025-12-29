export const basicRoutes = [
  // Auth / Home
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "Trang đăng nhập", layout: "empty" },
  },
  {
    name: "Home",
    path: "/",
    component: () => import("@/views/home/index.vue"),
    meta: { title: "Trang chủ" },
  },

  // Demo
  {
    name: "test-upload",
    path: "/demo/upload",
    component: () => import("@/views/demo/upload/index.vue"),
    meta: { title: "Demo upload" },
  },

  // Error pages
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { title: "Trang không tồn tại", layout: "empty" },
  },
  {
    name: "403",
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: { title: "Không có quyền truy cập", layout: "empty" },
  },

  // Analytics
  {
    name: "analytics-features",
    path: "/analytics/features",
    component: () => import("@/views/analytics/features/index.vue"),
    meta: { title: "Phân tích tính năng" },
  },
  {
    name: "analytics-health",
    path: "/analytics/health",
    component: () => import("@/views/analytics/health/index.vue"),
    meta: { title: "Tình trạng hệ thống" },
  },
  {
    name: "analytics-tenants",
    path: "/analytics/tenants",
    component: () => import("@/views/analytics/tenants/index.vue"),
    meta: { title: "Phân tích tenants" },
  },
  {
    name: "analytics-users",
    path: "/analytics/users",
    component: () => import("@/views/analytics/users/index.vue"),
    meta: { title: "Phân tích người dùng" },
  },

  // Base
  {
    name: "base",
    path: "/base",
    component: () => import("@/views/base/index.vue"),
    meta: { title: "Base" },
  },
  {
    name: "base-keep-alive",
    path: "/base/keep-alive",
    component: () => import("@/views/base/keep-alive.vue"),
    meta: { title: "Keep Alive Demo" },
  },
  {
    name: "base-test-modal",
    path: "/base/test-modal",
    component: () => import("@/views/base/test-modal.vue"),
    meta: { title: "Test Modal" },
  },
  {
    name: "base-unocss",
    path: "/base/unocss",
    component: () => import("@/views/base/unocss.vue"),
    meta: { title: "UnoCSS Demo" },
  },
  {
    name: "base-unocss-icon",
    path: "/base/unocss-icon",
    component: () => import("@/views/base/unocss-icon.vue"),
    meta: { title: "UnoCSS Icons" },
  },

  // Features
  {
    name: "features-by-plan",
    path: "/features/by-plan",
    component: () => import("@/views/features/by-plan/index.vue"),
    meta: { title: "Tính năng theo gói" },
  },
  {
    name: "features-by-tenant",
    path: "/features/by-tenant",
    component: () => import("@/views/features/by-tenant/index.vue"),
    meta: { title: "Tính năng theo tenant" },
  },

  // Iframe
  {
    name: "iframe",
    path: "/iframe",
    component: () => import("@/views/iframe/index.vue"),
    meta: { title: "Iframe" },
  },

  // Integrations
  {
    name: "integrations-api-keys",
    path: "/integrations/api-keys",
    component: () => import("@/views/integrations/api-keys/index.vue"),
    meta: { title: "Quản lý API Keys" },
  },
  {
    name: "integrations-payment-gateway",
    path: "/integrations/payment-gateway",
    component: () => import("@/views/integrations/payment-gateway/index.vue"),
    meta: { title: "Cổng thanh toán" },
  },
  {
    name: "integrations-smtp-sms",
    path: "/integrations/smtp-sms",
    component: () => import("@/views/integrations/smtp-sms/index.vue"),
    meta: { title: "Cấu hình SMTP & SMS" },
  },
  {
    name: "integrations-webhooks",
    path: "/integrations/webhooks",
    component: () => import("@/views/integrations/webhooks/index.vue"),
    meta: { title: "Quản lý Webhooks" },
  },

  // Logs
  {
    name: "logs-api",
    path: "/logs/api",
    component: () => import("@/views/logs/api/index.vue"),
    meta: { title: "Nhật ký API" },
  },
  {
    name: "logs-audit",
    path: "/logs/audit",
    component: () => import("@/views/logs/audit/index.vue"),
    meta: { title: "Nhật ký kiểm toán" },
  },
  {
    name: "logs-error",
    path: "/logs/error",
    component: () => import("@/views/logs/error/index.vue"),
    meta: { title: "Nhật ký lỗi" },
  },
  {
    name: "logs-security",
    path: "/logs/security",
    component: () => import("@/views/logs/security/index.vue"),
    meta: { title: "Nhật ký bảo mật" },
  },

  // Modules
  {
    name: "modules",
    path: "/modules",
    component: () => import("@/views/modules/index.vue"),
    meta: { title: "Quản lý modules", key: "modules" },
  },
  {
    name: "modules-menu",
    path: "/modules/menu",
    component: () => import("@/views/modules/menu/index.vue"),
    meta: { title: "Quản lý menu", key: "menu" },
  },
  {
    name: "modules-menu-groups",
    path: "/modules/menu-groups",
    component: () => import("@/views/modules/menu-groups/index.vue"),
    meta: { title: "Nhóm menu", key: "menu-groups" },
  },
  {
    name: "modules-menu-permission",
    path: "/modules/menu-permission",
    component: () => import("@/views/modules/menu-permisssion/index.vue"),
    meta: { title: "Phân quyền menu", key: "menu-permission" },
  },

  // PMS
  {
    name: "pms-operation-log",
    path: "/pms/operation-log",
    component: () => import("@/views/pms/operation-log/index.vue"),
    meta: { title: "Nhật ký thao tác" },
  },
  {
    name: "pms-role-permission",
    path: "/pms/role-permission",
    component: () => import("@/views/pms/role-permission/index.vue"),
    meta: { title: "Phân quyền vai trò" },
  },

  // Profile & Role
  {
    name: "profile",
    path: "/profile",
    component: () => import("@/views/profile/index.vue"),
    meta: { title: "Hồ sơ cá nhân" },
  },
  {
    name: "role",
    path: "/role",
    component: () => import("@/views/role/index.vue"),
    meta: { title: "Quản lý vai trò" },
  },

  // Settings
  {
    name: "settings-backup",
    path: "/settings/backup",
    component: () => import("@/views/settings/backup/index.vue"),
    meta: { title: "Sao lưu dữ liệu" },
  },
  {
    name: "settings-general",
    path: "/settings/general",
    component: () => import("@/views/settings/general/index.vue"),
    meta: { title: "Cài đặt chung" },
  },
  {
    name: "settings-general-add",
    path: "/settings/general/add",
    component: () => import("@/views/settings/general/add.vue"),
    meta: { title: "Thêm cài đặt" },
  },
  {
    name: "settings-general-detail",
    path: "/settings/general/:id",
    component: () => import("@/views/settings/general/[id].vue"),
    meta: { title: "Chi tiết cài đặt" },
  },
  {
    name: "settings-security",
    path: "/settings/security",
    component: () => import("@/views/settings/security/index.vue"),
    meta: { title: "Cài đặt bảo mật" },
  },
  {
    name: "settings-storage",
    path: "/settings/storage",
    component: () => import("@/views/settings/storage/index.vue"),
    meta: { title: "Cài đặt lưu trữ" },
  },

  // Subscription
  {
    name: "subscription-discount",
    path: "/subscription/discount",
    component: () => import("@/views/subscription/discount/index.vue"),
    meta: { title: "Quản lý giảm giá" },
  },
  {
    name: "subscription-discount-add",
    path: "/subscription/discount/add",
    component: () => import("@/views/subscription/discount/add.vue"),
    meta: { title: "Thêm giảm giá" },
  },
  {
    name: "subscription-discount-edit",
    path: "/subscription/discount/edit/:id",
    component: () => import("@/views/subscription/discount/edit/[id].vue"),
    meta: { title: "Sửa giảm giá" },
  },
  {
    name: "subscription-invoices",
    path: "/subscription/invoices",
    component: () => import("@/views/subscription/invoices/index.vue"),
    meta: { title: "Quản lý hóa đơn" },
  },
  {
    name: "subscription-orders",
    path: "/subscription/orders",
    component: () => import("@/views/subscription/orders/index.vue"),
    meta: { title: "Quản lý đơn đăng ký" },
  },
  {
    name: "subscription-orders-add",
    path: "/subscription/orders/add",
    component: () => import("@/views/subscription/orders/add.vue"),
    meta: { title: "Thêm đơn đăng ký" },
  },
  {
    name: "subscription-orders-edit",
    path: "/subscription/orders/edit/:id",
    component: () => import("@/views/subscription/orders/edit/[id].vue"),
    meta: { title: "Sửa đơn đăng ký" },
  },
  {
    name: "subscription-plans",
    path: "/subscription/plans",
    component: () => import("@/views/subscription/plans/index.vue"),
    meta: { title: "Quản lý gói dịch vụ" },
  },

  // Support
  {
    name: "support-history",
    path: "/support/history",
    component: () => import("@/views/support/history/index.vue"),
    meta: { title: "Lịch sử hỗ trợ" },
  },
  {
    name: "support-impersonate",
    path: "/support/impersonate",
    component: () => import("@/views/support/impersonate/index.vue"),
    meta: { title: "Mạo danh người dùng" },
  },
  {
    name: "support-ticket",
    path: "/support/ticket",
    component: () => import("@/views/support/ticket/index.vue"),
    meta: { title: "Quản lý ticket" },
  },

  // System
  {
    name: "system-authorities",
    path: "/system/authorities",
    component: () => import("@/views/system/authorities/index.vue"),
    meta: { title: "Quản lý quyền hạn" },
  },
  // {
  //   name: "system-authorities-add",
  //   path: "/system/authorities/add",
  //   component: () => import("@/views/system/authorities/add.vue"),
  //   meta: { title: "Thêm quyền hạn" },
  // },
  // {
  //   name: "system-authorities-edit",
  //   path: "/system/authorities/edit/:id",
  //   component: () => import("@/views/system/authorities/edit/[id].vue"),
  //   meta: { title: "Sửa quyền hạn" },
  // },
  {
    name: "system-province",
    path: "/system/province",
    component: () => import("@/views/system/province/index.vue"),
    meta: { title: "Quản lý tỉnh/thành" },
  },
  {
    name: "system-resource-limits",
    path: "/system/resource-limits",
    component: () => import("@/views/system/resource-limits/index.vue"),
    meta: { title: "Giới hạn tài nguyên" },
  },
  {
    name: "system-school",
    path: "/system/school",
    component: () => import("@/views/system/school/index.vue"),
    meta: { title: "Quản lý trường học" },
  },

  // Templates
  {
    name: "templates-email",
    path: "/templates/email",
    component: () => import("@/views/templates/email/index.vue"),
    meta: { title: "Mẫu Email" },
  },
  {
    name: "templates-invoice",
    path: "/templates/invoice",
    component: () => import("@/views/templates/invoice/index.vue"),
    meta: { title: "Mẫu hóa đơn" },
  },
  {
    name: "templates-sms",
    path: "/templates/sms",
    component: () => import("@/views/templates/sms/index.vue"),
    meta: { title: "Mẫu SMS" },
  },
  {
    name: "templates-sms-add",
    path: "/templates/sms/add",
    component: () => import("@/views/templates/sms/add.vue"),
    meta: { title: "Thêm mẫu SMS" },
  },
  {
    name: "templates-sms-detail",
    path: "/templates/sms/:id",
    component: () => import("@/views/templates/sms/[id].vue"),
    meta: { title: "Chi tiết mẫu SMS" },
  },

  // User Group
  {
    name: "user-group",
    path: "/user-group",
    component: () => import("@/views/user-group/index.vue"),
    meta: { title: "Quản lý nhóm người dùng" },
  },
  {
    name: "user-group-add",
    path: "/user-group/add",
    component: () => import("@/views/user-group/add.vue"),
    meta: { title: "Thêm nhóm người dùng" },
  },
  {
    name: "user-group-detail",
    path: "/user-group/:id",
    component: () => import("@/views/user-group/[id].vue"),
    meta: { title: "Chi tiết nhóm người dùng" },
  },

  // User
  {
    name: "user",
    path: "/user",
    component: () => import("@/views/user/index.vue"),
    meta: { title: "Quản lý khách hàng" },
  },
  {
    name: "user_add",
    path: "/user/add",
    component: () => import("@/views/user/add.vue"),
    meta: { title: "Thêm khách hàng" },
  },
  {
    name: "user_edit",
    path: "/user/edit/:id",
    component: () => import("@/views/user/edit/[id].vue"),
    meta: { title: "Sửa khách hàng" },
  },
];
