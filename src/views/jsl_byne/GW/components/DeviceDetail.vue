<script setup>
  import { nativeFormat } from '@shihongxins/jsutils';
  import { DevTypeMap } from '../../../../apis/i1/common';

  defineProps({
    device: {
      required: true,
      type: Object,
      default: () => ({}),
    },
  });

  const InfoMap = {
    battery_capacity: {
      label: '电池电量',
      unit: 'Ah',
    },
    battery_voltage: {
      label: '电源电压',
      unit: 'V',
    },
    cmd_id: {
      label: '设备号',
      unit: '',
    },
    connection_state: {
      label: '网络连接状态',
      unit: '',
      format: (value) => {
        return value === 0 ? '正常' : '断开';
      },
    },
    created_at: {
      label: '创建时间',
      unit: '',
      format: (value) => {
        return nativeFormat(value);
      },
    },
    dev_type: {
      label: '设备类型',
      unit: '',
      format: (value) => {
        return DevTypeMap[value];
      },
    },
    floating_charge: {
      label: '浮充状态',
      unit: '',
      format: (value) => {
        return value === 0 ? '充电' : '放电';
      },
    },
    name: {
      label: '设备名称',
      unit: '',
    },
    operation_temperature: {
      label: '工作温度',
      unit: '℃',
    },
    status: {
      label: '设备状态',
      unit: '',
      format: (value) => {
        return value ? '在线' : '离线';
      },
    },
    timestamp: {
      label: '采集时间',
      unit: '',
      format: (value) => {
        return nativeFormat(value);
      },
    },
    total_working_time: {
      label: '工作总时间',
      unit: '小时',
    },
    updated_at: {
      label: '更新时间',
      unit: '',
      format: (value) => {
        return nativeFormat(value);
      },
    },
    version: {
      label: '设备版本',
      unit: '',
    },
    working_time: {
      label: '连续工作时间',
      unit: '小时',
    },
    tower_name: {
      label: '杆塔名称',
    },
    line_name: {
      label: '线路名称',
    },
  };
</script>
<template>
  <el-descriptions border>
    <template v-for="(val, prop) in device">
      <el-descriptions-item :key="prop" v-if="InfoMap[prop]" :label="InfoMap[prop].label">
        <span> {{ InfoMap[prop].format ? InfoMap[prop].format(val) : val }} </span>
        <small> {{ InfoMap[prop].unit }} </small>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>
