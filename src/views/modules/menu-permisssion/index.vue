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
          :data="products"
          :bordered="true"
          :striped="true"
          :loading="loading"
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

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />

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

defineOptions({ name: "ProductManagement" });

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết menu");
const detailModalRef = ref(null);
const categories = ref([]);
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
    title: "Tên",
    key: "name",
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "Danh mục",
    key: "category_id",
    ellipsis: true,
    render(row) {
      const category = categories.value.find(
        (cat) => cat.value === row.category_id
      );
      return category ? category.label : "";
    },
  },
  {
    title: "Trạng thái",
    key: "is_active",
    render(row) {
      return h(
        NTag,
        { type: row.is_active ? "success" : "", size: "small" },
        { default: () => (row.is_active ? "Hoạt động" : "Dừng hoạt động") }
      );
    },
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    render(row) {
      return dayjs(row.created_at).format("DD/MM/YYYY");
    },
  },
  {
    title: "Hành động",
    key: "actions",
    width: 100,
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
    const response = await api.getMenusGroup(params);
    if (response.data.success) {
      products.value = response.data?.data?.products || [];
      total.value = response.data?.data?.total || 0;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách menu");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết menu
async function viewMenu(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getMenuById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết menu");
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
