<template>
  <CommonPage>
    <n-card title="Quản lý menu theo Role">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Chọn Role" class="w-1/2">
            <NaiveSelect
              v-model:value="selectedRole"
              :options="roleOptions"
              placeholder="Chọn role"
              @update:value="handleRoleChange"
            />
          </n-form-item>
          <n-button type="primary" @click="showAssignModal = true" :disabled="!selectedRole">
            <template #icon>
              <i class="fa fa-plus" />
            </template>
            Gán menu cho role
          </n-button>
        </div>

        <n-spin :show="loading">
          <n-alert v-if="!selectedRole" type="info" class="mb-4">
            Vui lòng chọn role để xem menu được phân quyền
          </n-alert>
          
          <n-tree
            v-if="selectedRole && menuTree.length > 0"
            block-line
            :data="menuTree"
            :checked-keys="checkedKeys"
            checkable
            cascade
            default-expand-all
            @update:checked-keys="handleCheck"
          />

          <n-empty
            v-if="selectedRole && !loading && menuTree.length === 0"
            description="Chưa có menu nào được gán cho role này"
          />
        </n-spin>
      </n-space>
    </n-card>

    <!-- Modal gán menu -->
    <NaiveModal
      :show="showAssignModal"
      :title="`Gán menu cho role: ${selectedRoleName}`"
      @update:show="showAssignModal = $event"
      class="w-[90%] lg:w-[800px]"
    >
      <n-spin :show="assignLoading">
        <n-form>
          <n-form-item label="School (Tùy chọn)">
            <NaiveSelect
              v-model:value="assignForm.schoolId"
              :options="schoolOptions"
              placeholder="Để trống = Áp dụng toàn hệ thống"
              clearable
            />
          </n-form-item>

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
  </CommonPage>
</template>

<script setup>
defineOptions({ name: "RoleMenuManagement" });

const loading = ref(false);
const assignLoading = ref(false);
const selectedRole = ref(null);
const selectedRoleName = computed(() => {
  const role = roleOptions.value.find((r) => r.value === selectedRole.value);
  return role?.label || "";
});

const menuTree = ref([]);
const availableMenuTree = ref([]);
const checkedKeys = ref([]);
const selectedMenuIds = ref([]);
const showAssignModal = ref(false);

const roleOptions = ref([
  { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
  { label: "SCHOOL_ADMIN", value: "SCHOOL_ADMIN" },
  { label: "TEACHER", value: "TEACHER" },
  { label: "STUDENT", value: "STUDENT" },
  { label: "PARENT", value: "PARENT" },
  { label: "ACCOUNTANT", value: "ACCOUNTANT" },
]);

const schoolOptions = ref([]);

const assignForm = ref({
  schoolId: null,
});

async function loadRoleMenus() {
  if (!selectedRole.value) return;

  try {
    loading.value = true;
    const response = await api.getRoleMenus(selectedRole.value);
    if (response.data?.success) {
      const menus = response.data.data?.menus || [];
      menuTree.value = buildMenuTree(menus);
      checkedKeys.value = menus.map((m) => m.id);
    }
  } catch (error) {
    $message.error("Không thể tải menu của role");
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

async function loadSchools() {
  try {
    const response = await api.getSchools({ page: 1, length: 100 });
    if (response.data?.success) {
      schoolOptions.value = (response.data.data?.list || []).map((school) => ({
        label: school.name,
        value: school.id,
      }));
    }
  } catch (error) {
    console.error("Không thể tải danh sách trường");
  }
}

function buildMenuTree(menus) {
  const map = {};
  const roots = [];

  menus.forEach((menu) => {
    map[menu.id] = {
      key: menu.id,
      label: `${menu.name} (${menu.code})`,
      children: [],
      ...menu,
    };
  });

  menus.forEach((menu) => {
    if (menu.parent_id && map[menu.parent_id]) {
      map[menu.parent_id].children.push(map[menu.id]);
    } else {
      roots.push(map[menu.id]);
    }
  });

  return roots;
}

function handleRoleChange() {
  loadRoleMenus();
}

async function handleCheck(keys) {
  console.log("Checked keys:", keys);
}

async function handleAssignMenus() {
  if (!selectedRole.value) {
    $message.warning("Vui lòng chọn role");
    return;
  }

  if (selectedMenuIds.value.length === 0) {
    $message.warning("Vui lòng chọn ít nhất 1 menu");
    return;
  }

  try {
    assignLoading.value = true;
    await api.assignMenusToRole({
      roleCode: selectedRole.value,
      menuIds: selectedMenuIds.value,
      schoolId: assignForm.value.schoolId || null,
      isEnabled: true,
    });
    $message.success("Gán menu cho role thành công!");
    showAssignModal.value = false;
    selectedMenuIds.value = [];
    assignForm.value.schoolId = null;
    await loadRoleMenus();
  } catch (error) {
    $message.error("Không thể gán menu cho role");
  } finally {
    assignLoading.value = false;
  }
}

watch(
  () => showAssignModal.value,
  (val) => {
    if (val) {
      loadAvailableMenus();
      loadSchools();
    }
  }
);

onMounted(() => {
  loadSchools();
});
</script>
