<template>
  <div class="echart-pie-container" ref="echart-pie-container"></div>
</template>

<script>
  import * as echarts from 'echarts/core';
  import {
    TitleComponent,
    TooltipComponent,
    DatasetComponent,
    LegendComponent,
  } from 'echarts/components';
  import { PieChart } from 'echarts/charts';
  import { LabelLayout } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([
    TitleComponent,
    TooltipComponent,
    DatasetComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
  ]);
  export default {
    name: 'EchartPie',
    data() {
      return {
        chart: null,
      };
    },
    props: {
      option: {
        type: Object,
        required: true,
        default: () => ({}),
      },
    },
    watch: {
      option: {
        deep: true,
        handler: function (newOption, oldOption) {
          if (this.chart) {
            try {
              this.chart.setOption(newOption);
            } catch (error) {
              console.error(error);
              this.chart.setOption(oldOption);
            }
          }
        },
      },
    },
    mounted() {
      this.chart = echarts.init(this.$refs['echart-pie-container']);
      this.chart.setOption(this.option);
      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      resize() {
        this.chart && this.chart.resize();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .echart-pie-container {
    width: 100%;
    height: 100%;
  }
</style>
