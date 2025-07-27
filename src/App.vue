<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App根组件
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 14px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100vw;
  min-width: 100vw;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-width: 100vw;
  min-width: 100vw;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 隐藏水平滚动条 */
::-webkit-scrollbar:horizontal {
  display: none;
}

/* Element Plus 组件样式优化 */
.el-card {
  border-radius: 8px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.el-card__header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.el-card__body {
  padding: 20px;
  max-width: 100%;
  overflow-x: hidden;
}

.el-table {
  border-radius: 6px;
  overflow: hidden;
  max-width: 100%;
}

.el-table th {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}

.el-button {
  border-radius: 6px;
  font-weight: 500;
}

.el-input__inner {
  border-radius: 6px;
}

.el-select .el-input__inner {
  border-radius: 6px;
}

/* 确保所有容器不会产生水平滚动 */
.el-container,
.el-main,
.el-header,
.el-aside {
  max-width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* 移除所有可能的默认边距 */
.el-row {
  margin: 0 !important;
  width: 100% !important;
}

.el-col {
  padding: 0 !important;
}

/* 修复Element Plus栅格系统的默认样式 */
.el-row--flex {
  display: flex;
  flex-wrap: wrap;
  width: 100% !important;
}

.el-col-24 {
  width: 100% !important;
  flex: 0 0 100% !important;
}

.el-col-12 {
  width: 50% !important;
  flex: 0 0 50% !important;
}

.el-col-6 {
  width: 25% !important;
  flex: 0 0 25% !important;
}

.el-col-8 {
  width: 33.333333% !important;
  flex: 0 0 33.333333% !important;
}

.el-col-16 {
  width: 66.666667% !important;
  flex: 0 0 66.666667% !important;
}

/* 确保表格完全占满宽度 */
.el-table {
  width: 100% !important;
  table-layout: fixed;
}

.el-table__body,
.el-table__header {
  width: 100% !important;
}

/* 修复卡片内容 */
.el-card {
  width: 100% !important;
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  html {
    font-size: 13px;
  }

  .el-card__body {
    padding: 15px;
  }

  .el-card__header {
    padding: 12px 15px;
  }

  .el-col-12,
  .el-col-6,
  .el-col-8,
  .el-col-16 {
    width: 100% !important;
    flex: 0 0 100% !important;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style> 