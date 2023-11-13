<!-- 微气象 -->
<script setup>
  import { useI1CommonAPI } from '../../../apis/i1/common';
  import { request } from '../../../apis/request';
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

  const APII1Common = useI1CommonAPI('/pc/gw_i1', request);
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
    const res = await APII1Common.micro_meteorology.list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        log.alarm = !!log.alarm;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 微气象 数据出错：' + getResponseMessage(error || data));
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
      width="170"
    ></el-table-column>
    <el-table-column align="center" label="采集时间" prop="timestamp" width="160"></el-table-column>
    <el-table-column align="center" label="10分钟平均统计数据">
      <el-table-column
        align="center"
        label="风速"
        prop="average_wind_speed_10min"
      ></el-table-column>
      <el-table-column
        align="center"
        label="风向"
        prop="average_wind_direction_10min"
      ></el-table-column>
    </el-table-column>
    <el-table-column align="center" label="标准风速" prop="standard_wind_speed"></el-table-column>
    <el-table-column align="center" label="最大风速" prop="max_wind_speed"></el-table-column>
    <el-table-column align="center" label="极大风速" prop="extreme_wind_speed"></el-table-column>
    <el-table-column align="center" label="气温" prop="air_temperature"></el-table-column>
    <el-table-column align="center" label="湿度" prop="humidity"></el-table-column>
    <el-table-column align="center" label="气压" prop="air_pressure"></el-table-column>
    <el-table-column align="center" label="降雨量" prop="precipitation"></el-table-column>
    <el-table-column
      align="center"
      label="降水强度"
      prop="precipitation_intensity"
    ></el-table-column>
    <el-table-column align="center" label="光辐射强度" prop="radiation_intensity"></el-table-column>
  </el-table>
</template>
