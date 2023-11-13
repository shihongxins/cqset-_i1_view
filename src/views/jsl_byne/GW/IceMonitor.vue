<!-- 覆冰监测 -->
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
    const res = await APIGWI1.component.ice_monitor.list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        log.alarm = !!log.alarm;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 覆冰监测 数据出错：' + getResponseMessage(error || data));
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
    <el-table-column align="center" label="采集时间" prop="timestamp" width="160"></el-table-column>
    <el-table-column align="center" label="拉力传感器个数" prop="t_sensor_num"></el-table-column>
    <el-table-column align="center" label="拉力数据">
      <el-table-column align="center" label="综合载荷" prop="tension">
        <template #default="{ row: { tension } }"> {{ tension }} N</template>
      </el-table-column>
      <el-table-column align="center" label="不均衡张力差" prop="tension_difference">
        <template #default="{ row: { tension_difference } }"> {{ tension_difference }} N</template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="环境信息">
      <el-table-column align="center" label="温度" prop="air_temperature">
        <template #default="{ row: { air_temperature } }"> {{ air_temperature }} ℃</template>
      </el-table-column>
      <el-table-column align="center" label="等值覆冰厚度" prop="equal_ice_thickness">
        <template #default="{ row: { equal_ice_thickness } }">
          {{ equal_ice_thickness }} mm
        </template>
      </el-table-column>
      <el-table-column align="center" label="湿度" prop="humidity">
        <template #default="{ row: { humidity } }"> {{ humidity }} %RH</template>
      </el-table-column>
      <el-table-column align="center" label="风向" prop="instantaneous_wind_direction">
        <template #default="{ row: { instantaneous_wind_direction } }">
          {{ instantaneous_wind_direction }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="风速" prop="instantaneous_wind_speed">
        <template #default="{ row: { instantaneous_wind_speed } }">
          {{ instantaneous_wind_speed }} m/s</template
        >
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
