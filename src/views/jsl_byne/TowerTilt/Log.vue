<script>
  import { useGetLineList } from '../../../composables/useGetLineList';
  import dayjs from 'dayjs';
  import { APITowerTilt } from '../../../apis/jsl_byne/towertilt';
  import { validateResponseCode, getResponseMessage } from '@shihongxins/jsutils';

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
      return {
        getLineList,
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
          dept_id: 0,
          line_id: 0,
          start_date: '',
          end_date: '',
          alarm: -1,
          keyword: '',
          page: 1,
          size: 10,
          sort: 'desc',
          total: 0,
        },
      };
    },
    computed: {
      datePickerType() {
        let type = 'datetimerange';
        let format = 'yyyy-MM-dd HH:mm:ss';
        if (this.params.type == 'day') {
          type = 'monthrange';
          format = 'yyyy-MM';
        }
        if (this.params.type == 'month') {
          type = 'year';
          format = 'yyyy';
        }
        return { type, format };
      },
    },
    async created() {
      if (this.device.uuid) {
        this.params.line_id = this.device.line_id;
        await this.getLineList.search(this.device.line_name);
      }
      this.search();
    },
    methods: {
      // 具体数据加载
      async getTableData() {
        this.tableLoading = true;
        try {
          if (!(this.datetime_range && this.datetime_range.length === 2)) {
            this.datetime_range = [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()];
          }
          this.params.start_date = dayjs(this.datetime_range[0]).format('YYYY-MM-DD HH:mm:ss');
          this.params.end_date = dayjs(this.datetime_range[1]).format('YYYY-MM-DD HH:mm:ss');
          const reqData = Object.assign({}, this.params);
          reqData.dept_id = reqData.dept_id ? [reqData.dept_id] : [];
          reqData.line_id = reqData.line_id ? [reqData.line_id] : [];
          const [err, resData] = await APITowerTilt.log_list(reqData);
          if (!err && validateResponseCode(resData)) {
            this.params.total = resData.total || resData.data.length;
            this.tableData = resData.data;
            this.tableLoading = false;
          } else {
            throw new Error(getResponseMessage(err || resData));
          }
        } catch (error) {
          this.tableLoading = false;
          this.tableData = [];
          this.$message.error(`获取表格数据失败！${error.message}`);
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
      <div class="date-time-picker-wrapper">
        <el-date-picker
          size="mini"
          popper-class="date-time-picker-dropdown-wrapper"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="datetime_range"
          @change="search"
        >
        </el-date-picker>
      </div>
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          size="mini"
          style="width: 100px"
          v-model="params.alarm"
          placeholder="请选择报警类型"
          @change="search"
        >
          <el-option label="所有日志" :value="-1"></el-option>
          <el-option label="正常日志" :value="0"></el-option>
          <el-option label="报警日志" :value="1"></el-option>
        </el-select>
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
        <el-table-column prop="uuid" label="设备编号" width="120px"></el-table-column>
        <el-table-column prop="x" label="顺线倾斜角"></el-table-column>
        <el-table-column prop="x_inclination" label="顺线倾斜度"></el-table-column>
        <el-table-column prop="x_offset" label="顺线偏移量"></el-table-column>
        <el-table-column prop="y" label="横向倾斜角"></el-table-column>
        <el-table-column prop="y_inclination" label="横向倾斜度"></el-table-column>
        <el-table-column prop="y_offset" label="横向偏移量"></el-table-column>
        <el-table-column prop="total_inclination" label="总体倾斜度"></el-table-column>
        <el-table-column prop="total_offset" label="塔顶部位移值"></el-table-column>
        <el-table-column prop="alarm" label="是否报警" width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.alarm" type="danger">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="记录时间" width="100"></el-table-column>
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
