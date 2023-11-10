<script>
  import { useGetLineList } from '../../../composables/useGetLineList';
  import { useGetTowerList } from '../../../composables/useGetTowerList';
  import dayjs from 'dayjs';
  import { APITowerTilt } from '../../../apis/jsl_byne/towertilt';
  import { validateResponseCode, nativeFormat, getResponseMessage } from '@shihongxins/jsutils';

  export default {
    props: {
      device: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      const getLineList = useGetLineList();
      Object.assign(getLineList.addtionalParams, {
        type_name: 'sensor',
        sensor_type: 'tower_title',
      });
      const getTowerList = useGetTowerList();
      Object.assign(getTowerList.addtionalParams, {
        type_name: 'sensor',
        sensor_type: 'tower_title',
      });
      return {
        getLineList,
        getTowerList,
        sensorListLoading: false,
        sensorList: [],
        tableData: [],
        tableLoading: false,
        // 设备类型搜索：搜索线路和杆塔时用到
        deviceTypeSearchParams: {
          type_name: 'sensor',
          sensor_type: 'tower_title',
        },
        datetime_range: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
        params: {
          // 获取列表请求参数
          dept_id: 0, //接口要数组 请求时处理
          line_id: 0,
          tower_id: 0,
          start: 0,
          end: 0,
          uuid: '',
          keyword: '',
          page: 1,
          size: 10,
          sort: 'desc',
          total: 0,
        },
      };
    },
    async created() {
      if (this.device.uuid) {
        this.params.line_id = this.device.line_id;
        this.params.tower_id = this.device.tower_id;
        this.params.uuid = this.device.uuid;
        await this.getLineList.search(this.device.line_name);
        await this.getTowerList.search(this.device.tower_name);
      }
      this.search();
    },
    methods: {
      // 获取传感器列表
      async getSensorListData(keyword = '') {
        this.sensorList = [];
        this.sensorListLoading = false;
        const reqData = {
          dept_id: this.params.dept_id,
          line_id: this.params.line_id,
          keyword,
          status: 'ALL',
          page: 1,
          size: 1000,
          sort: 'asc',
        };
        this.sensorListLoading = true;
        const [err, resData] = await APITowerTilt.list(reqData);
        this.sensorListLoading = false;
        if (!err && validateResponseCode(resData)) {
          this.sensorList = resData.data;
        }
      },
      // 具体数据加载
      async getTableData() {
        try {
          this.tableLoading = true;
          const reqData = Object.assign({}, this.params);
          if (this.datetime_range && this.datetime_range.length === 2) {
            reqData.start = dayjs(this.datetime_range[0] || '').valueOf();
            reqData.end = dayjs(this.datetime_range[1] || '').valueOf();
          }
          reqData.dept_id = reqData.dept_id ? [reqData.dept_id] : [];
          const [err, resData] = await APITowerTilt.alarm_data(reqData);
          if (!err && validateResponseCode(resData)) {
            this.params.total = resData.total || resData.data.length;
            this.tableData = resData.data.map((row) => {
              row.created_at = nativeFormat(row.created_at);
              row.clear_time = nativeFormat(row.clear_time);
              if (row.clear_pics) {
                row._clear_pics = row.clear_pics.split(',').map((url) => {
                  if (url) {
                    url = window.origin + '/' + url;
                  }
                  return url;
                });
              }
              row.data = [
                {
                  x: row.x,
                  y: row.y,
                  z: row.z,
                  x_inclination: row.x_inclination,
                  x_offset: row.x_offset,
                  y_inclination: row.y_inclination,
                  y_offset: row.y_offset,
                  total_inclination: row.total_inclination,
                  total_offset: row.total_offset,
                },
              ];
              return row;
            });
            this.tableLoading = false;
          } else {
            throw new Error(getResponseMessage(err || resData));
          }
        } catch (error) {
          this.tableLoading = false;
          this.$message.error(`获取表格数据失败！${error && error.message}`);
        }
      },
      // 查
      search() {
        this.params.page = 1;
        this.getTableData();
      },
      // 重置查询条件
      resetSearch() {
        this.params = this.$options.data().params;
        this.search();
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
          placeholder="请选择所属线路"
          v-model="params.line_id"
          filterable
          remote
          :loading="getLineList.loading"
          :remote-method="getLineList.search"
          @focus="getLineList.search()"
          @change="search()"
        >
          <el-option label="不限线路" :value="0"></el-option>
          <el-option
            v-for="line in getLineList.list"
            :key="line.id"
            :label="line.name"
            :value="line.id"
          ></el-option>
        </el-select>
      </div>
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          placeholder="请选择所属杆塔"
          v-model="params.tower_id"
          filterable
          remote
          :loading="getTowerList.loading"
          :remote-method="getTowerList.search"
          @focus="getTowerList.search()"
          @change="search()"
        >
          <el-option label="不限杆塔" :value="0"></el-option>
          <el-option
            v-for="tower in getTowerList.list"
            :key="tower.id"
            :label="tower.name"
            :value="tower.id"
          ></el-option>
        </el-select>
      </div>
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          placeholder="请选择传感器设备"
          v-model="params.uuid"
          filterable
          remote
          :remote-method="getSensorListData"
          @focus="getSensorListData('')"
          :loading="sensorListLoading"
          @change="search"
        >
          <el-option label="所有传感器" :value="''"></el-option>
          <el-option
            v-for="sensor in sensorList"
            :key="sensor.uuid"
            :label="sensor.name"
            :value="sensor.uuid"
          >
          </el-option>
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
        style="width: 220px"
        size="mini"
        prefix-icon="el-icon-search"
        placeholder="请输入设备名，按 Enter 键搜索"
        v-model="params.keyword"
        @keyup.enter.native="search"
      />
      <el-button size="mini" type="primary" @click="search">查询</el-button>
      <el-button size="mini" type="primary" plain @click="resetSearch">重置查询</el-button>
    </div>
    <div class="table_body table-wrapper">
      <el-table :data="tableData" height="100%" border size="mini" v-loading="tableLoading">
        <el-table-column prop="line_name" label="所属线路"></el-table-column>
        <el-table-column prop="tower_name" label="所属杆塔"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="uuid" label="设备编号" width="200"></el-table-column>
        <el-table-column prop="created_at" label="记录时间"></el-table-column>
        <el-table-column prop="is_alarm" label="是否报警" width="80" align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="warning" v-if="scope.row.is_alarm"> 报警 </el-tag>
            <el-tag size="small" type="info" v-else>正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="报警描述"></el-table-column>
        <el-table-column prop="data" label="数据详情" width="120" align="center">
          <template slot-scope="scope">
            <el-popover placement="left" trigger="hover" width="500px">
              <p class="p-text"><b>顺线倾斜角：</b>{{ scope.row.data[0].x }}</p>
              <p class="p-text"><b>顺线倾斜度：</b>{{ scope.row.data[0].x_inclination }}</p>
              <p class="p-text"><b>顺线偏移量：</b>{{ scope.row.data[0].x_offset }}</p>
              <p class="p-text"><b>横向倾斜角：</b>{{ scope.row.data[0].y }}</p>
              <p class="p-text"><b>横向倾斜度：</b>{{ scope.row.data[0].y_inclination }}</p>
              <p class="p-text"><b>横向偏移量：</b>{{ scope.row.data[0].y_offset }}</p>
              <p class="p-text"><b>总体倾斜度：</b>{{ scope.row.data[0].total_inclination }}</p>
              <p class="p-text"><b>塔顶部位移值：</b>{{ scope.row.data[0].total_offset }}</p>
              <el-button slot="reference" size="mini">倾斜角度</el-button>
            </el-popover>
          </template>
        </el-table-column>
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
