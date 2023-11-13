<script setup>
  import { ref, reactive, computed } from 'vue';
  import { Message } from 'element-ui';
  import dayjs from 'dayjs';
  import { validateResponseCode, getResponseMessage } from '@shihongxins/jsutils';
  import { APIDisaster } from '../../../apis/jsl_byne/disaster';
  import EchartsLine from '../../../components/echarts/Line.vue';

  const props = defineProps({
    device: {
      required: true,
      type: Object,
      default: () => ({}),
    },
  });

  const datetimeRange = ref([]);
  const params = reactive({
    dept_id: 0, //接口需要数组 下面处理
    /**
     * @type {'Mysql'|'MongoDb'}
     */
    source: 'Mysql',
    uuid: '',
    sid: -1, // -1 查所有
    alarm: -1, // 报警类型： -1 所有 0 正常 1 报警
    type: '', // '' 基础 , 'initial' 初始值 , 'day' 日平均 , 'month' 月平均
    start_date: '',
    end_date: '',
    page: 1,
    size: 10000,
    sort: 'asc',
    keyword: '',
  });

  const datetimePickerType = computed(() => {
    let type = 'datetimerange';
    let format = 'yyyy-MM-dd HH:mm:ss';
    if (params.type === 'day') {
      type = 'monthrange';
      format = 'yyyy-MM';
    }
    if (params.type === 'month') {
      type = 'year';
      format = 'yyyy';
    }
    return { type, format };
  });

  const options = reactive({
    textStyle: {
      color: '#fff',
      textShadowColor: '#fff',
    },
    title: {
      text: '月度平均数据',
      textStyle: {
        color: '#fff',
        textShadowColor: '#fff',
      },
    },
    legend: {
      textStyle: {
        color: '#fff',
        textShadowColor: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 60,
      right: 50,
      bottom: 10,
      left: 10,
      containLabel: true,
    },
    dataset: {
      dimensions: ['created_time', 'warning_value', 'deviation_x', 'deviation_y', 'deviation_z'],
      source: [],
    },
    xAxis: {
      type: 'category',
      name: '日期',
    },
    yAxis: {
      type: 'value',
      name: '数值',
    },
    series: [
      { type: 'line', smooth: true, name: '报警值' },
      { type: 'line', smooth: true, name: 'X偏差值' },
      { type: 'line', smooth: true, name: 'Y偏差值' },
      { type: 'line', smooth: true, name: 'Z偏差值' },
    ],
  });

  const queryFun = async () => {
    if (
      props.device &&
      ((props.device.source === 'Mysql' && props.device.uuid) ||
        (props.device.source === 'MongoDB' && props.device.sid))
    ) {
      void 0;
    } else {
      return Message.warning('未知设备类型及其编号');
    }
    if (!params.start_date) {
      params.start_date = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    }
    if (!params.end_date) {
      params.end_date = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      params.type !== 'month' &&
      datetimePickerType.value.type !== 'year' &&
      datetimeRange.value &&
      datetimeRange.value.length === 2
    ) {
      params.start_date = dayjs(datetimeRange.value[0]).format('YYYY-MM-DD HH:mm:ss');
      params.end_date = dayjs(datetimeRange.value[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    const rangeType = {
      initial: 'day',
      day: 'month',
      month: 'year',
    };
    params.start_date = dayjs(params.start_date);
    params.end_date = dayjs(params.end_date);
    if (rangeType[params.type]) {
      params.start_date = params.start_date.startOf(rangeType[params.type]);
      params.end_date = params.end_date.endOf(rangeType[params.type]);
    }
    datetimeRange.value = [params.start_date.toDate(), params.end_date.toDate()];
    params.start_date = params.start_date.format('YYYY-MM-DD HH:mm:ss');
    params.end_date = params.end_date.format('YYYY-MM-DD HH:mm:ss');

    const reqData = {
      ...params,
      dept_id: props.device.dept_id,
      source: props.device.source,
      uuid: props.device.uuid,
      sid: props.device.sid,
    };
    reqData.dept_id = [reqData.dept_id].filter((id) => id > 0);
    const res = await APIDisaster.analysis(reqData).catch((reason) => reason);
    const { error: err, data: resData } = res;
    if (err || !validateResponseCode(resData)) {
      Message.error('查询设备统计分析数据出错：' + getResponseMessage(err || resData || res));
    }
    options.dataset.source = [].concat(resData.data || []).map((log) => {
      for (const key in log) {
        if (Object.hasOwnProperty.call(log, key)) {
          if (/_time$/.test(key)) {
            log[key] = dayjs(log[key]).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      }
      return log;
    });
  };

  queryFun();
</script>

<template>
  <div class="chart-layout">
    <h2 class="chart-title">
      {{ device.tower_name }} / {{ device.sname }} / {{ device.uuid || device.sid }}
    </h2>
    <div class="chart-search">
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          v-model="params.alarm"
          placeholder="请选择报警类型"
          @change="queryFun"
        >
          <el-option label="所有日志" :value="-1"></el-option>
          <el-option label="正常日志" :value="0"></el-option>
          <el-option label="报警日志" :value="1"></el-option>
        </el-select>
      </div>
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          v-model="params.type"
          placeholder="请选择日志比较类型"
          @change="queryFun"
        >
          <el-option label="基础" :value="''"></el-option>
          <el-option label="初始值" value="initial"></el-option>
          <el-option label="日平均" value="day"></el-option>
          <el-option label="月平均" value="month"></el-option>
        </el-select>
      </div>
      <div class="date-time-picker-wrapper">
        <el-date-picker
          v-if="datetimePickerType.type != 'year'"
          size="mini"
          v-model="datetimeRange"
          :type="datetimePickerType.type"
          :format="datetimePickerType.format"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
          @change="queryFun"
        >
        </el-date-picker>
        <template v-else>
          <el-date-picker
            v-model="params.start_date"
            size="mini"
            :type="datetimePickerType.type"
            :format="datetimePickerType.format"
            :value-format="'yyyy-MM-DD HH:mm:ss'"
            placeholder="开始年份"
            @change="queryFun"
          >
          </el-date-picker>
          <span style="line-height: 100%">-</span>
          <el-date-picker
            size="mini"
            v-model="params.end_date"
            :type="datetimePickerType.type"
            :format="datetimePickerType.format"
            :value-format="'yyyy-MM-DD HH:mm:ss'"
            placeholder="结束年份"
            @change="queryFun"
          >
          </el-date-picker>
        </template>
      </div>
      <el-button size="mini" type="primary" @click="queryFun">搜索</el-button>
    </div>
    <div class="chart-wrapper">
      <EchartsLine :option="options"></EchartsLine>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .chart-layout {
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-flow: column;
    .chart-title {
      @apply text-2xl color-content;
    }
    .chart-search {
      @apply flex items-center;
      > * ~ * {
        @apply ml-4;
      }
    }
    .chart-wrapper {
      @apply flex-1 overflow-hidden relative;
    }
  }
</style>
