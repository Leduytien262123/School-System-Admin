<template>
  <CommonPage>
    <n-card title="Quản lý quyền hạn">
      <n-space vertical>
        <!-- <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm quyền hạn" class="w-full">
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
          <ButtonSearch ref="buttonSearchRef" :searchData="loadSchools" />
        </div> -->

        <n-data-table
          :columns="columns"
          :data="schools"
          :bordered="true"
          :striped="true"
          :loading="loading"
          :scroll-x="1000"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'quyền hạn'"
          :pageSize="10"
          @change="loadSchools"
        />
      </n-space>
    </n-card>

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />
  </CommonPage>
</template>

<script setup>
import { NTag } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";

defineOptions({ name: "Schools" });

const schools = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết quyền hạn");
const detailModalRef = ref(null);
const buttonSearchRef = ref(null);
const total = ref(0);
const showModalAddEdit = ref(false);
const editId = ref(null);

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
    title: "Tên",
    key: "name",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Mã quyền hạn",
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
];

// Tải danh sách quyền hạn
async function loadSchools() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getAllRoles(params);
    schools.value = response.data?.data || [];
    total.value = response.data?.data?.length || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách quyền hạn");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết quyền hạn
async function viewCategory(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getCategoryById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết quyền hạn");
  }
}

// Xóa quyền hạn
function deleteCategory(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa quyền hạn này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteSchool({
          id,
        });
        $message.success("Đã xóa quyền hạn thành công");
        loadSchools();
      } catch (error) {
        console.error("Lỗi khi xóa quyền hạn:", error);
        $message.error("Không thể xóa quyền hạn");
      }
    },
  });
}

// Thêm quyền hạn mới
function handleAddEditSchool(id) {
  if (id) {
    editId.value = id || null;
  }
  showModalAddEdit.value = true;
}

watch(
  () => showModalAddEdit.value,
  (val) => {
    if (!val) {
      editId.value = null;
    }
  }
);

onMounted(() => {
  loadSchools();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
