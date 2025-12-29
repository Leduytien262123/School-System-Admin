<script setup>
defineOptions({ name: "MenusAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:show", "reload"]);

const formRef = ref(null);
const loading = ref(false);
const isEdit = computed(() => !!props.id);

const formValue = ref({
  code: "",
  name: "",
  description: "",
  icon: "fa-users",
  order: 1,
  status: true,
});

const rules = {
  code: [
    {
      required: true,
      message: "Mã chức năng không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  name: [
    {
      required: true,
      message: "Tên chức năng không được để trống",
      trigger: ["blur", "input"],
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

async function loadMenuDetail() {
  if (!isEdit.value) return;

  try {
    loading.value = true;
    const response = await api.getMenuGroupById(props.id);
    if (response.data?.success) {
      const data = response.data.data;
      formValue.value = {
        code: data.code || "",
        name: data.name || "",
        description: data.description || "",
        icon: data.icon || "",
        order: data.order ?? 1,
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
      code: formValue.value.code,
      name: formValue.value.name,
      description: formValue.value.description,
      icon: formValue.value.icon,
      order: Number(formValue.value.order) || 1,
      status: !!formValue.value.status,
    };

    if (isEdit.value) {
      await api.updateMenuGroup(props.id, payload);
      $message.success("Cập nhật nhóm menu thành công!");
    } else {
      await api.createMenuGroup(payload);
      $message.success("Thêm nhóm menu thành công!");
    }

    handleBack();
    emit("reload");
  } catch (error) {
    if (error?.errors) return;
    $message.error(
      isEdit.value ? "Cập nhật nhóm menu thất bại" : "Thêm nhóm menu thất bại"
    );
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
      if (isEdit.value) {
        await loadMenuDetail();
      }
    } else {
      formValue.value = {
        code: "",
        name: "",
        description: "",
        icon: "fa-users",
        order: 1,
        status: true,
      };

      formRef.value?.reset?.();
      formRef.value?.restoreValidation?.();
    }
  }
);
</script>

<template>
  <NaiveModal
    :show="show"
    :title="isEdit ? 'Sửa menu' : 'Thêm menu'"
    @update:show="$emit('update:show', $event)"
    class="w-[90%] lg:w-[700px]"
  >
    <n-spin :show="loading">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="top"
      >
        <n-form-item label="Mã chức năng" path="code">
          <NaiveInput
            v-model:value="formValue.code"
            placeholder="Nhập mã menu"
          />
        </n-form-item>

        <n-form-item label="Tên chức năng" path="name">
          <NaiveInput
            v-model:value="formValue.name"
            placeholder="Nhập tên hiển thị"
          />
        </n-form-item>

        <n-form-item label="Mô tả">
          <NaiveInput
            v-model:value="formValue.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="Mô tả ngắn về nhóm chức năng"
          />
        </n-form-item>

        <n-form-item label="Thứ tự" path="order">
          <NaiveInputNumber
            v-model:value="formValue.order"
            :min="1"
            class="w-full"
          />
        </n-form-item>

        <n-form-item label="Icon">
          <NaiveInput
            v-model:value="formValue.icon"
            placeholder="Tên icon (ví dụ: fa-users)"
          />
        </n-form-item>

        <n-form-item label="Trạng thái">
          <div style="display: flex; align-items: center; gap: 8px">
            <n-switch v-model:value="formValue.status" :disabled="loading" />
            <span>Hoạt động</span>
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
        :disabled="loading"
      />
    </div>
  </NaiveModal>
</template>

<style scoped>
:deep(.n-collapse-item__header-main) {
  justify-content: space-between;
  font-size: 18px;
}
</style>
