<template>
  <el-container class="layout-container">
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <div class="logo">
            <img src="../assets/logo.svg" alt="Logo" />
            <span>地震监测系统</span>
          </div>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 导航菜单 -->
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            class="top-menu"
            router
          >
            <el-menu-item index="/dashboard">
              <el-icon><DataBoard /></el-icon>
              <span>仪表盘</span>
            </el-menu-item>

            <el-menu-item index="/monitor">
              <el-icon><Monitor /></el-icon>
              <span>实时监测</span>
            </el-menu-item>

            <el-menu-item index="/history">
              <el-icon><Clock /></el-icon>
              <span>历史数据</span>
            </el-menu-item>

            <el-menu-item index="/analysis">
              <el-icon><TrendCharts /></el-icon>
              <span>数据分析</span>
            </el-menu-item>

            <el-menu-item index="/alerts">
              <el-icon><Warning /></el-icon>
              <span>预警管理</span>
            </el-menu-item>

            <el-menu-item index="/settings">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>

          <!-- 用户信息 -->
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ userInfo.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();

const userInfo = ref({
  username: "admin",
});

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 当前页面标题
const currentPageTitle = computed(() => {
  return (route.meta?.title as string) || "页面";
});

// 处理用户下拉菜单命令
const handleCommand = async (command: string) => {
  if (command === "logout") {
    try {
      await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      router.push("/login");
    } catch {
      // 用户取消
    }
  } else if (command === "profile") {
    // 跳转到个人信息页面
    console.log("个人信息");
  }
};

// 初始化用户信息
onMounted(() => {
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo);
  }
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 0;
  margin: 0;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 30px;
  color: #409eff;
  font-size: 18px;
  font-weight: bold;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.top-menu {
  border: none;
  background: transparent;
}

.top-menu :deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
  color: #606266;
}

.top-menu :deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
  color: #409eff;
}

.top-menu :deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  margin: 0 8px;
  color: #333;
  font-weight: 500;
}

.main-content {
  background-color: #f5f7fa;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-width: 0;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header {
    padding: 0 15px;
  }

  .logo {
    margin-right: 20px;
    font-size: 16px;
  }

  .header-right {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 10px 15px;
  }

  .header-left {
    margin-bottom: 10px;
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .top-menu {
    flex: 1;
  }

  .top-menu :deep(.el-menu-item) {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
  }

  .main-content {
    padding: 15px;
  }
}
</style> 