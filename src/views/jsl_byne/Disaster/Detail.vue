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
  <el-descriptions :column="4" border>
    <el-descriptions-item label="所属区域">{{ device.area_name }}</el-descriptions-item>
    <el-descriptions-item label="所属变电站">{{ device.station_name }}</el-descriptions-item>
    <el-descriptions-item label="所属线路">{{ device.line_name }}</el-descriptions-item>
    <el-descriptions-item label="所属杆塔">{{ device.tower_name }}</el-descriptions-item>

    <el-descriptions-item label="设备类型">
      {{
        {
          BASE: '基站',
          ROVER: '移动站',
        }[device.type]
      }}
    </el-descriptions-item>
    <el-descriptions-item label="设备名称">{{ device.name }}</el-descriptions-item>
    <el-descriptions-item label="设备UUID">{{ device.uuid }}</el-descriptions-item>
    <el-descriptions-item label="设备SID">{{ device.sid }}</el-descriptions-item>

    <el-descriptions-item label="设备状态">
      {{ device.status ? '在线' : '离线' }}
    </el-descriptions-item>
    <el-descriptions-item label="WCS 状态">{{ device.gnss_status }}</el-descriptions-item>
    <el-descriptions-item label="经度">{{ device.lon }}</el-descriptions-item>
    <el-descriptions-item label="纬度">{{ device.lat }}</el-descriptions-item>

    <el-descriptions-item label="X">{{ device.base_x }}</el-descriptions-item>
    <el-descriptions-item label="Y">{{ device.base_y }}</el-descriptions-item>
    <el-descriptions-item label="Z">{{ device.base_z }}</el-descriptions-item>
    <el-descriptions-item label="告警值">
      {{ device.warning_value }}, {{ device.warning_value_z }}
    </el-descriptions-item>
  </el-descriptions>
</template>
