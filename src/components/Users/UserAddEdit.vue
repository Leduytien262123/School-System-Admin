<script setup>
defineOptions({ name: "UserAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const context = computed(() => {
  if (route.path.includes("staff")) return "nhân sự";
  if (route.path.includes("user")) return "người dùng";
});
const isEdit = computed(() => !!props.id);
const loading = ref(false);
const fileList = ref([]);
const listRoles = ref([]);
const listAuthorities = ref([]);
const listSchools = ref([]);

const emit = defineEmits(["update:avatar"]);

const formValue = ref({
  username: "",
  password: "1234556aA@",
  fullname: "",
  code: "",
  email: "",
  phoneNumber: "",
  address: "",
  roleId: null,
  eduAuthorityId: null,
  schoolId: null,
  status: true,
  creator_id: userStore.userId,
  creator_name: userStore.username,
});

const rules = {
  creator_name: [
    {
      required: true,
      message: "Không xác định người tạo",
      trigger: ["blur", "input"],
    },
  ],
  username: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const username = String(value || "").trim();
        if (!username) return new Error("Vui lòng nhập tên đăng nhập");
        if (username.length < 6)
          return new Error("Tên đăng nhập phải có ít nhất 6 ký tự");
        if (username.length > 50)
          return new Error("Tên đăng nhập không được quá 50 ký tự");
        if (!/^[a-zA-Z0-9_]+$/.test(username))
          return new Error("Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới");
        return true;
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (isEdit.value) return true; // Không bắt buộc khi edit
        const password = String(value || "").trim();
        if (!password) return new Error("Vui lòng nhập mật khẩu");
        if (password.length < 8)
          return new Error("Mật khẩu phải có ít nhất 8 ký tự");
        if (!/(?=.*[a-z])/.test(password))
          return new Error("Mật khẩu phải có ít nhất 1 chữ thường");
        if (!/(?=.*[A-Z])/.test(password))
          return new Error("Mật khẩu phải có ít nhất 1 chữ hoa");
        if (!/(?=.*\d)/.test(password))
          return new Error("Mật khẩu phải có ít nhất 1 số");
        if (!/(?=.*[@$!%*?&#])/.test(password))
          return new Error(
            "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@$!%*?&#)"
          );
        return true;
      },
    },
  ],
  code: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const code = String(value || "").trim();
        if (!code) return new Error("Vui lòng nhập mã");
        if (code.length < 4) return new Error("Mã phải có ít nhất 4 ký tự");
        if (code.length > 20) return new Error("Mã không được quá 20 ký tự");
        return true;
      },
    },
  ],
  fullname: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const name = String(value || "").trim();
        if (!name) return new Error(`Vui lòng nhập tên ${context.value}`);
        if (name.length < 10)
          return new Error(`Tên ${context.value} phải có ít nhất 10 ký tự`);
        if (name.length > 100)
          return new Error(`Tên ${context.value} không được quá 100 ký tự`);
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
  phoneNumber: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const phone = String(value || "").trim();

        if (!phone) {
          return new Error("Vui lòng nhập số điện thoại");
        }

        const validPrefixes = [
          "032",
          "033",
          "034",
          "035",
          "036",
          "037",
          "038",
          "039",
          "070",
          "076",
          "077",
          "078",
          "079",
          "081",
          "082",
          "083",
          "084",
          "085",
          "086",
          "056",
          "058",
          "059",
          "090",
          "093",
          "089",
          "092",
          "094",
          "099",
          "098",
          "097",
          "096",
          "091",
          "095",
        ];

        if (!/^0\d{9}$/.test(phone)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (phải gồm 10 số và bắt đầu bằng 0)"
          );
        }

        const prefix = phone.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (đầu số không hợp lệ)"
          );
        }

        return true;
      },
    },
  ],
  email: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const email = String(value || "").trim();

        if (!email) {
          return new Error("Vui lòng nhập email");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          return new Error("Email không đúng định dạng");
        }

        return true;
      },
    },
  ],
  address: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const address = String(value || "").trim();
        if (!address) {
          return new Error("Vui lòng nhập địa chỉ");
        }
        if (address.length < 10) {
          return new Error("Địa chỉ phải có ít nhất 10 ký tự");
        }
        if (address.length > 255) {
          return new Error("Địa chỉ không được quá 255 ký tự");
        }
        return true;
      },
    },
  ],
  roleId: [
    {
      required: true,
      message: "Vui lòng chọn vai trò",
      trigger: ["blur", "change"],
    },
  ],
  schoolId: [
    {
      trigger: ["blur", "change"],
      validator(_, value) {
        // Chỉ bắt buộc khi role là SCHOOL_ADMIN
        const selectedRole = listRoles.value.find(
          (r) => r.value === formValue.value.roleId
        );
        if (selectedRole?.code === "SCHOOL_ADMIN" && !value) {
          return new Error("Trường học không được để trống");
        }
        return true;
      },
    },
  ],
  eduAuthorityId: [
    {
      trigger: ["blur", "change"],
      validator(_, value) {
        // Chỉ bắt buộc khi role là DEPARTMENT_ADMIN
        const selectedRole = listRoles.value.find(
          (r) => r.value === formValue.value.roleId
        );
        if (selectedRole?.code === "DEPARTMENT_ADMIN" && !value) {
          return new Error("Sở giáo dục không được để trống");
        }
        return true;
      },
    },
  ],
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

watch(
  () => formValue.value.name,
  (newName) => {
    if (newName) {
      formValue.value.slug = generateSlug(newName);
    }
  }
);

const formRef = ref(null);

const getListRoles = async () => {
  const resData = await api.getAllRoles();
  listRoles.value = resData.data?.data?.map((role) => ({
    label: role.name,
    value: role.id,
    code: role.code,
  }));
};

const getListAuthorities = async () => {
  const resData = await api.getAuthorities();
  listAuthorities.value = resData.data?.data?.map((authority) => ({
    label: authority.name,
    value: authority.id,
  }));
};

const getListSchools = async () => {
  const resData = await api.getSchools();
  listSchools.value = resData.data?.data?.map((school) => ({
    label: school.name,
    value: school.id,
  }));
};

async function loadUser() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getUserById({ id: props.id });
    if (response.data.success) {
      const d = response.data.data;

      // Map API fields into reactive formValue (keep reference)
      Object.assign(formValue.value, {
        id: d.id ?? null,
        username: d.username ?? "",
        fullname: d.fullname ?? "",
        code: d.code ?? "",
        email: d.email ?? "",
        phoneNumber: d.phone_number ?? d.phone ?? "",
        address: d.address ?? "",
        status: !!d.status,
        creator_id: d.creator_id ?? formValue.value.creator_id,
        creator_name: d.creator_name ?? formValue.value.creator_name,
      });

      // Map role code -> roleId (requires listRoles already loaded)
      const roleCode = d.role ?? d.role_code ?? null;
      if (roleCode) {
        const roleItem = listRoles.value.find(
          (r) => r.code === roleCode || r.value === roleCode
        );
        formValue.value.roleId = roleItem ? roleItem.value : null;
      } else {
        formValue.value.roleId = null;
      }

      // Map optional ids if present
      formValue.value.eduAuthorityId =
        d.edu_authority_id ?? d.eduAuthorityId ?? d.authority_id ?? null;
      formValue.value.schoolId = d.school_id ?? d.schoolId ?? null;

      // Map avatar (handle string or array)
      if (d?.avatar) {
        if (Array.isArray(d.avatar) && d.avatar.length > 0) {
          fileList.value = d.avatar.map((img, idx) => ({
            url: img.url || img || "",
            alt: img.alt || "",
            uid: `init-${idx}`,
            name: img.alt || "avatar",
            status: "finished",
          }));
        } else if (typeof d.avatar === "string" && d.avatar) {
          fileList.value = [
            {
              url: d.avatar,
              alt: "",
              uid: `init-0`,
              name: "avatar",
              status: "finished",
            },
          ];
        } else {
          fileList.value = [];
        }
      } else {
        fileList.value = [];
      }
    }
  } catch (error) {
    $message.error(`Không thể tải thông tin ${context.value}`);
    console.error("Load order error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!isEdit.value) {
    formValue.value.creator_id = userStore.userId;
    formValue.value.creator_name = userStore.username;
  }

  // Load reference data first so loadUser can map role code -> roleId
  await getListRoles();
  await getListSchools();
  await getListAuthorities();

  if (isEdit.value) {
    await loadUser();
  }
});

function handleBack() {
  if (route.path.includes("staff")) {
    return router.push("/staff");
  } else return router.push("/user");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    const body = {
      ...formValue.value,
      creator_id: userStore?.userId,
      avatar:
        fileList.value && fileList.value.length
          ? fileList.value[0].url || ""
          : "",
    };

    if (isEdit.value) {
      await api.updateUser(props.id, body);
      $message.success(`Cập nhật ${context.value} thành công!`);
    } else {
      await api.createUser(body);
      $message.success(`Thêm ${context.value} thành công!`);
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? `Cập nhật ${context.value} thất bại`
      : `Thêm ${context.value} thất bại`;
    $message.error(errorMessage);
    console.error("Save order error:", error);
  } finally {
    loading.value = false;
  }
}

function handleInput() {
  if (formValue.value.fullname) {
    formValue.value.fullname = formValue.value.fullname
      .trim()
      .replace(/\s+/g, " ");
  }
}

function handleUploadSuccess(file) {
  const imageObj = {
    url: file.url || "",
    alt: file.alt || file.name || "",
    uid: file.uid,
    name: file.name || file.alt || "",
    status: "finished",
  };
  emit("update:avatar", [imageObj]);
  fileList.value = [imageObj];
}

// Xử lý khi xóa file
function handleRemove() {
  emit("update:avatar", []);
  fileList.value = [];
  formValue.value.avatar = null;
}

function handleUpdateFileList(newFileList) {
  fileList.value = newFileList;
  if (newFileList.length === 0) {
    emit("update:avatar", []);
  } else {
    emit("update:avatar", newFileList);
  }
}
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? `Sửa ${context}` : `Thêm ${context}`">
      <n-form :model="formValue" :rules="rules" ref="formRef">
        <n-grid responsive="screen" cols="1 m:2 l:3 xl:4" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item label="Tên đăng nhập" path="username">
              <NaiveInput
                v-model:value="formValue.username"
                placeholder="Nhập tên đăng nhập"
                :disabled="isEdit"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1" v-if="!isEdit">
            <n-form-item label="Mật khẩu" path="password">
              <NaiveInput
                v-model:value="formValue.password"
                type="password"
                show-password-on="click"
                placeholder="Nhập mật khẩu"
                :clearable="false"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Mã" path="code">
              <NaiveInput
                v-model:value="formValue.code"
                placeholder="Nhập mã"
                :sku="formValue.code"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item :label="`Tên ${context}`" path="fullname">
              <NaiveInput
                v-model:value="formValue.fullname"
                @blur="handleInput"
                :placeholder="`Nhập tên ${context}`"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Chọn vai trò" path="roleId">
              <NaiveSelect
                v-model:value="formValue.roleId"
                placeholder="Chọn vai trò"
                :options="listRoles"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item
            span="1"
            v-if="
              formValue.roleId &&
              listRoles.find((r) => r.value === formValue.roleId)?.code ===
                'DEPARTMENT_ADMIN'
            "
          >
            <n-form-item label="Chọn sở giáo dục" path="eduAuthorityId">
              <NaiveSelect
                v-model:value="formValue.eduAuthorityId"
                placeholder="Chọn sở giáo dục"
                :options="listAuthorities"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item
            span="1"
            v-if="
              formValue.roleId &&
              listRoles.find((r) => r.value === formValue.roleId)?.code ===
                'SCHOOL_ADMIN'
            "
          >
            <n-form-item label="Chọn trường học" path="schoolId">
              <NaiveSelect
                v-model:value="formValue.schoolId"
                placeholder="Chọn trường học"
                :options="listSchools"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Email" path="email">
              <NaiveInput
                v-model:value="formValue.email"
                placeholder="Nhập email"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số điện thoại" path="phoneNumber">
              <NaiveInput
                v-model:value="formValue.phoneNumber"
                @input="
                  formValue.phoneNumber = $event
                    .replace(/[^\d]/g, '')
                    .slice(0, 10)
                "
                :input-props="{
                  inputmode: 'numeric',
                  pattern: '[0-9]*',
                  maxlength: 10,
                }"
                placeholder="Nhập số điện thoại"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item
            :span="
              formValue.roleId &&
              listRoles.find((r) => r.value === formValue.roleId)?.code ===
                'SUPER_ADMIN'
                ? '2'
                : '3'
            "
          >
            <n-form-item label="Địa chỉ" path="address">
              <NaiveInput
                v-model:value="formValue.address"
                placeholder="Nhập địa chỉ"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Trạng thái">
              <n-switch v-model:value="formValue.status">
                <template #checked> Hoạt động </template>
                <template #unchecked> Ngưng hoạt động </template>
              </n-switch>
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Chọn ảnh đại diện" path="avatar">
              <NaiveUpload
                :file-list="fileList"
                @update:file-list="handleUpdateFileList"
                @upload-success="handleUploadSuccess"
                @remove="handleRemove"
                :max="1"
                list-type="image-card"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <template #action>
        <ButtonSave
          :isEdit="isEdit"
          :handleBack="handleBack"
          :handleSave="handleSave"
          :loading="loading"
          :disabled="loading"
        />
      </template>
    </n-card>
  </CommonPage>
</template>
