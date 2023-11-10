<script>
  import dayjs from 'dayjs';
  import { APIDisaster } from '../../../apis/jsl_byne/disaster';
  import { validateResponseCode, getResponseMessage } from '@shihongxins/jsutils';

  export default {
    data() {
      return {
        tableData: [],
        tableLoading: false,
        params: {
          // 获取列表请求参数
          /**
           * @type {'Mysql'|'MongoDb'}
           */
          source: 'Mysql',
          dept_id: 0, //接口需要数组 下面处理
          sid: -1, // -1 查所有
          alarm: -1, // 报警类型： -1 所有 0 正常 1 报警
          page: 1,
          size: 10,
          sort: 'desc',
          keyword: '',
          type: '',
          start_date: '',
          end_date: '',
          timeRange: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
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
    mounted() {
      this.search();
    },
    methods: {
      parseSeconds(sec) {
        try {
          let d = new Date();
          sec = (sec - d.getTimezoneOffset() * 60) * 1000;
          d.setTime(sec);
          return d
            .toISOString()
            .replace(/T|Z|(\..+)/gim, ' ')
            .replace(/\s$/, '');
        } catch (error) {
          return sec;
        }
      },
      // 具体数据加载
      async getTableData() {
        this.tableLoading = true;
        try {
          const reqData = Object.assign({}, this.params);
          reqData.dept_id = reqData.dept_id ? [reqData.dept_id] : [];
          const [err, resData] = await APIDisaster.logs(reqData);
          if (!err && validateResponseCode(resData)) {
            this.params.total = resData.total || resData.data.length;
            this.tableData = resData.data.map((row) => {
              row.created_time = this.parseSeconds(row.created_time);
              row.start_time = this.parseSeconds(row.start_time);
              row.end_time = this.parseSeconds(row.end_time);
              return row;
            });
            this.tableLoading = false;
          } else {
            throw new Error('查询日志出错：' + getResponseMessage(err || resData));
          }
        } catch (error) {
          this.tableLoading = false;
          this.tableData = [];
          this.$message.error(`获取表格数据失败！${error.message}`);
        }
      },
      // 查
      search() {
        try {
          // 开始时间或结束时间不传，默认查当月
          if (!this.params.start_date) {
            this.params.start_date = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
          }
          if (!this.params.end_date) {
            this.params.end_date = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
          }
          // 按时间查询初始值或日平均
          if (
            this.params.type !== 'month' &&
            this.params.timeRange &&
            this.params.timeRange.length == 2
          ) {
            this.params.start_date = dayjs(this.params.timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
            this.params.end_date = dayjs(this.params.timeRange[1]).format('YYYY-MM-DD HH:mm:ss');
          }
          // 开始时间大于结束时间，交换位置
          if (this.params.start_date.localeCompare(this.params.end_date) > 0) {
            const { start_date, end_date } = this.params;
            this.params.start_date = end_date;
            this.params.end_date = start_date;
          }
          // 查询初始值，选中的一天的开始与结束
          if (this.params.type === 'initial') {
            this.params.start_date = dayjs(this.params.start_date || undefined)
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:ss');
            this.params.end_date = dayjs(this.params.end_date || undefined)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:ss');
          }
          // 查询日平均时
          if (this.params.type === 'day') {
            this.params.start_date = dayjs(this.params.start_date || undefined)
              .startOf('month')
              .format('YYYY-MM-DD HH:mm:ss');
            this.params.end_date = dayjs(this.params.end_date || undefined)
              .endOf('month')
              .format('YYYY-MM-DD HH:mm:ss');
          }
          // 按年份查询月平均，查询参数截取年份
          if (this.params.type === 'month') {
            this.params.start_date = dayjs(this.params.start_date || undefined)
              .startOf('year')
              .format('YYYY-MM-DD HH:mm:ss');
            this.params.end_date = dayjs(this.params.end_date || undefined)
              .endOf('year')
              .format('YYYY-MM-DD HH:mm:ss');
          }
          // 查询普通/初始值时，格式化时间
          this.params.start_date = dayjs(this.params.start_date || undefined).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          this.params.end_date = dayjs(this.params.end_date || undefined).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          this.params.timeRange = [
            dayjs(this.params.start_date).toDate(),
            dayjs(this.params.end_date).toDate(),
          ];

          this.params.page = 1;
          this.getTableData();
        } catch (error) {
          this.$message.error(error && error.message);
        }
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
          popper-class="select-dropdown-wrapper"
          size="mini"
          style="width: 100px"
          v-model="params.source"
          @change="search"
        >
          <el-option label="新版设备" value="Mysql"></el-option>
          <el-option label="旧版设备" value="MongoDb"></el-option>
        </el-select>
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
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          size="mini"
          style="width: 100px"
          v-model="params.type"
          placeholder="请选择日志比较类型"
          @change="search"
        >
          <el-option label="基础" :value="''"></el-option>
          <el-option label="初始值" value="initial"></el-option>
          <el-option label="日平均" value="day"></el-option>
          <el-option label="月平均" value="month"></el-option>
        </el-select>
      </div>
      <el-date-picker
        v-if="datePickerType.type != 'year'"
        size="mini"
        v-model="params.timeRange"
        :type="datePickerType.type"
        :format="datePickerType.format"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :default-time="['00:00:00', '23:59:59']"
        @change="search"
      >
      </el-date-picker>
      <template v-else>
        <el-date-picker
          v-model="params.start_date"
          size="mini"
          :type="datePickerType.type"
          :format="datePickerType.format"
          :value-format="'yyyy-MM-DD HH:mm:ss'"
          placeholder="开始年份"
          @change="search"
        >
        </el-date-picker>
        <span style="line-height: 100%">-</span>
        <el-date-picker
          size="mini"
          v-model="params.end_date"
          :type="datePickerType.type"
          :format="datePickerType.format"
          :value-format="'yyyy-MM-DD HH:mm:ss'"
          placeholder="结束年份"
          @change="search"
        >
        </el-date-picker>
      </template>
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
        <!-- <el-table-column prop="sid" label="站点SID"></el-table-column> -->
        <el-table-column prop="sname" label="设备名称"></el-table-column>
        <el-table-column prop="dept_name" label="所属部门"></el-table-column>
        <el-table-column prop="area_name" label="所属区域"></el-table-column>
        <el-table-column prop="line_name" label="所属线路"></el-table-column>
        <el-table-column prop="tower_name" label="所属杆塔"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 'BASE'">基站</span>
            <span v-if="scope.row.type == 'ROVER'">移动站</span>
          </template>
        </el-table-column>
        <el-table-column prop="lon" label="经纬度">
          <template slot-scope="scope">
            {{ scope.row.lon + ', ' + scope.row.lat }}
          </template>
        </el-table-column>
        <!--
      <el-table-column width="150px" show-overflow-tooltip prop="base_x" label="X值"></el-table-column>
      <el-table-column width="150px" show-overflow-tooltip prop="base_y" label="Y值"></el-table-column>
      <el-table-column width="150px" show-overflow-tooltip prop="base_z" label="Z值"></el-table-column>
      -->
        <el-table-column
          width="150px"
          show-overflow-tooltip
          prop="deviation_x"
          label="X偏差值"
        ></el-table-column>
        <el-table-column
          width="150px"
          show-overflow-tooltip
          prop="deviation_y"
          label="Y偏差值"
        ></el-table-column>
        <el-table-column
          width="150px"
          show-overflow-tooltip
          prop="deviation_z"
          label="Z偏差值"
        ></el-table-column>
        <!-- <el-table-column prop="gnss_status" label="WCS 状态"></el-table-column> -->
        <el-table-column prop="warning" label="报警状态">
          <template slot-scope="scope">
            <el-tag size="mini" type="success" v-if="scope.row.warning == 0">正常</el-tag>
            <el-tag size="mini" type="warning" v-else>报警</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="created_time" label="创建日期"></el-table-column>
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
