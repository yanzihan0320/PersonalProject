# HTTP 层改造说明文档

## 概述

已将项目的 HTTP 请求层从 **Axios** 改造为 **uni.request** 包装层，实现全平台兼容性（iOS/Android/H5/小程序）。

## 关键改动

### 1. API 客户端改造

- **文件**: `src/api/client.ts`
- **变化**: 使用 `uni.request` 替代 Axios
- **优势**:
  - ✅ 全平台兼容（iOS/Android/H5/小程序）
  - ✅ 原生支持文件上传/下载
  - ✅ 更轻量化
  - ✅ 与 uni-app 生态无缝集成

### 2. 依赖更新

- **移除**: `axios` (^1.13.4)
- **保留**: 所有其他依赖
- **新增**: 无（uni.request 内置）

### 3. 类型声明更新

- **文件**: `src/env.d.ts`
- **内容**: 添加 uni 全局类型声明

### 4. 应用初始化

- **文件**: `src/main.ts`
- **更新**: 添加 Pinia 初始化
- **文件**: `src/App.vue`
- **更新**: 添加应用启动初始化逻辑

## 使用指南

### 基础请求

```typescript
import { httpClient } from "@/api";

// GET 请求
const user = await httpClient.get<User>("/api/user/profile");

// POST 请求
const result = await httpClient.post<LoginResponse>("/api/auth/login", {
  email: "user@example.com",
  password: "password123",
});

// PUT/DELETE/PATCH
await httpClient.put("/api/user/profile", { name: "New Name" });
await httpClient.delete("/api/user");
await httpClient.patch("/api/user/avatar", { avatar: "url" });
```

### 文件上传

```typescript
import { httpClient } from "@/api";

// 选择文件
uni.chooseImage({
  count: 1,
  success: async (res) => {
    const filePath = res.tempFilePaths[0];

    // 上传文件
    const result = await httpClient.upload<{ fileId: string }>(
      "/api/resume/upload",
      filePath,
      {
        name: "resume",
        formData: {
          studentId: userId,
        },
      },
    );

    console.log("上传成功:", result.fileId);
  },
});
```

### 文件下载

```typescript
import { httpClient } from "@/api";

const tempFilePath = await httpClient.download("/api/resume/download?id=123");
console.log("下载成功，临时路径:", tempFilePath);

// 保存到本地存储
uni.saveFile({
  tempFilePath,
  success: (res) => {
    console.log("保存成功:", res.savedFilePath);
  },
});
```

### 自定义配置

```typescript
import { httpClient } from "@/api";

// 自定义超时
const data = await httpClient.get("/api/long-running-task", {
  timeout: 60000, // 60秒超时
});

// 自定义请求头
const data = await httpClient.get("/api/data", {
  header: {
    "X-Custom-Header": "value",
  },
});
```

### 错误处理

```typescript
import { httpClient } from "@/api";

try {
  const data = await httpClient.get("/api/user");
} catch (error) {
  // 错误已由框架处理
  // 认证失败（401/403）会自动登出并重定向
  // 其他错误可在这里处理

  if (error instanceof Error) {
    console.error("请求失败:", error.message);
    uni.showToast({
      title: error.message,
      icon: "error",
    });
  }
}
```

## 自动功能

### 1. 认证管理

- ✅ 自动从 localStorage/uni 存储中获取 Token
- ✅ 自动添加 `Authorization: Bearer {token}` 请求头
- ✅ 认证失败时自动登出并重定向到登录页

### 2. 请求头配置

- ✅ 自动添加 `Content-Type: application/json`
- ✅ 自动添加 `tenant-id: 1`
- ✅ 支持自定义补充请求头

### 3. 错误处理

- ✅ 自动处理 HTTP 错误码（4xx/5xx）
- ✅ 自动处理网络错误
- ✅ 统一的错误提示

## 迁移检查清单

- [ ] 安装依赖: `npm install` 或 `pnpm install`
- [ ] 删除旧的 axios 导入：`import axios from 'axios'`
- [ ] 更新现有代码导入：`import { httpClient } from '@/api'`
- [ ] 测试所有 API 调用
- [ ] 验证文件上传功能
- [ ] 验证认证流程（登录/登出）
- [ ] 在各平台测试（H5/iOS/Android）

## 常见问题

### Q1: 如何处理跨域请求？

答：在 `vite.config.ts` 中配置代理，或在后端添加 CORS 头。

### Q2: 如何取消请求？

答：当前版本不支持原生取消。可以在组件卸载时清理相关逻辑。

### Q3: 如何设置全局超时时间？

答：编辑 `src/api/client.ts` 中的 `API_TIMEOUT` 常量。

### Q4: 上传大文件如何处理？

答：可在 `upload` 方法中添加分片逻辑。

### Q5: 如何添加请求日志？

答：在 `requestInterceptor` 中添加日志逻辑。

## 下一步

改造完成后，应进行：

1. **单元测试**: 测试各个 API 函数
2. **集成测试**: 测试完整的业务流程
3. **平台测试**: 验证 iOS/Android/H5 兼容性
4. **性能测试**: 确保性能满足要求

## 支持和反馈

如遇到问题，请检查：

1. 环境变量配置（`.env` 文件）
2. 后端 API 地址是否正确
3. 网络连接
4. 浏览器/原生应用的开发者工具输出
