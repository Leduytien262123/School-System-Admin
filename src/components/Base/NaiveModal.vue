<template>
  <n-modal
    v-model:show="localShow"
    :closable="true"
    @update:show="onUpdateShow"
  >
    <n-card>
      <div class="rounded-xl">
        <div class="flex items-center justify-between">
          <h1 class="text-[18px] text-primary font-semibold">{{ title }}</h1>
        </div>
        <div class="mt-16">
          <slot />
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: { type: String, default: "" },
});

const emit = defineEmits(["update:show"]);

const localShow = ref(props.show);
const title = computed(() => props.title);

watch(
  () => props.show,
  (val) => {
    localShow.value = val;
  }
);

function onUpdateShow(val) {
  emit("update:show", val);
  localShow.value = val;
}
</script>
