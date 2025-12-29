<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListAuthorities"
        :handleAdd="() => handleAddEditAuthorities()"
        :titleAdd="'Thêm sở giáo dục'"
      />
    </template>

    <n-card title="Quản lý sở giáo dục">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm sở giáo dục" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery"
              @keyup.enter="searchData"
              @clear="
                () => {
                  searchQuery = '';
                  searchData();
                }
              "
            />
          </n-form-item>
          <ButtonSearch ref="buttonSearchRef" :searchData="loadAuthorities" />
        </div>

        <n-data-table
          :columns="columns"
          :data="categories"
          :bordered="true"
          :striped="true"
          :loading="loading"
          :scroll-x="1000"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'sở giáo dục'"
          :pageSize="10"
          @change="loadAuthorities"
        />
      </n-space>
    </n-card>

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />

    <ModalAuthoritiesAddEdit
      v-model:show="showModalAddEdit"
      @reload="loadAuthorities"
      :id="editId"
    />
  </CommonPage>
</template>

<script setup>
import { NTag } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";

defineOptions({ name: "Authorities" });

const categories = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết sở giáo dục");
const detailModalRef = ref(null);
const buttonSearchRef = ref(null);
const showModalAddEdit = ref(false);
const editId = ref(null);
const total = ref(0);

const columns = [
  {
    title: "STT",
    key: "stt",
    fixed: "left",
    width: 70,
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: "Tên sở giáo dục",
    key: "name",
    width: 350,
    ellipsis: true,
  },
  {
    title: "Mã sở",
    key: "code",
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    key: "status",
    render(row) {
      return h(
        NTag,
        { type: row.status ? "success" : "", size: "small" },
        { default: () => (row.status ? "Hoạt động" : "Dừng hoạt động") }
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
            onClick: () => handleAddEditAuthorities(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteCategory(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xoá",
          }),
        ].filter(Boolean)
      );
    },
  },
];

// Tải danh sách sở giáo dục
async function loadAuthorities() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getAuthorities(params);
    categories.value = response.data?.data || [];
    total.value = response.data?.pagination?.total || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách sở giáo dục");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết sở giáo dục
async function viewCategory(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getCategoryById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết sở giáo dục");
  }
}

// Xóa sở giáo dục
function deleteCategory(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa sở giáo dục này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteAuthorities({
          id: id,
        });
        $message.success("Đã xóa sở giáo dục thành công");
        loadAuthorities();
      } catch (error) {
        console.error("Lỗi khi xóa sở giáo dục:", error);
        $message.error("Không thể xóa sở giáo dục");
      }
    },
  });
}

const handleAddEditAuthorities = (id = null) => {
  editId.value = id || null;
  showModalAddEdit.value = true;
};

function resetListAuthorities() {
  searchQuery.value = "";
  buttonSearchRef.value?.search?.();
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

onMounted(() => {
  loadAuthorities();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
