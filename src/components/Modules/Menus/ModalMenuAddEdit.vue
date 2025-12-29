<template>
  <NaiveModal
    :show="show"
    :title="isEdit ? 'Sửa menu' : 'Thêm menu'"
    @update:show="$emit('update:show', $event)"
    class="w-[90%] lg:w-[900px]"
  >
    <n-spin :show="loading">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="top"
      >
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="Nhóm menu" path="groupId">
            <NaiveSelect
              v-model:value="formValue.groupId"
              :options="menuGroupOptions"
              placeholder="Chọn nhóm menu"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Menu cha">
            <NaiveSelect
              v-model:value="formValue.parentId"
              :options="parentMenuOptions"
              placeholder="Chọn menu cha (nếu có)"
              clearable
            />
          </n-form-item-gi>

          <n-form-item-gi label="Mã menu" path="code">
            <NaiveInput
              v-model:value="formValue.code"
              placeholder="VD: STUDENT_LIST"
              :disabled="isEdit"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Tên menu" path="name">
            <NaiveInput
              v-model:value="formValue.name"
              placeholder="VD: Danh sách học sinh"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Đường dẫn" path="path">
            <NaiveInput
              v-model:value="formValue.path"
              placeholder="VD: /students"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Icon">
            <NaiveInput
              v-model:value="formValue.icon"
              placeholder="VD: fa-list, mdi-account"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Loại menu" path="type">
            <NaiveSelect
              v-model:value="formValue.type"
              :options="[
                { label: 'Menu Item', value: 'ITEM' },
                { label: 'Nhóm con', value: 'GROUP' },
              ]"
              placeholder="Chọn loại menu"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Thứ tự hiển thị" path="order">
            <NaiveInputNumber
              v-model:value="formValue.order"
              :min="1"
              placeholder="Thứ tự sắp xếp"
              class="w-full"
            />
          </n-form-item-gi>
        </n-grid>

        <n-divider>Phân quyền (Permission)</n-divider>

        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="Module">
            <NaiveSelect
              v-model:value="formValue.moduleCode"
              :options="moduleOptions"
              placeholder="Chọn module"
              clearable
              @update:value="handleModuleChange"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Resource">
            <NaiveInput
              v-model:value="formValue.requiredResource"
              placeholder="VD: students"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Action" span="2">
            <NaiveInput
              v-model:value="formValue.requiredAction"
              placeholder="VD: read, create, update, delete"
            />
          </n-form-item-gi>
        </n-grid>

        <n-form-item label="Mô tả">
          <NaiveInput
            v-model:value="formValue.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="Mô tả ngắn về menu"
          />
        </n-form-item>

        <n-form-item label="Trạng thái">
          <div style="display: flex; align-items: center; gap: 8px">
            <n-switch v-model:value="formValue.status" />
            <span>{{ formValue.status ? "Hoạt động" : "Dừng hoạt động" }}</span>
          </div>
        </n-form-item>
      </n-form>
    </n-spin>

    <div class="mt-20">
      <ButtonSave
        :isEdit="isEdit"
        :handleBack="handleBack"
        :handleSave="handleSave"
        :loading="loading"
      />
    </div>
  </NaiveModal>
</template>

<script setup>
defineOptions({ name: "ModalMenuAddEdit" });

const props = defineProps({
  id: { type: [String, Number], default: null },
  show: { type: Boolean, default: false },
});

const emit = defineEmits(["update:show", "reload"]);

const formRef = ref(null);
const loading = ref(false);
const isEdit = computed(() => !!props.id);

const formValue = ref({
  groupId: null,
  parentId: null,
  code: "",
  name: "",
  description: "",
  path: "",
  icon: "",
  type: "ITEM",
  moduleCode: null,
  requiredResource: "",
  requiredAction: "",
  order: 1,
  status: true,
});

const rules = {
  groupId: [
    {
      required: true,
      message: "Nhóm menu không được để trống",
      trigger: ["change"],
    },
  ],
  code: [
    {
      required: true,
      message: "Mã menu không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  name: [
    {
      required: true,
      message: "Tên menu không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  type: [
    {
      required: true,
      message: "Loại menu không được để trống",
      trigger: ["change"],
    },
  ],
  order: [
    {
      required: true,
      type: "number",
      message: "Thứ tự không được để trống",
      trigger: ["blur", "change"],
    },
  ],
};

const menuGroupOptions = ref([]);
const parentMenuOptions = ref([]);
const moduleOptions = ref([]);

async function loadMenuGroups() {
  try {
    const response = await api.getMenuGroups({ page: 1, length: 100 });
    if (response.data.success) {
      menuGroupOptions.value = (response.data?.data?.list || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
  } catch (error) {
    console.error("Không thể tải nhóm menu");
  }
}

async function loadParentMenus() {
  try {
    const response = await api.getMenus({ page: 1, length: 500 });
    if (response.data.success) {
      const allMenus = response.data?.data?.menus || [];
      parentMenuOptions.value = allMenus
        .filter((m) => !props.id || m.id !== props.id)
        .map((item) => ({
          label: item.name,
          value: item.id,
        }));
    }
  } catch (error) {
    console.error("Không thể tải danh sách menu cha");
  }
}

async function loadModules() {
  try {
    const response = await api.getModules({ page: 1, length: 100 });
    if (response.data.success) {
      moduleOptions.value = (response.data?.data?.list || []).map((item) => ({
        label: item.name,
        value: item.code,
      }));
    }
  } catch (error) {
    console.error("Không thể tải danh sách module");
  }
}

function handleModuleChange(value) {
  // Có thể load permissions của module nếu cần
  console.log("Module selected:", value);
}

async function loadDetail() {
  if (!isEdit.value) return;

  try {
    loading.value = true;
    const response = await api.getMenuById(props.id);
    if (response.data?.success) {
      const data = response.data.data;
      formValue.value = {
        groupId: data.group_id || null,
        parentId: data.parent_id || null,
        code: data.code || "",
        name: data.name || "",
        description: data.description || "",
        path: data.path || "",
        icon: data.icon || "",
        type: data.type || "ITEM",
        moduleCode: data.module_code || null,
        requiredResource: data.required_resource || "",
        requiredAction: data.required_action || "",
        order: data.order || 1,
        status: data.status ?? true,
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin menu");
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  emit("update:show", false);
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    if (loading.value) return;
    loading.value = true;

    const payload = {
      group_id: formValue.value.groupId,
      parent_id: formValue.value.parentId || null,
      code: formValue.value.code,
      name: formValue.value.name,
      description: formValue.value.description,
      path: formValue.value.path,
      icon: formValue.value.icon,
      type: formValue.value.type,
      module_code: formValue.value.moduleCode || null,
      required_resource: formValue.value.requiredResource || null,
      required_action: formValue.value.requiredAction || null,
      order: formValue.value.order,
      status: formValue.value.status,
    };

    if (isEdit.value) {
      await api.updateMenu(props.id, payload);
      $message.success("Cập nhật menu thành công!");
    } else {
      await api.createMenu(payload);
      $message.success("Thêm menu thành công!");
    }

    handleBack();
    emit("reload");
  } catch (error) {
    if (error?.errors) return;
    $message.error(isEdit.value ? "Cập nhật menu thất bại" : "Thêm menu thất bại");
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
}

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await Promise.all([loadMenuGroups(), loadParentMenus(), loadModules()]);
      if (isEdit.value) {
        await loadDetail();
      }
    } else {
      formValue.value = {
        groupId: null,
        parentId: null,
        code: "",
        name: "",
        description: "",
        path: "",
        icon: "",
        type: "ITEM",
        moduleCode: null,
        requiredResource: "",
        requiredAction: "",
        order: 1,
        status: true,
      };
      formRef.value?.restoreValidation?.();
    }
  }
);
</script>
