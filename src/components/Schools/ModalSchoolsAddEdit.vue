<script setup>
defineOptions({ name: "SchoolsAddEdit" });

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
const listEduAuthorities = ref([]);
const listProvinces = ref([]);
const listWards = ref([]);

const formValue = ref({
  name: "",
  code: "",
  eduAuthorityId: null,
  email: "",
  phone: "",
  provinceCode: null,
  wardCode: null,
  address: "",
  status: true,
});

const rules = {
  name: [
    {
      required: true,
      message: "Tên trường học không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  code: [
    {
      required: true,
      message: "Mã trường không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  eduAuthorityId: [
    {
      required: true,
      trigger: ["blur", "change"],
      validator(_, value) {
        if (!value) return new Error("Sở giáo dục không được để trống");
        return true;
      },
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
  wardCode: [
    {
      required: true,
      trigger: ["blur", "change"],
      validator(_, value) {
        if (!value) return new Error("Xã/Phường không được để trống");
        return true;
      },
    },
  ],
};

async function loadAuthorities() {
  try {
    loading.value = true;
    const response = await api.getAuthorities();
    if (response.data.success) {
      const data = response.data.data;
      listEduAuthorities.value = data.map((item) => ({
        label: item.name,
        value: item.id,
        provinceCode: item.provinceCode,
      }));
    }
  } catch (error) {
    $message.error("Không thể tải thông tin cơ quan giáo dục");
  } finally {
    loading.value = false;
  }
}

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

async function loadWards(provinceCode) {
  try {
    loading.value = true;
    const response = await api.getWards({ provinceCode });
    if (response.data.success) {
      const data = response.data.data;
      listWards.value = data.map((item) => ({
        label: item.name,
        value: item.code,
      }));
    }
  } catch (error) {
    $message.error("Không thể tải thông tin xã/phường");
  } finally {
    loading.value = false;
  }
}

const loadValueWard = async (value) => {
  await loadWards(value);
};

async function loadSchoolDetail() {
  if (!isEdit.value) return;

  try {
    loading.value = true;
    const response = await api.getSchoolById({
      id: props.id,
    });
    if (response.data.success) {
      const data = response.data.data;
      formValue.value = {
        name: data.name || "",
        code: data.code || "",
        eduAuthorityId: data.eduAuthorityId || null,
        email: data.email || "",
        phone: data.phone || "",
        provinceCode: data.provinceCode || null,
        wardCode: data.wardCode || null,
        address: data.address || "",
        status: data.status,
      };

      if (data.provinceCode) {
        await loadWards(data.provinceCode);
      }
    }
  } catch (error) {
    $message.error("Không thể tải thông tin trường học");
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

    if (isEdit.value) {
      formValue.value.id = props.id;
      await api.updateSchool(formValue.value);
      $message.success("Cập nhật trường học thành công!");
    } else {
      await api.createSchool(formValue.value);
      $message.success("Thêm trường học thành công!");
    }
    handleBack();
    emit("reload");
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật trường học thất bại"
      : "Thêm trường học thất bại";
    $message.error(errorMessage);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await loadProvinces();
      await loadAuthorities();
      if (isEdit.value) {
        await loadSchoolDetail();
      }
    } else {
      formValue.value = {
        name: "",
        code: "",
        eduAuthorityId: null,
        email: "",
        phone: "",
        provinceCode: null,
        wardCode: null,
        address: "",
        status: true,
      };

      listWards.value = [];
      listProvinces.value = [];
      listEduAuthorities.value = [];
      formRef.value?.reset?.();
      formRef.value?.restoreValidation?.();
    }
  }
);
</script>

<template>
  <NaiveModal
    :show="show"
    :title="isEdit ? 'Sửa trường học' : 'Thêm trường học'"
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
        <n-form-item label="Tên trường học" path="name">
          <NaiveInput
            v-model:value="formValue.name"
            placeholder="Nhập tên trường học"
          />
        </n-form-item>

        <n-form-item label="Sở giáo dục" path="eduAuthorityId">
          <NaiveSelect
            v-model:value="formValue.eduAuthorityId"
            placeholder="Chọn sở giáo dục"
            :options="listEduAuthorities"
            :filterable="true"
            :loading="loading"
          />
        </n-form-item>

        <n-form-item label="Mã trường" path="code">
          <NaiveInput
            v-model:value="formValue.code"
            placeholder="Nhập mã trường"
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
            @update:value="loadValueWard(formValue.provinceCode)"
            :filterable="true"
            :loading="loading"
          />
        </n-form-item>

        <n-form-item label="Xã/Phường" path="wardCode">
          <NaiveSelect
            v-model:value="formValue.wardCode"
            :options="listWards"
            placeholder="Chọn xã/phường"
            :filterable="true"
            :loading="loading"
          />
        </n-form-item>

        <n-form-item label="Nhập địa chỉ">
          <NaiveInput
            v-model:value="formValue.address"
            type="textarea"
            placeholder="Nhập địa chỉ trường học"
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
