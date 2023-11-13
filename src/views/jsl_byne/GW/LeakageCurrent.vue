<!-- 泄漏电流 -->
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
    const res = await APIGWI1.component.insulator_leakage_current.list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp);
        log.alarm = !!log.alarm;
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 绝缘子串泄露电流 数据出错：' + getResponseMessage(error || data));
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
    <el-table-column align="center" label="传感单元数量" prop="number"></el-table-column>
    <el-table-column align="center" label="安装位置 1">
      <el-table-column align="center" label="识别码1" prop="location1">
        <template #default="{ row: { location1 } }"> {{ location1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="泄漏电流1" prop="leakage_current1">
        <template #default="{ row: { leakage_current1 } }"> {{ leakage_current1 }} mA</template>
      </el-table-column>
      <el-table-column align="center" label="污闪电压1" prop="pollution_lightning_pressure1">
        <template #default="{ row: { pollution_lightning_pressure1 } }">
          {{ pollution_lightning_pressure1 }} V
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="安装位置 2">
      <el-table-column align="center" label="识别码2" prop="location2">
        <template #default="{ row: { location2 } }"> {{ location2 }}</template>
      </el-table-column>
      <el-table-column align="center" label="泄漏电流2" prop="leakage_current2">
        <template #default="{ row: { leakage_current2 } }"> {{ leakage_current2 }} mA</template>
      </el-table-column>
      <el-table-column align="center" label="污闪电压2" prop="pollution_lightning_pressure2">
        <template #default="{ row: { pollution_lightning_pressure2 } }">
          {{ pollution_lightning_pressure2 }} kV
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="安装位置 3">
      <el-table-column align="center" label="识别码3" prop="location3">
        <template #default="{ row: { location3 } }"> {{ location3 }}</template>
      </el-table-column>
      <el-table-column align="center" label="泄漏电流3" prop="leakage_current3">
        <template #default="{ row: { leakage_current3 } }"> {{ leakage_current3 }} mA</template>
      </el-table-column>
      <el-table-column align="center" label="污闪电压3" prop="pollution_lightning_pressure3">
        <template #default="{ row: { pollution_lightning_pressure3 } }">
          {{ pollution_lightning_pressure3 }} kV
        </template>
      </el-table-column>
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
