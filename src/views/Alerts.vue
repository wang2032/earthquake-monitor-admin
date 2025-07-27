<template>
  <div class="alerts-page">
    <!-- 预警统计 -->
    <el-row class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon active">
              <el-icon><Bell /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ alertStats.active }}</div>
              <div class="stats-label">活跃预警</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon today">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ alertStats.today }}</div>
              <div class="stats-label">今日预警</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon rules">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ alertStats.rules }}</div>
              <div class="stats-label">预警规则</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ alertStats.users }}</div>
              <div class="stats-label">通知用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警规则管理 -->
    <el-card class="rules-card">
      <template #header>
        <div class="card-header">
          <span>预警规则管理</span>
          <el-button type="primary" @click="showAddRuleDialog"
            >添加规则</el-button
          >
        </div>
      </template>

      <el-table :data="alertRules" style="width: 100%" stripe>
        <el-table-column prop="name" label="规则名称" width="150" />
        <el-table-column prop="condition" label="触发条件" width="200" />
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertLevelType(row.level)">{{
              row.level
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="适用区域" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-text="启用"
              inactive-text="禁用"
              @change="toggleRuleStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editRule(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRule(row)"
              >删除</el-button
            >
            <el-button size="small" type="info" @click="testRule(row)"
              >测试</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预警记录 -->
    <el-card class="records-card">
      <template #header>
        <div class="card-header">
          <span>预警记录</span>
          <div class="header-controls">
            <el-select
              v-model="filterLevel"
              placeholder="预警等级"
              clearable
              style="width: 120px; margin-right: 10px"
            >
              <el-option label="全部" value="" />
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
              <el-option label="紧急" value="urgent" />
            </el-select>
            <el-button size="small" @click="refreshRecords">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredAlertRecords" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="time" label="触发时间" width="180" />
        <el-table-column prop="rule" label="触发规则" width="150" />
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertLevelType(row.level)">{{
              row.level
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="magnitude" label="震级" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已处理' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notified" label="通知状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.notified ? 'success' : 'danger'">
              {{ row.notified ? "已通知" : "未通知" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewAlertDetail(row)"
              >详情</el-button
            >
            <el-button size="small" type="primary" @click="handleAlert(row)"
              >处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑规则对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="isEdit ? '编辑预警规则' : '添加预警规则'"
      width="600px"
    >
      <el-form
        :model="ruleForm"
        :rules="ruleRules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="触发条件" prop="condition">
          <el-select v-model="ruleForm.condition" placeholder="选择触发条件">
            <el-option label="震级大于等于" value="magnitude_ge" />
            <el-option label="震级小于等于" value="magnitude_le" />
            <el-option label="深度大于等于" value="depth_ge" />
            <el-option label="深度小于等于" value="depth_le" />
          </el-select>
          <el-input-number
            v-model="ruleForm.threshold"
            :min="0"
            :max="10"
            :precision="1"
            style="margin-left: 10px; width: 120px"
            placeholder="阈值"
          />
        </el-form-item>

        <el-form-item label="预警等级" prop="level">
          <el-select v-model="ruleForm.level" placeholder="选择预警等级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>

        <el-form-item label="适用区域" prop="region">
          <el-select
            v-model="ruleForm.region"
            placeholder="选择适用区域"
            multiple
          >
            <el-option label="全国" value="all" />
            <el-option label="华北地区" value="north" />
            <el-option label="华东地区" value="east" />
            <el-option label="华南地区" value="south" />
            <el-option label="西南地区" value="southwest" />
            <el-option label="西北地区" value="northwest" />
          </el-select>
        </el-form-item>

        <el-form-item label="通知方式" prop="notifyMethods">
          <el-checkbox-group v-model="ruleForm.notifyMethods">
            <el-checkbox label="email">邮件</el-checkbox>
            <el-checkbox label="sms">短信</el-checkbox>
            <el-checkbox label="push">推送</el-checkbox>
            <el-checkbox label="webhook">Webhook</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规则描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预警详情对话框 -->
    <el-dialog v-model="alertDetailVisible" title="预警详情" width="500px">
      <div v-if="selectedAlert" class="alert-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="预警ID">{{
            selectedAlert.id
          }}</el-descriptions-item>
          <el-descriptions-item label="触发时间">{{
            selectedAlert.time
          }}</el-descriptions-item>
          <el-descriptions-item label="触发规则">{{
            selectedAlert.rule
          }}</el-descriptions-item>
          <el-descriptions-item label="预警等级">
            <el-tag :type="getAlertLevelType(selectedAlert.level)">{{
              selectedAlert.level
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="位置">{{
            selectedAlert.location
          }}</el-descriptions-item>
          <el-descriptions-item label="震级">{{
            selectedAlert.magnitude
          }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{
            selectedAlert.status
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 预警统计
const alertStats = ref({
  active: 5,
  today: 12,
  rules: 8,
  users: 156,
});

// 预警规则
const alertRules = ref([
  {
    id: 1,
    name: "高震级预警",
    condition: "震级 >= 4.0",
    level: "高",
    region: "全国",
    status: true,
    createTime: "2024-01-10 10:00:00",
  },
  {
    id: 2,
    name: "浅层地震预警",
    condition: "深度 <= 10km",
    level: "中",
    region: "华南地区",
    status: true,
    createTime: "2024-01-08 14:30:00",
  },
  {
    id: 3,
    name: "频繁地震预警",
    condition: "1小时内 >= 3次",
    level: "紧急",
    region: "华北地区",
    status: false,
    createTime: "2024-01-05 09:15:00",
  },
]);

// 预警记录
const alertRecords = ref([
  {
    id: 1,
    time: "2024-01-15 14:30:25",
    rule: "高震级预警",
    level: "高",
    location: "广州市天河区",
    magnitude: 3.2,
    status: "未处理",
    notified: true,
  },
  {
    id: 2,
    time: "2024-01-15 14:25:10",
    rule: "浅层地震预警",
    level: "中",
    location: "北京市海淀区",
    magnitude: 2.5,
    status: "已处理",
    notified: true,
  },
  {
    id: 3,
    time: "2024-01-15 14:20:45",
    rule: "频繁地震预警",
    level: "紧急",
    location: "上海市浦东新区",
    magnitude: 1.8,
    status: "未处理",
    notified: false,
  },
]);

// 过滤条件
const filterLevel = ref("");

// 过滤后的预警记录
const filteredAlertRecords = computed(() => {
  if (!filterLevel.value) return alertRecords.value;
  return alertRecords.value.filter(
    (record) => record.level === filterLevel.value
  );
});

// 规则对话框
const ruleDialogVisible = ref(false);
const isEdit = ref(false);
const ruleFormRef = ref<FormInstance>();

// 规则表单
const ruleForm = reactive({
  name: "",
  condition: "",
  threshold: 0,
  level: "",
  region: [],
  notifyMethods: [],
  description: "",
});

// 规则验证
const ruleRules: FormRules = {
  name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
  condition: [{ required: true, message: "请选择触发条件", trigger: "change" }],
  level: [{ required: true, message: "请选择预警等级", trigger: "change" }],
  region: [{ required: true, message: "请选择适用区域", trigger: "change" }],
};

// 预警详情对话框
const alertDetailVisible = ref(false);
const selectedAlert = ref(null);

// 获取预警等级类型
const getAlertLevelType = (level: string) => {
  switch (level) {
    case "低":
      return "info";
    case "中":
      return "warning";
    case "高":
      return "danger";
    case "紧急":
      return "danger";
    default:
      return "info";
  }
};

// 显示添加规则对话框
const showAddRuleDialog = () => {
  isEdit.value = false;
  resetRuleForm();
  ruleDialogVisible.value = true;
};

// 编辑规则
const editRule = (rule: any) => {
  isEdit.value = true;
  Object.assign(ruleForm, rule);
  ruleDialogVisible.value = true;
};

// 删除规则
const deleteRule = async (rule: any) => {
  try {
    await ElMessageBox.confirm("确定要删除这个预警规则吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const index = alertRules.value.findIndex((r) => r.id === rule.id);
    if (index > -1) {
      alertRules.value.splice(index, 1);
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消
  }
};

// 测试规则
const testRule = (rule: any) => {
  console.log("测试规则:", rule);
  ElMessage.info("规则测试功能开发中");
};

// 切换规则状态
const toggleRuleStatus = (rule: any) => {
  console.log("切换规则状态:", rule);
};

// 保存规则
const saveRule = async () => {
  if (!ruleFormRef.value) return;

  try {
    await ruleFormRef.value.validate();

    if (isEdit.value) {
      // 编辑模式
      ElMessage.success("规则更新成功");
    } else {
      // 添加模式
      const newRule = {
        id: Date.now(),
        ...ruleForm,
        createTime: new Date().toLocaleString(),
      };
      alertRules.value.push(newRule);
      ElMessage.success("规则添加成功");
    }

    ruleDialogVisible.value = false;
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 重置规则表单
const resetRuleForm = () => {
  Object.assign(ruleForm, {
    name: "",
    condition: "",
    threshold: 0,
    level: "",
    region: [],
    notifyMethods: [],
    description: "",
  });
};

// 查看预警详情
const viewAlertDetail = (alert: any) => {
  selectedAlert.value = alert;
  alertDetailVisible.value = true;
};

// 处理预警
const handleAlert = (alert: any) => {
  alert.status = "已处理";
  ElMessage.success("预警已处理");
};

// 刷新记录
const refreshRecords = () => {
  console.log("刷新预警记录");
};

onMounted(() => {
  console.log("预警管理页面初始化完成");
});
</script>

<style scoped>
.alerts-page {
  padding: 0;
  width: 100%;
  margin: 0;
}

.stats-row {
  margin-bottom: 20px;
  padding: 0;
}

.stats-card {
  height: 100px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
  color: white;
}

.stats-icon.active {
  background-color: #409eff;
}

.stats-icon.today {
  background-color: #67c23a;
}

.stats-icon.rules {
  background-color: #e6a23c;
}

.stats-icon.users {
  background-color: #909399;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.rules-card {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
}

.records-card {
  margin-bottom: 20px;
  margin-left: 0;
  margin-right: 0;
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

.alert-detail {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-row {
    padding: 0;
  }

  .rules-card,
  .records-card {
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 