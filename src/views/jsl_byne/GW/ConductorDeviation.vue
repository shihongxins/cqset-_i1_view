<!-- 导线风偏 -->
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
        align: 'center',
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
      prop: 'windage_yaw_angle',
      label: '风偏角',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.windage_yaw_angle} °`;
      },
    },
    {
      prop: 'deflection_angle',
      label: '偏斜角',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.deflection_angle} °`;
      },
    },
    {
      prop: 'least_clearance',
      label: '最小电气间隔',
      attrs: {
        align: 'center',
      },
      formatter(row) {
        return `${row.least_clearance}`;
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
    const res = await APIGWI1.component.conductor_deviation(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        log.alarm = log.alarm ? 1 : 0;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 导线风偏 数据出错：' + getResponseMessage(error || data));
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
