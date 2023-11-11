<script>
  import dayjs from 'dayjs';
  import { APIWirelessTemperatureV2 } from '../../../../apis/jsl_byne/wirelesstemp';
  import { getResponseMessage, nativeFormat, validateResponseCode } from '@shihongxins/jsutils';

  export default {
    props: {
      device: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        tableData: [],
        tableLoading: false,
        datetime_range: [dayjs().startOf('month'), dayjs()],
        params: {
          uuid: '',
          alarm: -1, // -1 所有 0 未报警 1 报警
          start_date: dayjs().startOf('month').format('yyyy-MM-DD HH:mm:ss'),
          end_date: dayjs().startOf('month').format('yyyy-MM-DD HH:mm:ss'),
          keyword: '',
          page: 1,
          size: 10,
          sort: 'desc',
          total: 0,
        },
        searchDeviceOptionsLoading: false,
        deviceOptions: [],
      };
    },
    async created() {
      if (this.device.uuid) {
        this.params.uuid = this.device.uuid;
        await this.searchDeviceOptions(this.device.name);
      }
      this.getTableData();
    },
    methods: {
      // 获取设备列表
      async searchDeviceOptions(keyword = '') {
        this.deviceOptions = [];
        const reqData = {
          dept_id: 0,
          status: -1,
          keyword,
          page: 1,
          size: 10,
          sort: 'asc',
        };
        this.searchDeviceOptionsLoading = true;
        const [err, resData] = await APIWirelessTemperatureV2.device.list(reqData);
        this.searchDeviceOptionsLoading = false;
        if (!err && validateResponseCode(resData)) {
          this.deviceOptions = resData.data;
        }
      },
      // 具体数据加载
      async getTableData() {
        this.tableData = [];
        const reqData = Object.assign({}, this.params);
        // reqData.dept_id = reqData.dept_id ? [reqData.dept_id] : [];
        if (this.datetime_range && this.datetime_range.length) {
          reqData.start_date = nativeFormat(this.datetime_range[0]);
          reqData.end_date = nativeFormat(this.datetime_range[1]);
        }
        this.tableLoading = true;
        const [err, resData] = await APIWirelessTemperatureV2.log.list(reqData);
        this.tableLoading = false;
        if (err || !validateResponseCode(resData)) {
          return this.$message.error(`加载日志列表出错：${getResponseMessage(err || resData)}`);
        }
        this.tableData = [].concat(resData.data || []).map((log) => {
          log.status_desc = log.status ? '报警日志' : '正常日志';
          log.updated_at = nativeFormat(log.updated_at);
          return log;
        });
        this.params.total = resData.total || this.tableData.length;
      },
      // 查
      search() {
        this.params.page = 1;
        this.getTableData();
      },
      // 翻页
      jump(page) {
        this.params.page = page || 1;
        this.getTableData();
      },
      // 显示条数
      sizeChange(size) {
        this.params.size = size || 10;
        this.search();
      },
      // 重置查询条件
      resetSearch() {
        this.params = this.$options.data().params;
        this.search();
      },
    },
  };
</script>

<template>
  <div class="table_container">
    <div class="table_search">
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          placeholder="请选择设备"
          v-model="params.uuid"
          filterable
          remote
          :loading="searchDeviceOptionsLoading"
          :remote-method="searchDeviceOptions"
          @focus="searchDeviceOptions()"
          @change="search"
        >
          <el-option label="不限设备" value=""></el-option>
          <el-option
            v-for="device in deviceOptions"
            :key="device.uuid"
            :label="device.name"
            :value="device.uuid"
          >
          </el-option>
        </el-select>
      </div>
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          placeholder="请选择日志报警状态"
          v-model="params.alarm"
          @change="search"
        >
          <el-option label="不限状态" :value="-1"></el-option>
          <el-option label="正常日志" :value="0"></el-option>
          <el-option label="报警日志" :value="1"></el-option>
        </el-select>
      </div>
      <div class="date-time-picker-wrapper">
        <el-date-picker
          size="mini"
          popper-class="date-time-picker-dropdown-wrapper"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="datetime_range"
          :default-time="['00:00:00', '23:59:59']"
          @change="search"
        ></el-date-picker>
      </div>
      <el-input
        size="mini"
        style="width: 220px"
        type="text"
        prefix-icon="el-icon-search"
        placeholder="请输入内容，按 Enter 键搜索"
        v-model="params.keyword"
        @keyup.enter.native="search"
      />
      <el-button type="primary" size="mini" @click="search">搜索</el-button>
      <el-button type="primary" size="mini" plain @click="resetSearch">重置查询</el-button>
    </div>
    <div class="table_body table-wrapper">
      <el-table :data="tableData" height="100%" border size="mini" v-loading="tableLoading">
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column label="温度测量数据" align="center">
          <el-table-column prop="t1" label="1号线温度" align="center">
            <template #default="{ row }"> {{ row['t1'] }} ℃ </template>
          </el-table-column>
          <el-table-column prop="t2" label="2号线温度" align="center">
            <template #default="{ row }"> {{ row['t2'] }} ℃ </template>
          </el-table-column>
          <el-table-column prop="t3" label="3号线温度" align="center">
            <template #default="{ row }"> {{ row['t3'] }} ℃ </template>
          </el-table-column>
          <el-table-column prop="t4" label="4号线温度" align="center">
            <template #default="{ row }"> {{ row['t4'] }} ℃ </template>
          </el-table-column>
          <el-table-column prop="t5" label="5号线温度" align="center">
            <template #default="{ row }"> {{ row['t5'] }} ℃ </template>
          </el-table-column>
          <el-table-column prop="t6" label="6号线温度" align="center">
            <template #default="{ row }"> {{ row['t6'] }} ℃ </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="电压测量数据" align="center">
          <el-table-column prop="v1" label="1号线电压" align="center">
            <template #default="{ row }"> {{ row['v1'] }} V </template>
          </el-table-column>
          <el-table-column prop="v2" label="2号线电压" align="center">
            <template #default="{ row }"> {{ row['v2'] }} V </template>
          </el-table-column>
          <el-table-column prop="v3" label="3号线电压" align="center">
            <template #default="{ row }"> {{ row['v3'] }} V </template>
          </el-table-column>
          <el-table-column prop="v4" label="4号线电压" align="center">
            <template #default="{ row }"> {{ row['v4'] }} V </template>
          </el-table-column>
          <el-table-column prop="v5" label="5号线电压" align="center">
            <template #default="{ row }"> {{ row['v5'] }} V </template>
          </el-table-column>
          <el-table-column prop="v6" label="6号线电压" align="center">
            <template #default="{ row }"> {{ row['v6'] }} V </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间"></el-table-column>
      </el-table>
    </div>
    <div class="pager-wrapper">
      <el-pagination
        :current-page="params.page"
        @size-change="sizeChange"
        @current-change="jump"
        :page-sizes="[10, 20, 100, 500, 1000]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="params.total"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .table_container {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    .table_search {
      display: flex;
      align-items: center;
      > * {
        margin-right: 10px;
      }
    }
    .table_body {
      margin: 10px 0;
      flex: 1;
      overflow: hidden;
    }
  }
</style>
