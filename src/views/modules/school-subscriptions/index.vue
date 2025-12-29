<template>
  <CommonPage>
    <n-card title="Quản lý gói subscription của trường">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Chọn trường" class="w-full">
            <NaiveSelect
              v-model:value="selectedSchoolId"
              :options="schoolOptions"
              placeholder="Chọn trường"
              filterable
              @update:value="handleSchoolChange"
            />
          </n-form-item>
          <n-button
            type="primary"
            @click="handleAddSubscription"
            :disabled="!selectedSchoolId"
          >
            <template #icon>
              <i class="fa fa-plus" />
            </template>
            Tạo/Cập nhật gói
          </n-button>
        </div>

        <n-spin :show="loading">
          <n-alert v-if="!selectedSchoolId" type="info" class="mb-4">
            Vui lòng chọn trường để xem thông tin gói subscription
          </n-alert>

          <n-card
            v-if="subscription && selectedSchoolId"
            :title="`Gói ${subscription.package}`"
            class="mt-4"
          >
            <template #header-extra>
              <n-tag :type="subscription.is_active ? 'success' : 'error'">
                {{
                  subscription.is_active ? "Đang hoạt động" : "Không hoạt động"
                }}
              </n-tag>
            </template>

            <n-descriptions :column="2" bordered>
              <n-descriptions-item label="Gói subscription">
                <n-tag :type="packageTypeMap[subscription.package]">
                  {{ subscription.package }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Trạng thái">
                <n-tag :type="subscription.is_active ? 'success' : 'error'">
                  {{ subscription.is_active ? "Hoạt động" : "Dừng" }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Ngày bắt đầu">
                {{ formatDate(subscription.start_date) }}
              </n-descriptions-item>
              <n-descriptions-item label="Ngày kết thúc">
                {{
                  subscription.end_date
                    ? formatDate(subscription.end_date)
                    : "Vô thời hạn"
                }}
              </n-descriptions-item>
              <n-descriptions-item label="Giới hạn học sinh">
                {{ subscription.max_students || "Không giới hạn" }}
              </n-descriptions-item>
              <n-descriptions-item label="Giới hạn giáo viên">
                {{ subscription.max_teachers || "Không giới hạn" }}
              </n-descriptions-item>
              <n-descriptions-item label="Giới hạn lớp học">
                {{ subscription.max_classes || "Không giới hạn" }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>

          <n-empty
            v-if="!subscription && selectedSchoolId && !loading"
            description="Trường này chưa có gói subscription"
          />
        </n-spin>
      </n-space>
    </n-card>

    <ModalSubscriptionAddEdit
      v-model:show="showModal"
      :schoolId="selectedSchoolId"
      :subscription="subscription"
      @reload="loadSubscription"
    />
  </CommonPage>
</template>

<script setup>
import { format } from "date-fns";
import ModalSubscriptionAddEdit from "../../../components/Modules/MenuPermisssion/ModalSubscriptionAddEdit.vue";

defineOptions({ name: "SchoolSubscriptionManagement" });

const loading = ref(false);
const selectedSchoolId = ref(null);
const subscription = ref(null);
const schoolOptions = ref([]);
const showModal = ref(false);

const packageTypeMap = {
  BASIC: "default",
  PLUS: "info",
  PREMIUM: "success",
};

async function loadSchools() {
  try {
    const response = await api.getSchools({ page: 1, length: 1000 });
    if (response.data?.success) {
      schoolOptions.value = (response.data.data?.list || []).map((school) => ({
        label: school.name,
        value: school.id,
      }));
    }
  } catch (error) {
    $message.error("Không thể tải danh sách trường");
  }
}

async function loadSubscription() {
  if (!selectedSchoolId.value) return;

  try {
    loading.value = true;
    const response = await api.getSchoolSubscription(selectedSchoolId.value);
    if (response.data?.success) {
      subscription.value = response.data.data;
    }
  } catch (error) {
    if (error?.response?.status === 404) {
      subscription.value = null;
    } else {
      $message.error("Không thể tải thông tin gói subscription");
    }
  } finally {
    loading.value = false;
  }
}

function handleSchoolChange() {
  subscription.value = null;
  loadSubscription();
}

function handleAddSubscription() {
  showModal.value = true;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch {
    return dateString;
  }
}

onMounted(() => {
  loadSchools();
});
</script>
