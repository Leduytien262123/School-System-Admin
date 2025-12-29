<template>
  <CommonPage>
    <n-card title="Quản lý menu theo gói subscription">
      <n-tabs type="line" v-model:value="activePackage" @update:value="handlePackageChange">
        <n-tab-pane name="BASIC" tab="BASIC Package">
          <PackageMenuList package="BASIC" :key="'BASIC-' + refreshKey" />
        </n-tab-pane>
        <n-tab-pane name="PLUS" tab="PLUS Package">
          <PackageMenuList package="PLUS" :key="'PLUS-' + refreshKey" />
        </n-tab-pane>
        <n-tab-pane name="PREMIUM" tab="PREMIUM Package">
          <PackageMenuList package="PREMIUM" :key="'PREMIUM-' + refreshKey" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </CommonPage>
</template>

<script setup>
import PackageMenuList from "./PackageMenuList.vue";

defineOptions({ name: "PackageMenuManagement" });

const activePackage = ref("BASIC");
const refreshKey = ref(0);

function handlePackageChange() {
  refreshKey.value++;
}
</script>
