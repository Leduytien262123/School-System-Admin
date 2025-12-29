<template>
  <div>
    <n-space vertical>
      <div class="flex justify-between items-center mb-4">
        <n-text>
          Quản lý menu cho gói <n-tag :type="packageTypeMap[package]">{{ package }}</n-tag>
        </n-text>
        <n-button type="primary" @click="showAssignModal = true">
          <template #icon>
            <i class="fa fa-plus" />
          </template>
          Gán menu cho gói
        </n-button>
      </div>

      <n-spin :show="loading">
        <n-tree
          block-line
          :data="menuTree"
          :checked-keys="checkedKeys"
          checkable
          cascade
          selectable
          @update:checked-keys="handleCheck"
        />
      </n-spin>

      <n-empty
        v-if="!loading && menuTree.length === 0"
        description="Chưa có menu nào được gán cho gói này"
      />
    </n-space>

    <!-- Modal gán menu -->
    <NaiveModal
      :show="showAssignModal"
      title="Gán menu cho gói"
      @update:show="showAssignModal = $event"
      class="w-[90%] lg:w-[700px]"
    >
      <n-spin :show="assignLoading">
        <n-form>
          <n-form-item label="Chọn menu cần gán">
            <n-tree
              block-line
              :data="availableMenuTree"
              checkable
              cascade
              v-model:checked-keys="selectedMenuIds"
              default-expand-all
            />
          </n-form-item>
        </n-form>
      </n-spin>

      <div class="mt-20">
        <n-space justify="end">
          <n-button @click="showAssignModal = false">Hủy</n-button>
          <n-button type="primary" @click="handleAssignMenus" :loading="assignLoading">
            Xác nhận
          </n-button>
        </n-space>
      </div>
    </NaiveModal>
  </div>
</template>

<script setup>
defineOptions({ name: "PackageMenuList" });

const props = defineProps({
  package: {
    type: String,
    required: true,
    validator: (val) => ["BASIC", "PLUS", "PREMIUM"].includes(val),
  },
});

const loading = ref(false);
const assignLoading = ref(false);
const menuTree = ref([]);
const availableMenuTree = ref([]);
const checkedKeys = ref([]);
const selectedMenuIds = ref([]);
const showAssignModal = ref(false);

const packageTypeMap = {
  BASIC: "default",
  PLUS: "info",
  PREMIUM: "success",
};

async function loadPackageMenus() {
  try {
    loading.value = true;
    const response = await api.getPackageMenus(props.package);
    if (response.data?.success) {
      const menus = response.data.data?.menus || [];
      menuTree.value = buildMenuTree(menus);
      checkedKeys.value = menus.map((m) => m.id);
    }
  } catch (error) {
    $message.error("Không thể tải menu của gói");
  } finally {
    loading.value = false;
  }
}

async function loadAvailableMenus() {
  try {
    const response = await api.getMenus({ page: 1, length: 1000 });
    if (response.data?.success) {
      const menus = response.data.data?.menus || [];
      availableMenuTree.value = buildMenuTree(menus);
    }
  } catch (error) {
    console.error("Không thể tải danh sách menu");
  }
}

function buildMenuTree(menus) {
  const map = {};
  const roots = [];

  // Tạo map các menu
  menus.forEach((menu) => {
    map[menu.id] = {
      key: menu.id,
      label: menu.name,
      children: [],
      ...menu,
    };
  });

  // Build tree structure
  menus.forEach((menu) => {
    if (menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children.push(map[menu.id]);
    } else {
      roots.push(map[menu.id]);
    }
  });

  return roots;
}

async function handleCheck(keys) {
  // Xử lý khi check/uncheck menu
  console.log("Checked keys:", keys);
}

async function handleAssignMenus() {
  if (selectedMenuIds.value.length === 0) {
    $message.warning("Vui lòng chọn ít nhất 1 menu");
    return;
  }

  try {
    assignLoading.value = true;
    await api.assignMenusToPackage({
      package: props.package,
      menuIds: selectedMenuIds.value,
      isEnabled: true,
    });
    $message.success("Gán menu cho gói thành công!");
    showAssignModal.value = false;
    selectedMenuIds.value = [];
    await loadPackageMenus();
  } catch (error) {
    $message.error("Không thể gán menu cho gói");
  } finally {
    assignLoading.value = false;
  }
}

watch(
  () => showAssignModal.value,
  (val) => {
    if (val) {
      loadAvailableMenus();
    }
  }
);

onMounted(() => {
  loadPackageMenus();
});
</script>
