<template>
  <div class="settings-page">
    <el-tabs v-model="activeTab" tab-position="left" class="settings-tabs">
      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="system">
        <div class="tab-content">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>基本配置</span>
              </div>
            </template>

            <el-form :model="systemConfig" label-width="120px">
              <el-form-item label="系统名称">
                <el-input
                  v-model="systemConfig.name"
                  placeholder="请输入系统名称"
                />
              </el-form-item>

              <el-form-item label="系统版本">
                <el-input v-model="systemConfig.version" disabled />
              </el-form-item>

              <el-form-item label="数据刷新间隔">
                <el-input-number
                  v-model="systemConfig.refreshInterval"
                  :min="5"
                  :max="300"
                  :step="5"
                />
                <span style="margin-left: 10px; color: #909399">秒</span>
              </el-form-item>

              <el-form-item label="数据保留天数">
                <el-input-number
                  v-model="systemConfig.dataRetention"
                  :min="30"
                  :max="365"
                  :step="30"
                />
                <span style="margin-left: 10px; color: #909399">天</span>
              </el-form-item>

              <el-form-item label="时区设置">
                <el-select
                  v-model="systemConfig.timezone"
                  placeholder="选择时区"
                >
                  <el-option label="UTC+8 (北京时间)" value="Asia/Shanghai" />
                  <el-option label="UTC+0 (格林威治时间)" value="UTC" />
                  <el-option
                    label="UTC-5 (美国东部时间)"
                    value="America/New_York"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveSystemConfig"
                  >保存配置</el-button
                >
                <el-button @click="resetSystemConfig">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>监测配置</span>
              </div>
            </template>

            <el-form :model="monitorConfig" label-width="120px">
              <el-form-item label="监测精度">
                <el-select
                  v-model="monitorConfig.precision"
                  placeholder="选择监测精度"
                >
                  <el-option label="高精度 (0.1级)" value="high" />
                  <el-option label="中等精度 (0.5级)" value="medium" />
                  <el-option label="低精度 (1.0级)" value="low" />
                </el-select>
              </el-form-item>

              <el-form-item label="监测范围">
                <el-input-number
                  v-model="monitorConfig.range"
                  :min="10"
                  :max="1000"
                  :step="10"
                />
                <span style="margin-left: 10px; color: #909399">公里</span>
              </el-form-item>

              <el-form-item label="自动备份">
                <el-switch v-model="monitorConfig.autoBackup" />
              </el-form-item>

              <el-form-item label="备份频率" v-if="monitorConfig.autoBackup">
                <el-select
                  v-model="monitorConfig.backupFrequency"
                  placeholder="选择备份频率"
                >
                  <el-option label="每日" value="daily" />
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveMonitorConfig"
                  >保存配置</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="users">
        <div class="tab-content">
          <el-card class="users-card">
            <template #header>
              <div class="card-header">
                <span>用户列表</span>
                <el-button type="primary" @click="showAddUserDialog"
                  >添加用户</el-button
                >
              </div>
            </template>

            <el-table :data="userList" style="width: 100%" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="username" label="用户名" width="120" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="email" label="邮箱" width="200" />
              <el-table-column prop="role" label="角色" width="100">
                <template #default="{ row }">
                  <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-switch
                    v-model="row.status"
                    active-text="启用"
                    inactive-text="禁用"
                    @change="toggleUserStatus(row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="lastLogin" label="最后登录" width="180" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button size="small" @click="editUser(row)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="deleteUser(row)"
                    >删除</el-button
                  >
                  <el-button
                    size="small"
                    type="warning"
                    @click="resetPassword(row)"
                    >重置密码</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 通知设置 -->
      <el-tab-pane label="通知设置" name="notifications">
        <div class="tab-content">
          <el-card class="notification-card">
            <template #header>
              <div class="card-header">
                <span>通知配置</span>
              </div>
            </template>

            <el-form :model="notificationConfig" label-width="120px">
              <el-form-item label="邮件通知">
                <el-switch v-model="notificationConfig.email.enabled" />
              </el-form-item>

              <template v-if="notificationConfig.email.enabled">
                <el-form-item label="SMTP服务器">
                  <el-input
                    v-model="notificationConfig.email.smtp"
                    placeholder="smtp.example.com"
                  />
                </el-form-item>

                <el-form-item label="端口">
                  <el-input-number
                    v-model="notificationConfig.email.port"
                    :min="1"
                    :max="65535"
                  />
                </el-form-item>

                <el-form-item label="用户名">
                  <el-input
                    v-model="notificationConfig.email.username"
                    placeholder="邮箱用户名"
                  />
                </el-form-item>

                <el-form-item label="密码">
                  <el-input
                    v-model="notificationConfig.email.password"
                    type="password"
                    placeholder="邮箱密码"
                    show-password
                  />
                </el-form-item>
              </template>

              <el-divider />

              <el-form-item label="短信通知">
                <el-switch v-model="notificationConfig.sms.enabled" />
              </el-form-item>

              <template v-if="notificationConfig.sms.enabled">
                <el-form-item label="API密钥">
                  <el-input
                    v-model="notificationConfig.sms.apiKey"
                    placeholder="短信服务API密钥"
                  />
                </el-form-item>

                <el-form-item label="模板ID">
                  <el-input
                    v-model="notificationConfig.sms.templateId"
                    placeholder="短信模板ID"
                  />
                </el-form-item>
              </template>

              <el-divider />

              <el-form-item label="推送通知">
                <el-switch v-model="notificationConfig.push.enabled" />
              </el-form-item>

              <template v-if="notificationConfig.push.enabled">
                <el-form-item label="推送服务">
                  <el-select
                    v-model="notificationConfig.push.service"
                    placeholder="选择推送服务"
                  >
                    <el-option label="极光推送" value="jpush" />
                    <el-option label="个推" value="getui" />
                    <el-option label="小米推送" value="xiaomi" />
                  </el-select>
                </el-form-item>

                <el-form-item label="应用密钥">
                  <el-input
                    v-model="notificationConfig.push.appKey"
                    placeholder="推送服务应用密钥"
                  />
                </el-form-item>
              </template>

              <el-form-item>
                <el-button type="primary" @click="saveNotificationConfig"
                  >保存配置</el-button
                >
                <el-button @click="testNotification">测试通知</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 系统日志 -->
      <el-tab-pane label="系统日志" name="logs">
        <div class="tab-content">
          <el-card class="logs-card">
            <template #header>
              <div class="card-header">
                <span>系统日志</span>
                <div class="header-controls">
                  <el-select
                    v-model="logLevel"
                    placeholder="日志级别"
                    style="width: 120px; margin-right: 10px"
                  >
                    <el-option label="全部" value="" />
                    <el-option label="错误" value="error" />
                    <el-option label="警告" value="warning" />
                    <el-option label="信息" value="info" />
                    <el-option label="调试" value="debug" />
                  </el-select>
                  <el-button size="small" @click="refreshLogs">刷新</el-button>
                  <el-button size="small" type="danger" @click="clearLogs"
                    >清空日志</el-button
                  >
                </div>
              </div>
            </template>

            <div class="logs-container">
              <div
                v-for="log in filteredLogs"
                :key="log.id"
                class="log-item"
                :class="log.level"
              >
                <span class="log-time">{{ log.time }}</span>
                <span class="log-level">{{ log.level.toUpperCase() }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="userFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="操作员" value="operator" />
            <el-option label="观察员" value="observer" />
          </el-select>
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 当前激活的标签页
const activeTab = ref("system");

// 系统配置
const systemConfig = reactive({
  name: "地震监测管理系统",
  version: "v1.0.0",
  refreshInterval: 30,
  dataRetention: 90,
  timezone: "Asia/Shanghai",
});

// 监测配置
const monitorConfig = reactive({
  precision: "high",
  range: 100,
  autoBackup: true,
  backupFrequency: "daily",
});

// 用户列表
const userList = ref([
  {
    id: 1,
    username: "admin",
    name: "系统管理员",
    email: "admin@example.com",
    role: "admin",
    status: true,
    lastLogin: "2024-01-15 14:30:25",
  },
  {
    id: 2,
    username: "operator1",
    name: "操作员1",
    email: "operator1@example.com",
    role: "operator",
    status: true,
    lastLogin: "2024-01-15 13:20:10",
  },
  {
    id: 3,
    username: "observer1",
    name: "观察员1",
    email: "observer1@example.com",
    role: "observer",
    status: false,
    lastLogin: "2024-01-14 16:45:30",
  },
]);

// 通知配置
const notificationConfig = reactive({
  email: {
    enabled: true,
    smtp: "smtp.example.com",
    port: 587,
    username: "noreply@example.com",
    password: "",
  },
  sms: {
    enabled: false,
    apiKey: "",
    templateId: "",
  },
  push: {
    enabled: true,
    service: "jpush",
    appKey: "",
  },
});

// 系统日志
const systemLogs = ref([
  {
    id: 1,
    time: "2024-01-15 14:30:25",
    level: "info",
    message: "系统启动成功",
  },
  {
    id: 2,
    time: "2024-01-15 14:25:10",
    level: "warning",
    message: "监测站点连接超时",
  },
  {
    id: 3,
    time: "2024-01-15 14:20:45",
    level: "error",
    message: "数据库连接失败",
  },
]);

// 日志过滤
const logLevel = ref("");

// 过滤后的日志
const filteredLogs = computed(() => {
  if (!logLevel.value) return systemLogs.value;
  return systemLogs.value.filter((log) => log.level === logLevel.value);
});

// 用户对话框
const userDialogVisible = ref(false);
const isEdit = ref(false);
const userFormRef = ref<FormInstance>();

// 用户表单
const userForm = reactive({
  username: "",
  name: "",
  email: "",
  role: "",
  password: "",
});

// 用户验证规则
const userRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
};

// 获取角色类型
const getRoleType = (role: string) => {
  switch (role) {
    case "admin":
      return "danger";
    case "operator":
      return "warning";
    case "observer":
      return "info";
    default:
      return "info";
  }
};

// 保存系统配置
const saveSystemConfig = () => {
  ElMessage.success("系统配置保存成功");
};

// 重置系统配置
const resetSystemConfig = () => {
  Object.assign(systemConfig, {
    name: "地震监测管理系统",
    version: "v1.0.0",
    refreshInterval: 30,
    dataRetention: 90,
    timezone: "Asia/Shanghai",
  });
  ElMessage.info("系统配置已重置");
};

// 保存监测配置
const saveMonitorConfig = () => {
  ElMessage.success("监测配置保存成功");
};

// 显示添加用户对话框
const showAddUserDialog = () => {
  isEdit.value = false;
  resetUserForm();
  userDialogVisible.value = true;
};

// 编辑用户
const editUser = (user: any) => {
  isEdit.value = true;
  Object.assign(userForm, user);
  userDialogVisible.value = true;
};

// 删除用户
const deleteUser = async (user: any) => {
  try {
    await ElMessageBox.confirm("确定要删除这个用户吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const index = userList.value.findIndex((u) => u.id === user.id);
    if (index > -1) {
      userList.value.splice(index, 1);
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消
  }
};

// 重置密码
const resetPassword = async (user: any) => {
  try {
    await ElMessageBox.confirm("确定要重置该用户的密码吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    ElMessage.success("密码重置成功，新密码已发送到用户邮箱");
  } catch {
    // 用户取消
  }
};

// 切换用户状态
const toggleUserStatus = (user: any) => {
  console.log("切换用户状态:", user);
};

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return;

  try {
    await userFormRef.value.validate();

    if (isEdit.value) {
      // 编辑模式
      ElMessage.success("用户更新成功");
    } else {
      // 添加模式
      const newUser = {
        id: Date.now(),
        ...userForm,
        status: true,
        lastLogin: "-",
      };
      userList.value.push(newUser);
      ElMessage.success("用户添加成功");
    }

    userDialogVisible.value = false;
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    username: "",
    name: "",
    email: "",
    role: "",
    password: "",
  });
};

// 保存通知配置
const saveNotificationConfig = () => {
  ElMessage.success("通知配置保存成功");
};

// 测试通知
const testNotification = () => {
  ElMessage.info("测试通知已发送");
};

// 刷新日志
const refreshLogs = () => {
  console.log("刷新系统日志");
};

// 清空日志
const clearLogs = async () => {
  try {
    await ElMessageBox.confirm("确定要清空所有日志吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    systemLogs.value = [];
    ElMessage.success("日志已清空");
  } catch {
    // 用户取消
  }
};

onMounted(() => {
  console.log("系统设置页面初始化完成");
});
</script>

<style scoped>
.settings-page {
  padding: 0;
  width: 100%;
  height: 100%;
  margin: 0;
}

.settings-tabs {
  height: 100%;
  margin-left: 0;
  margin-right: 0;
}

.settings-tabs :deep(.el-tabs__content) {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.tab-content {
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.users-card {
  margin-bottom: 20px;
}

.notification-card {
  margin-bottom: 20px;
}

.logs-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-controls {
  display: flex;
  align-items: center;
}

.logs-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  background-color: #fafafa;
}

.log-item {
  display: flex;
  margin-bottom: 5px;
  font-family: "Courier New", monospace;
  font-size: 12px;
}

.log-time {
  color: #909399;
  margin-right: 10px;
  min-width: 150px;
}

.log-level {
  margin-right: 10px;
  min-width: 60px;
  font-weight: bold;
}

.log-message {
  flex: 1;
}

.log-item.info .log-level {
  color: #409eff;
}

.log-item.warning .log-level {
  color: #e6a23c;
}

.log-item.error .log-level {
  color: #f56c6c;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-tabs {
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 