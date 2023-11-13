<!-- 污闪电压 -->
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
    const res = await APIGWI1.component.pollution_lightning_pressure.list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp);
        log.alarm = !!log.alarm;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 污闪电压 数据出错：' + getResponseMessage(error || data));
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
  <el-table size="mini" height="100%" border :data="list">
    <el-table-column
      align="center"
      label="被监测设备 ID"
      prop="component_id"
      width="160"
    ></el-table-column>
    <el-table-column align="center" label="传感单元" prop="unit">
      <template #default="{ row: { unit_sum, unit_no } }">
        {{ unit_sum }} - {{ unit_no }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="采集时间" prop="timestamp" width="160"></el-table-column>
    <el-table-column align="center" label="泄漏电流" prop="leakage_curr">
      <template #default="{ row: { leakage_curr } }"> {{ leakage_curr }} mA</template>
    </el-table-column>
    <el-table-column align="center" label="污闪电压" prop="flashover_volt">
      <template #default="{ row: { flashover_volt } }"> {{ flashover_volt }} V </template>
    </el-table-column>
    <el-table-column align="center" label="日间湿度">
      <el-table-column align="center" label="最小" prop="min_humi">
        <template #default="{ row: { min_humi } }"> {{ min_humi }} RH </template>
      </el-table-column>
      <el-table-column align="center" label="最大" prop="max_humi">
        <template #default="{ row: { max_humi } }"> {{ max_humi }} RH </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="日间气温">
      <el-table-column align="center" label="最低" prop="min_temp">
        <template #default="{ row: { min_temp } }"> {{ min_temp }} ℃ </template>
      </el-table-column>
      <el-table-column align="center" label="最高" prop="max_temp">
        <template #default="{ row: { max_temp } }"> {{ max_temp }} ℃ </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="等值附盐密度（盐密）" prop="salt_density">
      <template #default="{ row: { salt_density } }">
        {{ salt_density }} mg/cm<sup style="font-size: 10px">2</sup>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" prop="alarm">
      <template #default="{ row: { alarm } }">
        <el-tag :type="alarm ? 'warning' : 'info'" size="small">
          {{ alarm ? '已报警' : '未报警' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>
