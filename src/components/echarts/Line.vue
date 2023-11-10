<template>
  <div class="echart-line-container" ref="echart-line-container"></div>
</template>

<script>
  import * as echarts from 'echarts/core';
  import {
    TitleComponent,
    GridComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    VisualMapComponent,
  } from 'echarts/components';
  import { LineChart } from 'echarts/charts';
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  echarts.use([
    TitleComponent,
    GridComponent,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    VisualMapComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ]);

  export default {
    name: 'EchartLine',
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
      this.chart = echarts.init(this.$refs['echart-line-container']);
      this.chart.setOption(this.option, true);
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
  .echart-line-container {
    width: 100%;
    height: 100%;
  }
</style>
