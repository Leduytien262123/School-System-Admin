<template>
  <NaiveModal
    :show="show"
    :title="isEdit ? 'Cập nhật gói subscription' : 'Tạo gói subscription'"
    @update:show="$emit('update:show', $event)"
    class="w-[90%] lg:w-[800px]"
  >
    <n-spin :show="loading">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="top"
      >
        <n-grid :cols="2" :x-gap="16">
          <n-form-item-gi label="Gói subscription" path="package">
            <NaiveSelect
              v-model:value="formValue.package"
              :options="[
                { label: 'BASIC', value: 'BASIC' },
                { label: 'PLUS', value: 'PLUS' },
                { label: 'PREMIUM', value: 'PREMIUM' },
              ]"
              placeholder="Chọn gói"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Trạng thái">
            <div style="display: flex; align-items: center; gap: 8px">
              <n-switch v-model:value="formValue.isActive" />
              <span>{{ formValue.isActive ? "Hoạt động" : "Dừng" }}</span>
            </div>
          </n-form-item-gi>

          <n-form-item-gi label="Ngày bắt đầu" path="startDate">
            <NaiveDatePicker
              v-model:value="formValue.startDate"
              type="datetime"
              placeholder="Chọn ngày bắt đầu"
              class="w-full"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Ngày kết thúc">
            <NaiveDatePicker
              v-model:value="formValue.endDate"
              type="datetime"
              placeholder="Để trống = Vô thời hạn"
              class="w-full"
              clearable
            />
          </n-form-item-gi>

          <n-form-item-gi label="Giới hạn học sinh">
            <NaiveInputNumber
              v-model:value="formValue.maxStudents"
              :min="0"
              placeholder="0 = Không giới hạn"
              class="w-full"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Giới hạn giáo viên">
            <NaiveInputNumber
              v-model:value="formValue.maxTeachers"
              :min="0"
              placeholder="0 = Không giới hạn"
              class="w-full"
            />
          </n-form-item-gi>

          <n-form-item-gi label="Giới hạn lớp học">
            <NaiveInputNumber
              v-model:value="formValue.maxClasses"
              :min="0"
              placeholder="0 = Không giới hạn"
              class="w-full"
            />
          </n-form-item-gi>
        </n-grid>

        <n-form-item label="Ghi chú">
          <NaiveInput
            v-model:value="formValue.notes"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="Ghi chú về gói subscription"
          />
        </n-form-item>
      </n-form>
    </n-spin>

    <div class="mt-20">
      <ButtonSave
        :isEdit="isEdit"
        :handleBack="handleBack"
        :handleSave="handleSave"
        :loading="loading"
      />
    </div>
  </NaiveModal>
</template>

<script setup>
defineOptions({ name: "ModalSubscriptionAddEdit" });

const props = defineProps({
  show: { type: Boolean, default: false },
  schoolId: { type: [String, Number], default: null },
  subscription: { type: Object, default: null },
});

const emit = defineEmits(["update:show", "reload"]);

const formRef = ref(null);
const loading = ref(false);
const isEdit = computed(() => !!props.subscription);

const formValue = ref({
  package: "BASIC",
  startDate: Date.now(),
  endDate: null,
  isActive: true,
  maxStudents: 0,
  maxTeachers: 0,
  maxClasses: 0,
  notes: "",
});

const rules = {
  package: [
    {
      required: true,
      message: "Gói subscription không được để trống",
      trigger: ["change"],
    },
  ],
  startDate: [
    {
      required: true,
      type: "number",
      message: "Ngày bắt đầu không được để trống",
      trigger: ["change"],
    },
  ],
};

function handleBack() {
  emit("update:show", false);
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    if (loading.value) return;
    loading.value = true;

    const payload = {
      school_id: props.schoolId,
      package: formValue.value.package,
      start_date: new Date(formValue.value.startDate).toISOString(),
      end_date: formValue.value.endDate
        ? new Date(formValue.value.endDate).toISOString()
        : null,
      is_active: formValue.value.isActive,
      max_students: formValue.value.maxStudents || null,
      max_teachers: formValue.value.maxTeachers || null,
      max_classes: formValue.value.maxClasses || null,
      notes: formValue.value.notes || null,
    };

    if (isEdit.value) {
      await api.updateSchoolSubscription(props.schoolId, payload);
      $message.success("Cập nhật gói subscription thành công!");
    } else {
      await api.createSchoolSubscription(payload);
      $message.success("Tạo gói subscription thành công!");
    }

    handleBack();
    emit("reload");
  } catch (error) {
    if (error?.errors) return;
    $message.error(isEdit.value ? "Cập nhật gói thất bại" : "Tạo gói thất bại");
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      if (isEdit.value && props.subscription) {
        formValue.value = {
          package: props.subscription.package || "BASIC",
          startDate: props.subscription.start_date
            ? new Date(props.subscription.start_date).getTime()
            : Date.now(),
          endDate: props.subscription.end_date
            ? new Date(props.subscription.end_date).getTime()
            : null,
          isActive: props.subscription.is_active ?? true,
          maxStudents: props.subscription.max_students || 0,
          maxTeachers: props.subscription.max_teachers || 0,
          maxClasses: props.subscription.max_classes || 0,
          notes: props.subscription.notes || "",
        };
      }
    } else {
      formValue.value = {
        package: "BASIC",
        startDate: Date.now(),
        endDate: null,
        isActive: true,
        maxStudents: 0,
        maxTeachers: 0,
        maxClasses: 0,
        notes: "",
      };
      formRef.value?.restoreValidation?.();
    }
  }
);
</script>
