<!-- 故障数据 -->
<script setup>
  import { APIGWI1 } from '../../../../apis/i1/gwi1';
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
        uuid: '',
        sort: 'desc',
        start_date: '',
        page: 1,
        size: 10,
      },
      params
    );
    reqData.uuid = params.uuid || params.cmd_id;
    reqData.start_date = nativeFormat(reqData.start_date, 'YYYY-MM-DD');
    let list = [];
    let total = 0;
    const res = await APIGWI1.fault_list(reqData);
    let { error, data } = res;
    if (!error && validateResponseCode(data)) {
      list = [].concat(data.data || []).map((log) => {
        log.timestamp = nativeFormat(log.timestamp || log.created_at);
        log.created_at = nativeFormat(log.created_at);
        log.updated_at = nativeFormat(log.updated_at);
        return log;
      });
      total = data.total || list.length;
    } else {
      error = new Error('获取 故障数据 数据出错：' + getResponseMessage(error || data));
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
    <el-table-column align="center" label="设备编码" prop="cmd_id" width="200"></el-table-column>
    <el-table-column align="center" label="采集时间" prop="timestamp" width="200"></el-table-column>
    <el-table-column
      align="center"
      label="记录时间"
      prop="created_at"
      width="200"
    ></el-table-column>
    <el-table-column
      align="center"
      label="更新时间"
      prop="updated_at"
      width="200"
    ></el-table-column>
    <el-table-column align="center" label="故障信息" prop="fault_desc"></el-table-column>
  </el-table>
</template>
