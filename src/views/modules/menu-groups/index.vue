<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetList"
        :handleAdd="handleAdd"
        :titleAdd="'Thêm nhóm menu'"
      />
    </template>

    <n-card title="Quản lý nhóm menu">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm" class="w-full">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="searchData"
            />
          </n-form-item>
          <ButtonSearch ref="buttonSearchRef" :searchData="loadData" />
        </div>

        <n-data-table
          :columns="columns"
          :data="dataList"
          :bordered="true"
          :striped="true"
          :loading="loading"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'menu-groups'"
          :pageSize="10"
          @change="loadData"
        />
      </n-space>
    </n-card>

    <ModalMenuGroupAddEdit
      v-model:show="showModalAddEdit"
      @reload="loadData"
      :id="editId"
    />
  </CommonPage>
</template>

<script setup>
import { NTag } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";
import ModalMenuGroupAddEdit from "../../../components/Modules/MenuGroup/ModalMenuGroupAddEdit.vue";

defineOptions({ name: "MenuGroupManagement" });

const dataList = ref([]);
const loading = ref(false);
const searchQuery = ref({ search: "" });
const total = ref(0);
const buttonSearchRef = ref(null);
const showModalAddEdit = ref(false);
const editId = ref(null);

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
    title: "Mã nhóm",
    key: "code",
    fixed: "left",
    ellipsis: true,
    width: 150,
  },
  {
    title: "Tên nhóm",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Mô tả",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Icon",
    key: "icon",
    width: 80,
    render(row) {
      return h("i", { class: row.icon });
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
      return h("div", { class: "flex items-center gap-4" }, [
        renderButtonWithTooltip({
          onClick: () => editItem(row.id),
          content: h(IconPencil),
          tooltipContent: "Chỉnh sửa",
        }),
        renderButtonWithTooltip({
          onClick: () => deleteItem(row.id),
          content: h(IconBin),
          tooltipContent: "Xoá",
        }),
      ]);
    },
  },
];

async function loadData() {
  try {
    loading.value = true;
    const params = { page: 1, length: 10 };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    const response = await api.getMenuGroups(params);
    if (response.data.success) {
      dataList.value = response.data?.data?.list || [];
      total.value = response.data?.data?.total || 0;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách nhóm menu");
  } finally {
    loading.value = false;
  }
}

function deleteItem(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa nhóm menu này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteMenuGroup(id);
        $message.success("Đã xóa nhóm menu thành công");
        loadData();
      } catch (error) {
        $message.error("Không thể xóa nhóm menu");
      }
    },
  });
}

function resetList() {
  searchQuery.value.search = "";
  buttonSearchRef.value?.search?.();
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

function handleAdd() {
  editId.value = null;
  showModalAddEdit.value = true;
}

function editItem(id) {
  editId.value = id;
  showModalAddEdit.value = true;
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
