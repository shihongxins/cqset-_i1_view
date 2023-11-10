<script>
  import * as echarts from 'echarts/core';
  import { TooltipComponent, VisualMapComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import { Line3DChart } from 'echarts-gl/charts';
  import { Grid3DComponent } from 'echarts-gl/components';

  echarts.use([TooltipComponent, VisualMapComponent, Grid3DComponent, Line3DChart, CanvasRenderer]);

  export default {
    name: 'EchartLine3D',
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
      this.chart = echarts.init(this.$refs['echart-line-3d-container']);
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

<template>
  <div class="echart-line-3d-container" ref="echart-line-3d-container"></div>
</template>

<style lang="scss" scoped>
  .echart-line-3d-container {
    width: 100%;
    height: 100%;
  }
</style>
