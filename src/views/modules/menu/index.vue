<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListMenus"
        :handleAdd="handleAddMenu"
        :titleAdd="'Thêm menu'"
      />
    </template>

    <n-card title="Quản lý menu">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Nhóm menu" class="w-1/3">
            <NaiveSelect
              v-model:value="searchQuery.groupId"
              :options="menuGroupOptions"
              placeholder="Chọn nhóm menu"
              clearable
            />
          </n-form-item>
          <n-form-item label="Tìm kiếm menu" class="w-full">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="searchData"
            />
          </n-form-item>
          <ButtonSearch ref="buttonSearchRef" :searchData="loadMenus" />
        </div>

        <n-data-table
          :columns="columns"
          :data="menus"
          :bordered="true"
          :striped="true"
          :loading="loading"
          default-expand-all
          :row-key="(row) => row.id"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'menu'"
          :pageSize="10"
          @change="loadMenus"
        />
      </n-space>
    </n-card>

    <ModalMenuAddEdit
      v-model:show="showModalAddEdit"
      @reload="loadMenus"
      :id="editId"
    />
  </CommonPage>
</template>

<script setup>
import { NTag } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";

defineOptions({ name: "MenuManagement" });

const menus = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
  groupId: null,
});
const total = ref(0);
const buttonSearchRef = ref(null);
const showModalAddEdit = ref(false);
const editId = ref(null);
const menuGroupOptions = ref([]);

const columns = [
  {
    title: "STT",
    key: "stt",
    ellipsis: true,
    width: 70,
    fixed: "left",
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: "Mã menu",
    key: "code",
    fixed: "left",
    ellipsis: true,
    width: 180,
  },
  {
    title: "Tên menu",
    key: "name",
    ellipsis: true,
    width: 200,
  },
  {
    title: "Đường dẫn",
    key: "path",
    ellipsis: true,
    width: 200,
  },
  {
    title: "Loại",
    key: "type",
    width: 100,
    render(row) {
      const typeMap = {
        ITEM: { text: "Menu", type: "info" },
        GROUP: { text: "Nhóm", type: "default" },
      };
      const config = typeMap[row.type] || { text: row.type, type: "default" };
      return h(
        NTag,
        { type: config.type, size: "small" },
        { default: () => config.text }
      );
    },
  },
  {
    title: "Module",
    key: "module_code",
    ellipsis: true,
    width: 150,
  },
  {
    title: "Permission",
    key: "required_permission",
    ellipsis: true,
    width: 150,
    render(row) {
      if (row.required_resource && row.required_action) {
        return `${row.required_resource}:${row.required_action}`;
      }
      return "-";
    },
  },
  {
    title: "Thứ tự",
    key: "order",
    width: 80,
  },
  {
    title: "Trạng thái",
    key: "status",
    width: 120,
    render(row) {
      return h(
        NTag,
        { type: row.status ? "success" : "", size: "small" },
        { default: () => (row.status ? "Hoạt động" : "Dừng hoạt động") }
      );
    },
  },
  {
    title: "Hành động",
    key: "actions",
    width: 100,
    fixed: "right",
    render(row) {
      return h(
        "div",
        { class: "flex items-center gap-4" },
        [
          renderButtonWithTooltip({
            onClick: () => editMenu(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteMenu(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xoá",
          }),
        ].filter(Boolean)
      );
    },
  },
];

async function loadMenus() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    if (searchQuery.value?.groupId) {
      params.group_id = searchQuery.value?.groupId;
    }
    const response = await api.getMenus(params);
    if (response.data.success) {
      menus.value = response.data?.data?.menus || [];
      total.value = response.data?.data?.total || 0;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách menu");
  } finally {
    loading.value = false;
  }
}

async function loadMenuGroups() {
  try {
    const response = await api.getMenuGroups({ page: 1, length: 100 });
    if (response.data.success) {
      menuGroupOptions.value = (response.data?.data?.list || []).map(
        (item) => ({
          label: item.name,
          value: item.id,
        })
      );
    }
  } catch (error) {
    console.error("Không thể tải danh sách nhóm menu");
  }
}

// Xóa menu
function deleteMenu(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa menu này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteMenu(id);
        $message.success("Đã xóa menu thành công");
        loadMenus();
      } catch (error) {
        console.error("Lỗi khi xóa menu:", error);
        $message.error("Không thể xóa menu");
      }
    },
  });
}

function resetListMenus() {
  searchQuery.value.search = "";
  searchQuery.value.groupId = null;
  buttonSearchRef.value?.search?.();
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

function handleAddMenu() {
  editId.value = null;
  showModalAddEdit.value = true;
}

// Sửa menu
function editMenu(id) {
  editId.value = id;
  showModalAddEdit.value = true;
}

onMounted(() => {
  loadMenuGroups();
  loadMenus();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
