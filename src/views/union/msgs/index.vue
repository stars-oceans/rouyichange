<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="系统ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入系统ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入系统名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:dqSystemInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:dqSystemInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dqSystemInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:dqSystemInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dqSystemInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="系统名称" align="center" prop="name" />
      <el-table-column label="系统图标" align="center" prop="icon" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.icon" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="登录背景图" align="center" prop="bgImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.bgImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dqSystemInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dqSystemInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改系统信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dqSystemInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="系统ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入系统ID" />
        </el-form-item>
        <el-form-item label="系统名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入系统名称" />
        </el-form-item>
        <el-form-item label="系统图标" prop="icon">
          <image-upload v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="登录背景图" prop="bgImg">
          <image-upload v-model="form.bgImg"/>
        </el-form-item>
        <el-form-item label="" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DqSystemInfo">
import { listDqSystemInfo, getDqSystemInfo, delDqSystemInfo, addDqSystemInfo, updateDqSystemInfo } from "@/api/system/dqSystemInfo";

const { proxy } = getCurrentInstance();

const dqSystemInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    name: null,
  },
  rules: {
    id: [
      { required: true, message: "系统ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "系统名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询系统信息列表 */
function getList() {
  loading.value = true;
  listDqSystemInfo(queryParams.value).then(response => {
    dqSystemInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    icon: null,
    bgImg: null,
    createTime: null,
    updateTime: null,
    updateBy: null,
    createBy: null,
    remark: null
  };
  proxy.resetForm("dqSystemInfoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加系统信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDqSystemInfo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改系统信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["dqSystemInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDqSystemInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDqSystemInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除系统信息编号为"' + _ids + '"的数据项？').then(function() {
    return delDqSystemInfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/dqSystemInfo/export', {
    ...queryParams.value
  }, `dqSystemInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
