<template>
  <n-menu
    ref="menuRef"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>

<script setup>
import { useAppStore, usePermissionStore } from "@/store";
import { isExternal } from "@/utils";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const menuRef = ref(null);

// Cấu trúc menu đúng format cho Naive UI
const menuOptions = computed(() => [
  // ---------------------------------------
  // DASHBOARD
  // ---------------------------------------
  {
    label: "Dashboard",
    key: "dashboard",
    path: "/",
    plans: ["basic", "plus", "pro"],
  },

  // ---------------------------------------
  // QUẢN LÝ HỆ THỐNG (TENANT LEVEL)
  // ---------------------------------------
  {
    label: "Quản lý hệ thống",
    key: "system",
    children: [
      {
        label: "Sở / Cơ quan giáo dục",
        key: "authorities",
        path: "/system/authorities",
        plans: ["plus", "pro"],
      },
      {
        label: "Trường học",
        key: "school",
        path: "/system/school",
        plans: ["basic", "plus", "pro"],
      },
      {
        label: "Vùng / Địa phương",
        key: "province",
        path: "/system/province",
        plans: ["pro"],
      },
      {
        label: "Giới hạn tài nguyên",
        key: "resource-limits",
        path: "/system/resource-limits",
        plans: ["plus", "pro"],
      },
    ],
  },

  // ---------------------------------------
  // NGƯỜI DÙNG & QUYỀN HỆ THỐNG
  // ---------------------------------------
  {
    label: "Người dùng & Quyền",
    key: "user-management",
    children: [
      {
        label: "Người dùng hệ thống",
        key: "user",
        path: "/user",
        plans: ["basic", "plus", "pro"],
      },
      {
        label: "Nhóm người dùng",
        key: "user-group",
        path: "/user-group",
        plans: ["plus", "pro"],
      },
      {
        label: "Vai trò",
        key: "role",
        path: "/role",
        plans: ["plus", "pro"],
      },
      {
        label: "Phân quyền vai trò",
        key: "role-permission",
        path: "/pms/role-permission",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // PHÂN QUYỀN MODULE HỆ THỐNG
  // ---------------------------------------
  {
    label: "Phân quyền hệ thống",
    key: "modules-management",
    children: [
      {
        label: "Modules",
        key: "modules",
        path: "/modules",
        plans: ["pro"],
      },
      {
        label: "Menu",
        key: "menu",
        path: "/modules/menu",
        plans: ["pro"],
      },
      {
        label: "Nhóm menus",
        key: "menu-groups",
        path: "/modules/menu-groups",
        plans: ["pro"],
      },
      {
        label: "Phân quyền menu",
        key: "menu-permission",
        path: "/modules/menu-permission",
        plans: ["pro"],
      },
      {
        label: "Nhật ký hoạt động",
        key: "operation-log",
        path: "/pms/operation-log",
        plans: ["plus", "pro"],
      },
    ],
  },

  // ---------------------------------------
  // GÓI DỊCH VỤ (SUBSCRIPTION / BILLING)
  // ---------------------------------------
  {
    label: "Gói dịch vụ",
    key: "subscription",
    children: [
      {
        label: "Gói dịch vụ",
        key: "plans",
        path: "/subscription/plans",
        plans: ["pro"],
      },
      {
        label: "Mã giảm giá",
        key: "coupon",
        path: "/subscription/discount",
        plans: ["pro"],
      },
      {
        label: "Đơn hàng",
        key: "orders",
        path: "/subscription/orders",
        plans: ["plus", "pro"],
      },
      {
        label: "Hoá đơn",
        key: "invoices",
        path: "/subscription/invoices",
        plans: ["plus", "pro"],
      },
    ],
  },

  // ---------------------------------------
  // FEATURE FLAGS (BẬT/TẮT TÍNH NĂNG)
  // ---------------------------------------
  {
    label: "Điều khiển tính năng",
    key: "feature-flags",
    children: [
      {
        label: "Tính năng theo gói",
        key: "feature-by-plan",
        path: "/features/by-plan",
        plans: ["pro"],
      },
      {
        label: "Tính năng theo trường",
        key: "feature-by-tenant",
        path: "/features/by-tenant",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // TÍCH HỢP HỆ THỐNG
  // ---------------------------------------
  {
    label: "Tích hợp",
    key: "integrations",
    children: [
      {
        label: "API Keys",
        key: "api-keys",
        path: "/integrations/api-keys",
        plans: ["plus", "pro"],
      },
      {
        label: "Webhooks",
        key: "webhooks",
        path: "/integrations/webhooks",
        plans: ["pro"],
      },
      {
        label: "SMTP / SMS",
        key: "smtp-sms",
        path: "/integrations/smtp-sms",
        plans: ["plus", "pro"],
      },
      {
        label: "Cổng thanh toán",
        key: "payment-gateway",
        path: "/integrations/payment-gateway",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // CẤU HÌNH HỆ THỐNG
  // ---------------------------------------
  {
    label: "Cấu hình hệ thống",
    key: "system-settings",
    children: [
      {
        label: "Cấu hình chung",
        key: "general-setting",
        path: "/settings/general",
        plans: ["pro"],
      },
      {
        label: "Cấu hình bảo mật",
        key: "security-setting",
        path: "/settings/security",
        plans: ["pro"],
      },
      {
        label: "Cấu hình lưu trữ",
        key: "storage-setting",
        path: "/settings/storage",
        plans: ["pro"],
      },
      {
        label: "Backup & Restore",
        key: "backup",
        path: "/settings/backup",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // TEMPLATES (EMAIL / SMS / NOTIFICATION)
  // ---------------------------------------
  {
    label: "Mẫu thông báo",
    key: "templates",
    children: [
      {
        label: "Email Templates",
        key: "email-template",
        path: "/templates/email",
        plans: ["plus", "pro"],
      },
      {
        label: "SMS Templates",
        key: "sms-template",
        path: "/templates/sms",
        plans: ["plus", "pro"],
      },
      {
        label: "Invoice Templates",
        key: "invoice-template",
        path: "/templates/invoice",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // LOGS (AUDIT / API / ERROR / SECURITY)
  // ---------------------------------------
  {
    label: "Nhật ký hệ thống",
    key: "logs",
    children: [
      {
        label: "Audit Log",
        key: "audit-log",
        path: "/logs/audit",
        plans: ["pro"],
      },
      {
        label: "API Log",
        key: "api-log",
        path: "/logs/api",
        plans: ["pro"],
      },
      {
        label: "Error Log",
        key: "error-log",
        path: "/logs/error",
        plans: ["plus", "pro"],
      },
      {
        label: "Security Log",
        key: "security-log",
        path: "/logs/security",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // SUPPORT CENTER
  // ---------------------------------------
  {
    label: "Hỗ trợ",
    key: "support",
    children: [
      {
        label: "Ticket hỗ trợ",
        key: "ticket",
        path: "/support/ticket",
        plans: ["basic", "plus", "pro"],
      },
      {
        label: "Lịch sử hỗ trợ",
        key: "support-history",
        path: "/support/history",
        plans: ["plus", "pro"],
      },
      {
        label: "Đăng nhập thay",
        key: "impersonate",
        path: "/support/impersonate",
        plans: ["pro"],
      },
    ],
  },

  // ---------------------------------------
  // PHÂN TÍCH HỆ THỐNG
  // ---------------------------------------
  {
    label: "Phân tích hệ thống",
    key: "system-analytics",
    children: [
      {
        label: "Thống kê tenant",
        key: "tenant-analytics",
        path: "/analytics/tenants",
        plans: ["pro"],
      },
      {
        label: "Thống kê người dùng",
        key: "user-analytics",
        path: "/analytics/users",
        plans: ["pro"],
      },
      {
        label: "Thống kê tính năng",
        key: "feature-analytics",
        path: "/analytics/features",
        plans: ["pro"],
      },
      {
        label: "Health Monitoring",
        key: "health-monitor",
        path: "/analytics/health",
        plans: ["pro"],
      },
    ],
  },
]);

// Tìm menu item theo key
function findMenuItem(options, key) {
  for (const item of options) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

const activeKey = computed(() => {
  if (route.meta?.parentKey) return route.meta.parentKey;

  if (route.meta?.key) return route.meta.key;

  const currentPath = route.path;

  function findMatchingMenu(options) {
    function _search(opts) {
      let best = null;
      for (const item of opts) {
        if (item.path) {
          if (currentPath === item.path) {
            return { key: item.key, length: item.path.length };
          }
          if (currentPath.startsWith(item.path + "/")) {
            if (!best || item.path.length > best.length) {
              best = { key: item.key, length: item.path.length };
            }
          }
        }

        if (item.children) {
          const childBest = _search(item.children);
          if (childBest) {
            if (!best || childBest.length >= best.length) {
              return childBest;
            }
          }
        }
      }
      return best;
    }

    const result = _search(options);
    return result ? result.key : null;
  }

  const matchedKey = findMatchingMenu(menuOptions.value);
  if (matchedKey) return matchedKey;

  // Fallback về route name
  return route.name;
});

// Xử lý khi click menu
function handleMenuSelect(key, item) {
  // Nếu không có item, tìm trong menu options
  if (!item) {
    item = findMenuItem(menuOptions.value, key);
  }

  // Kiểm tra item có path không
  if (!item || !item.path) {
    return;
  }

  try {
    if (isExternal(item.originPath || item.path)) {
      $dialog.confirm({
        type: "info",
        title: "Vui lòng chọn cách mở",
        positiveText: "Mở liên kết ngoài",
        negativeText: "Mở nhúng trong trang này",
        onPositiveClick() {
          window.open(item.originPath || item.path);
        },
        onNegativeClick() {
          router.push(item.path);
        },
      });
    } else {
      router.push(item.path);
    }
  } catch (error) {
    console.error("Lỗi khi xử lý menu:", error);
  }
}

// Watch route changes
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {});
  },
  { immediate: true }
);
</script>

<style>
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 8px;
      right: 8px;
    }
    &.n-menu-item-content--selected::before {
      border-left: 4px solid rgb(var(--primary-color));
    }
  }
}
</style>
