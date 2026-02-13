<template>
  <div />
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAuthStore } from "@/stores/auth";

onLaunch(() => {
  console.log("App Launch");

  // 初始化应用
  initializeApp();
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});

/**
 * 应用初始化
 */
function initializeApp() {
  // 1. 恢复认证信息
  const authStore = useAuthStore();
  authStore.initializeAuth();

  // 2. 请求必要的权限
  requestPermissions();

  // 3. 初始化其他配置
  // ...
}

/**
 * 请求应用权限
 */
function requestPermissions() {
  // 请求存储权限
  if (uni.getSystemInfoSync().platform === "android") {
    // Android 权限请求逻辑
  }
}
</script>

<style></style>
