<template>
  <el-drawer
    size="70%"
    :visible.sync="drawerVisible"
    :destroy-on-close="true"
    @closed="clearInstance"
  >
    <p class="titleText" slot="title">{{ deviceName }} 的月度图表分析</p>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-date-picker
          style="width: 80%; margin-left: 20px"
          v-model="params.date"
          type="month"
          placeholder="选择月份"
          format="yyyy-MM"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" plain @click="queryParams">查询</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div id="charts"></div>
  </el-drawer>
</template>

<script>
  /* 按需引入echarts */
  // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
  import * as echarts from 'echarts/core';
  // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
  import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
  } from 'echarts/components';
  // 引入折线图表，图表后缀都为 Chart
  import { LineChart } from 'echarts/charts';
  // 标签自动布局，全局过渡动画等特性
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  import { CanvasRenderer } from 'echarts/renderers';
  // 注册必须的组件
  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    LabelLayout,
    UniversalTransition,
  ]);
  import moment from 'moment';
  export default {
    components: {},
    props: {
      chartList: {
        type: Object,
        required: true,
        default: () => {},
      },
      legendData: {
        type: Array,
        required: true,
        default: () => [],
      },
      deviceName: {
        type: String,
        default: () => '--',
      },
    },
    data() {
      return {
        myChart: null,
        loading: false,
        drawerVisible: false,
        params: {
          date: moment().format('YYYY-MM'),
        },
        options: {
          // 提示框组件
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              },
            },
          },
          // 图例组件
          legend: {
            data: [], //this.legendData
          },
          // 直角坐标系内绘图网格
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          // 直角坐标系 grid 中的 x 轴
          xAxis: [
            {
              name: '日期',
              type: 'category',
              boundaryGap: false,
              data: [], //this.chartList.xData,
            },
          ],
          yAxis: [
            {
              name: '平均值',
              type: 'value',
            },
          ],
          series: [
            {
              name: '', //this.legendData[0],
              type: 'line',
              stack: 'Total',
              smooth: true, // 是否平滑曲线显示
              symbolSize: 8, //标记大小
              areaStyle: {},
              emphasis: {
                focus: 'series',
              },
              data: [], //this.chartList.yData,
            },
          ],
        },
      };
    },
    //监控data中的数据变化
    watch: {
      chartList: {
        handler(newVal) {
          if (this.myChart) {
            if (newVal.xData.length > 0 && newVal.yData.length > 0) {
              this.mySetOption(newVal);
            }
          }
        },
        deep: true,
        // immediate: true,
      },
    },
    created() {},
    mounted() {},
    beforeDestroy() {
      if (this.myChart) this.myChart = null;
    },
    methods: {
      open() {
        this.params.date = moment().format('YYYY-MM');
        this.initEchart();
        this.drawerVisible = true;
      },
      queryParams() {
        this.$emit('getChartList', this.params.date);
      },
      async initEchart() {
        await this.$nextTick();
        this.myChart = echarts.init(document.getElementById('charts'));
        this.mySetOption(this.chartList);
      },
      mySetOption(val) {
        this.options.xAxis[0].data = val.xData;
        this.options.series[0].data = val.yData;
        this.options.legend.data = this.legendData;
        this.options.series[0].name = this.legendData[0];
        this.options && this.myChart.setOption(this.options, true);
      },
      // 图表容器被销毁之后,销毁echart的实例释放资源
      clearInstance() {
        if (this.myChart) this.myChart.dispose();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .el-drawer {
    .titleText {
      color: #000;
      font-size: 20px;
      font-weight: 600;
    }
    .el-row {
      width: 90%;
    }
    #charts {
      width: 95%;
      height: 85%;
      min-height: 500px;
    }
  }
</style>
