<!-- 现场站点污秽 -->
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
    const res = await APIGWI1.component.site_pollution.list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp);
        log.alarm = !!log.alarm;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 现场站点污秽 数据出错：' + getResponseMessage(error || data));
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
    <el-table-column align="center" label="日最小湿度" prop="daily_min_humidity">
      <template #default="{ row: { daily_min_humidity } }"> {{ daily_min_humidity }} RH </template>
    </el-table-column>
    <el-table-column align="center" label="日最大湿度" prop="daily_max_humidity">
      <template #default="{ row: { daily_max_humidity } }"> {{ daily_max_humidity }} RH </template>
    </el-table-column>
    <el-table-column align="center" label="日最低温度" prop="daily_min_temperature">
      <template #default="{ row: { daily_min_temperature } }">
        {{ daily_min_temperature }} ℃
      </template>
    </el-table-column>
    <el-table-column align="center" label="日最高温度" prop="daily_max_temperature">
      <template #default="{ row: { daily_max_temperature } }">
        {{ daily_max_temperature }} ℃
      </template>
    </el-table-column>
    <el-table-column align="center" label="等值附盐密度（盐密）" prop="esdd">
      <template #default="{ row: { esdd } }">
        {{ esdd }} mg/cm<sup style="font-size: 10px">2</sup>
      </template>
    </el-table-column>
    <el-table-column align="center" label="不溶物密度（灰密）" prop="nsdd">
      <template #default="{ row: { nsdd } }">
        {{ nsdd }} mg/cm<sup style="font-size: 10px">2</sup>
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
