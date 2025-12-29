<template>
  <CommonPage>
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
          max-height="calc(100vh - 470px)"
          min-height="calc(100vh - 470px)"
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
  </CommonPage>
</template>

<script setup>
defineOptions({ name: "Provinces" });

const categories = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const buttonSearchRef = ref(null);
const total = ref(0);

const columns = [
  {
    title: "Mã tỉnh",
    key: "code",
    fixed: "left",
    width: 70,
  },
  {
    title: "Tên tỉnh/thành phố",
    key: "provinceName",
    width: 350,
    ellipsis: true,
  },
  {
    title: "Loại tỉnh/thành phố",
    key: "provinceType",
    width: 350,
    ellipsis: true,
  },
];

// Tải danh sách sở giáo dục
async function loadAuthorities() {
  try {
    loading.value = true;
    const params = {};
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getProvinces(params);
    categories.value = response.data?.data || [];
    total.value = response.data?.pagination?.total || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách tỉnh/thành phố");
  } finally {
    loading.value = false;
  }
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
