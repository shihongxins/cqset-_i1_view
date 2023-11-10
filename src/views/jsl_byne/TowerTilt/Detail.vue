<script setup>
  defineProps({
    device: {
      required: true,
      type: Object,
      default: () => ({}),
    },
  });
</script>

<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="所属线路">{{ device.line_name }}</el-descriptions-item>
    <el-descriptions-item label="所属杆塔">{{ device.tower_name }}</el-descriptions-item>
    <el-descriptions-item label="设备名称">{{ device.name }}</el-descriptions-item>
    <el-descriptions-item label="设备UUID">{{ device.uuid }}</el-descriptions-item>

    <el-descriptions-item label="设备状态">{{ device.status_desc }}</el-descriptions-item>
    <el-descriptions-item label="经纬度">{{ device.lon }}, {{ device.lat }}</el-descriptions-item>

    <el-descriptions-item label="最大倾斜角度">{{ device.max_val }}</el-descriptions-item>
    <el-descriptions-item label="最新数据">
      X= {{ device.now_x }}, Y= {{ device.now_y }}
    </el-descriptions-item>
  </el-descriptions>
</template>
