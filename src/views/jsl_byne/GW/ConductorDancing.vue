<!-- 导地线舞动特征量数据 -->
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
      prop: 'u_gallop_frequency',
      label: '舞动频率',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.u_gallop_frequency} Hz`;
      },
    },
    {
      prop: 'u_angle_to_vertical',
      label: '舞动椭圆倾斜角',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.u_angle_to_vertical} °`;
      },
    },
    {
      prop: 'u_gallop_amplitude',
      label: '舞动幅值',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.u_gallop_amplitude} m`;
      },
    },
    {
      prop: 'u_horizontal_amplitude',
      label: '水平舞动幅值',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.u_horizontal_amplitude} m`;
      },
    },
    {
      prop: 'u_vertical_amplitude',
      label: '垂直舞动幅值',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.u_vertical_amplitude} m`;
      },
    },
  ];
  const colsAlarmTypeMap = [
    { type: 'info', desc: '未报警' },
    { type: 'warning', desc: '报警' },
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
    const res = await APIGWI1.component.conductor_dancing(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        log.alarm = log.alarm ? 1 : 0;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 导地线舞动特征量数据 数据出错：' + getResponseMessage(error || data));
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
