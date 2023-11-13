<!-- 导地线微风振动特征量 -->
<script setup>
  import { APIGWI1 } from '../../../apis/i1/gwi1';
  import {
    assignCommonProperty,
    validateResponseCode,
    nativeFormat,
    getResponseMessage,
  } from '@shihongxins/jsutils';

  defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });
  const cols = [
    {
      prop: 'component_id',
      label: '被监测设备ID',
      attrs: {
        width: 170,
        align: 'center',
      },
    },
    {
      prop: 'unit',
      label: '传感单元',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.unit_no} - ${row.unit_sum}`;
      },
    },
    {
      prop: 'timestamp',
      label: '采集时间',
      attrs: {
        width: 160,
        align: 'center',
      },
      formatter(row) {
        return nativeFormat(row.timestamp || row.updated_at);
      },
    },
    {
      prop: 'bending_amplitude',
      label: '弯曲振幅',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.bending_amplitude} mm`;
      },
    },
    {
      prop: 'vibration_frequency',
      label: '振动频率',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.vibration_frequency} Hz`;
      },
    },
    {
      prop: 'strain_amplitude',
      label: '动弯应变幅值',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.strain_amplitude} me`;
      },
    },
  ];
  const colsAlarmTypeMap = [
    { type: 'info', desc: '未报警' },
    { type: 'primary', desc: '轻微' },
    { type: 'warning', desc: '中度' },
    { type: 'danger', desc: '重度' },
  ];
  const queryFun = async (params = {}) => {
    const reqData = assignCommonProperty(
      {
        cmd_id: '',
        component_id: '',
        sort: 'desc',
        start_date: '',
        page: 1,
        size: 10,
      },
      params
    );
    reqData.start_date = nativeFormat(reqData.start_date, 'YYYY-MM-DD');
    let list = [];
    let total = 0;
    const res = await APIGWI1.component.characteristic_quantity(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 导地线微风振动特征量 数据出错：' + getResponseMessage(error || data));
    }
    return {
      error,
      list,
      total,
    };
  };

  defineExpose({
    queryFun,
  });
</script>

<template>
  <ElTable size="mini" height="100%" border :data="list">
    <ElTableColumn
      v-for="col in cols"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label || col.prop"
      v-bind="col.attrs || col"
    >
      <template #default="{ row }">
        {{ col.formatter ? col.formatter(row) : row[col.prop] }}
      </template>
    </ElTableColumn>
    <ElTableColumn prop="alarm" label="报警等级" width="100" align="center">
      <template #default="{ row: { alarm = 0 } }">
        <ElTag size="small" :type="colsAlarmTypeMap[alarm]['type']">
          {{ colsAlarmTypeMap[alarm]['desc'] }}
        </ElTag>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
