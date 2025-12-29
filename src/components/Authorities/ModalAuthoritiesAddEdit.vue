<script setup>
defineOptions({ name: "AuthoritiesAddEdit" });

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
const listProvinces = ref([]);

const formValue = ref({
  name: "",
  code: "",
  email: "",
  phone: "",
  provinceCode: null,
  address: "",
  status: true,
});

const rules = {
  name: [
    {
      required: true,
      message: "Tên sở giáo dục không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  code: [
    {
      required: true,
      message: "Mã sở không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  email: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) return new Error("Email không được để trống");
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailRegex.test(value)) {
          return new Error("Email không hợp lệ");
        }
        return true;
      },
    },
  ],
  phone: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) return new Error("Số điện thoại không được để trống");
        if (/\D/.test(value)) {
          return new Error("Số điện thoại chỉ được chứa số");
        }
        if (value.length !== 10) {
          return new Error("Số điện thoại phải đủ 10 số");
        }
        if (!/^(02|03|06|08|09)/.test(value)) {
          return new Error(
            "Số điện thoại phải bắt đầu bằng 02, 03, 06, 08, 09"
          );
        }
        return true;
      },
    },
  ],
  provinceCode: [
    {
      required: true,
      trigger: ["blur", "change"],
      validator(_, value) {
        if (!value) return new Error("Tỉnh/Thành phố không được để trống");
        return true;
      },
    },
  ],
};

async function loadProvinces() {
  try {
    loading.value = true;
    const response = await api.getProvinces();
    if (response.data.success) {
      const data = response.data.data;
      listProvinces.value = data.map((item) => ({
        label: item.provinceName,
        value: item.code,
      }));
    }
  } catch (error) {
    $message.error("Không thể tải thông tin tỉnh/thành phố");
  } finally {
    loading.value = false;
  }
}

async function loadAuthorities() {
  if (!isEdit.value) return;

  try {
    loading.value = true;
    const response = await api.getAuthoritiesById({
      id: props.id,
    });
    if (response.data.success) {
      const data = response.data.data;
      formValue.value = {
        name: data.name || "",
        code: data.code || "",
        email: data.email || "",
        phone: data.phone || "",
        provinceCode: data.provinceCode || null,
        address: data.address || "",
        status: data.status,
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin sở giáo dục");
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

    loading.value = true;

    if (isEdit.value) {
      formValue.value.id = props.id;
      await api.updateAuthorities(formValue.value);
      $message.success("Cập nhật sở giáo dục thành công!");
    } else {
      await api.createAuthorities(formValue.value);
      $message.success("Thêm sở giáo dục thành công!");
    }
    handleBack();
    emit("reload");
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật sở giáo dục thất bại"
      : "Thêm sở giáo dục thất bại";
    $message.error(errorMessage);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.show,
  async (val) => {
    if (val && isEdit.value) {
      await loadAuthorities();
    } else {
      formValue.value = {
        name: "",
        code: "",
        email: "",
        phone: "",
        provinceCode: null,
        address: "",
        status: true,
      };
    }
    if (val) {
      await loadProvinces();
    }
  }
);
</script>

<template>
  <NaiveModal
    :show="show"
    :title="isEdit ? 'Sửa sở giáo dục' : 'Thêm sở giáo dục'"
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
        <n-form-item label="Tên sở giáo dục" path="name">
          <NaiveInput
            v-model:value="formValue.name"
            placeholder="Nhập tên sở giáo dục"
          />
        </n-form-item>

        <n-form-item label="Mã sở" path="code">
          <NaiveInput
            v-model:value="formValue.code"
            placeholder="Nhập mã sở"
            :sku="formValue.code"
          />
        </n-form-item>

        <n-form-item label="Email" path="email">
          <NaiveInput
            v-model:value="formValue.email"
            placeholder="Nhập email"
          />
        </n-form-item>

        <n-form-item label="Số điện thoại" path="phone">
          <NaiveInput
            v-model:value="formValue.phone"
            placeholder="Nhập số điện thoại"
            :show-button="false"
            @update:value="
              (val) => {
                let phone = String(val).replace(/\D/g, '').slice(0, 10);
                if (!/^(09|08|06|03|02)\d{0,8}$/.test(phone)) return;
                formValue.phone = phone;
              }
            "
          />
        </n-form-item>

        <n-form-item label="Tỉnh/Thành phố" path="provinceCode">
          <NaiveSelect
            v-model:value="formValue.provinceCode"
            :options="listProvinces"
            placeholder="Chọn tỉnh/thành phố"
            :filterable="true"
            :loading="loading"
          />
        </n-form-item>

        <n-form-item label="Nhập địa chỉ">
          <NaiveInput
            v-model:value="formValue.address"
            type="textarea"
            placeholder="Nhập địa chỉ sở giáo dục"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </n-form-item>

        <n-form-item label="Trạng thái">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
              "
            >
              <n-switch v-model:value="formValue.status" :disabled="loading" />
              <span>Hoạt động</span>
            </div>
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
