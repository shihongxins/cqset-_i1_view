<template>
  <div class="chart-layout">
    <div class="chart-search">
      <div class="select-wrapper">
        <el-select
          size="mini"
          popper-class="select-dropdown-wrapper"
          placeholder="请选择所属线路"
          v-model="params.line_id_month"
          filterable
          remote
          :loading="getLineList.loading"
          :remote-method="getLineList.search"
          @focus="getLineList.search()"
          @change="getHistoryData"
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
          type="month"
          v-model="month"
          @change="getDeptAnalysisData"
        ></el-date-picker>
      </div>

      <el-button size="mini" type="primary" plain @click="getDeptAnalysisData"> 搜索 </el-button>
    </div>
    <div class="chart-container">
      <div class="chart-history">
        <EchartsLine :option="historyChartOption" ref="historyChart"></EchartsLine>
      </div>
      <div class="chart-online">
        <EchartsPie :option="onlineChartOption"></EchartsPie>
      </div>
      <div class="chart-analysis">
        <EchartsLine :option="deptAnalysisChartOption"></EchartsLine>
      </div>
    </div>
  </div>
</template>

<script>
  const icons = {
    line: 'path://M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z',
    angle:
      'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABDCAYAAADHyrhzAAAABmJLR0QA/wD/AP+gvaeTAAAIu0lEQVR4nO2bf4wcZRnHP8/M7u1SlNpCKVDQS7P0dma214ajBozAIVED8lNobP0BBtHwI/hHLYGghEBMCEFEjUJjSSRIouSAaARsDaggP0rl7HHd2dm9Xo6KQNpaC1SP3vV25/GPmb3Obff2tvRutoT7/HMzz/O+8z7zvXfeed533oVZxhGAbDa7xDRkU8S+yS14F8x048uWLFlUThoXiBodqloGBhOVyh9fGxh4q5n6mUzmmFQqcZkoXT6SBN0hos+4buklQOtUkZxlXYtwjaLHC/KymJVbtm4dGIJQjFwuZ6lfKUQqveAWvLMO92Yno7u7O7Fr1467BPku0Fbj3o/wcHrf6NreoaH3JrtGzrIuU+FBYH6tT+B5DPPr+Xz+X1G741i3odwsyh0V2GYYXA8sFzGX5vP5ncZ03NwhYuzetbNHkLUEQuxBWS/IHQI9gIFyzWg69YLjOAfdKIDjZC9Sgx4CIfYorAO5E2QjgMLZ6vt/6lq8eO6BOk4byvcRvSXvefd4nve74eF9F6PsU63cCJCY8VuvwbbtGxS9NDiTF8fK5UsHBgZ2V/25XMfp6hsbFHLg3w18O1o/k8mkUFkHmMAAYpxTcN0dVb9jWasweATV7EgqdTuwBsAslxdVTCOlavy9Wnb79u0jOdvKoywBiLtnGCJ6c3Cou2qFAMjnS68qcn1QhKsdx1ke9adSiSuBkwAQ/1o3IgSA63m/VdVfBH6uW7p06TyAjlLpDYT3RPXz1bKO48xX+LQq/RCzGLZtL0NZFAQq62uFqFIoFB5D+DdgoPqNCU41Vgf1Kblu6S/16qvKz8PDtO+PXQLQAxV81iLc7jjW/Y6TXYP6fwPZOzo29jOIv2dkIgG/2KCcj+rWsORnq8aVYIKuCOpTVwgAz/O2AW8HV5Luqt31vAcRvRCV41HjyygbEVkxODi4F2IeM0T8OaiEx/LfhmWRkfDduLhqc207K+jHAAyl2LgxtqGchKgdNbtucSOwsV6VmHuG+U71SFVPmqLwJ8O/nyBMAQzDXxDxv9Gosqi+GR5+qtnoYhUjMTbWe+BML5+snGVZpypU/6OJTCbzcQBV85hIsf9N0Vzol6ObjS9WMV4bGHhL4HkAgZWOk/1qbZn29va0Ab+MxpZMJo8GENVxMXyRkUZt6QH/UYQ9aypizzNUjJuCUZw2VH5t29Z5II+JyH+gYuHLGoROgXyQa0Aymdwb1PXN6phjGH6lUTuiamigQYX6qflBxJ6Buq67WZQrgVHAELha0KdR/xVUHkLoRLgfZH1Ypdzf3z8cHo8/GqpmulE7qlL17202tlak4+Q971FFuhAe5cANjqL8FdGLXde7QeHY0P5utZ74Mn5jvu9Hx4+DUCFMxWXS+U0tsT8mVQqFggusAuhavHhu79DQXqLdWTUX9HJ9vWoqq24zZfzVfEqj64twCgrC+FtlSlrSM2oJZ6fjQnR3dycQzgZA5NWqvVgs/pPxnjQxf4iyEkwUC8BHNzcbxxEhRi27d+78InAcgPg8FXEp8CyAwHlM8pbIW9YKgvwEw+DlZtuNXQzHzvY4trXHcaxX67WfyWRSCHcGZzJked6GCQVEHw2PTrVt+4p6bZhCOBnk7ZGR8lP1ytQj/p6h8jgwD6UrZ2d/0t7ePv5W6OzsPD7dlnxC4TQAhTU9watxnAULTughnGWK6Hrbts+r+rq7uxOOY92tECwRCD8aHBwcbTa0Vqx0ieNYv0H5Sni+A9gCkgY9EwjEUW5zPe+H9S5gWdZphvAs4aOA0IvyJmgXyMlBKd1gF4oX1orZiFaMGTo8vO+bKPcBI8AJwPmg5xIIMSiGXj6ZEACe5/3DV84CXgiuSBdwSSjECMp9w++PXHYoQkCL1kCrOI4zX3z/TDV0ETBqVMhvLRa3AH6z17As61QRWS6qc3142zCMTa7r7vkg8bQszwAIg256gKtHuHaxbTriOSJfra1iVowIs2JEmBUjwqwYEWbFiDArRoRZMSIkAHzfb584F9YVjmMVUX0dkZL4lER1c7ZY7DvUFPfDRDUd/5L6lSebKP+OwHMq+vtyWR8vlUoNPwR92DjUx2SewqWo/CphGjtydvYRy7LOmJHIWsDhjBlzFPmaIbzs2NYzjtNx7rRF1SJMgIULF6ZV/evGrcoWH1YJvIRBSWAfwolAcpLrLAa5auGCBcuPPW7Bpt27dze9In0k0fQUPpPJpI5KJM7wDeMK0FWEa5R1GFb09kKh+GOa/HhzpPCB1jMcx2kDLgb/lnBhpd6Fn95frlw12R6MI5EPNGa4rrvfdd3HXNc7HTHOR9haW0bhgmTC2OI4zrLDDzMeDjvpcl13Qzo9p0vRtRz0ZVxOBv+5pdnsOYfbThxMSwba29s7VigU7zUr/umgr01wKnN9QzZYljXj+0oPl2lNx/tLpdLw+yNngDxU40obQk8ul/3MdLY33Uz73GT79u0jbqFwtSB31bjmqC9/yOVy1nS3OV3M1ERN84XCrYreWmOfr37l8c7OzqZ308TJjM5aC4XiXYLcW2O2KmNj6+tWaDEzPoXPFwo3oTwxwSistm175Uy3fajEsZ6hyVTqWyBDUaOgP81kMg03nMRNLIs7fX197yKyGpmwFnJiW1vitjjab5bYVrpc192Mz7qoTZAbly1ZsiiuGKYi1mW/ZCr1A9BdEVOqbJrfizOGRsQqRl9f37uCcc8Eo/CdbDZ77CRVYiX2BWEjkXgg/MVAlaNNk9Vxx1GP2MXo7+8fVtWJeUawL7TltORTQaKiD0+0yIrOjo6OVsQSpSVi9JdKJWDClsSyaX6hFbFEad1HJNEJm1QM9HOtCuVADC3D/HP0TOEcWvyFr2WNp9PpVxD2RUzzLMtquAV6pmmZGL29vWPAYNRmEvykslW0tFtKze/MfJFsq2KByT8VfLRQnnQ976LZLQkRZsWIkAAol8sV05B3pio8A7QBc8bPlP0I78cehTHlLyFn+Ujzf7nAMNUybEhuAAAAAElFTkSuQmCC',
    deg: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFFklEQVRoge3aaahVVRQH8J8+LU3rOVBaZjlUjmXQpPbBMhso04KCvilBEVFQkUlFpRA0EI1GRYMQ1bfIogGKaI5mCCv1lUMp2WCajZrp68Pap3vezfd895zzVMI/HM7e5+5hrb2Gvdbelz3YvdDUhWO/hmkYi0Fpro3Y2hWTdeuKQTEYa9v5bS0+xwp8kSuvRGsX0VMYUwRRX+F2PIcWbEnft/dswHu4p8iEPUqTvH2MTu83cU3ue08MxQiME2o3AuOFFE/Ati6iqRDuFKs8N9WPxEto7qDPlanPwiITdi/SqR2cjAnojVHp27L0nokzMCDX/jKhbpmdDq3r0xCqVK0ncaBQjUw9zhMqMwWb8HWu/TQMVDPwjPmlFdLUMJoFQVvxl/YNeiM+wOP4Tqz+eOyN5anNmCIEVOV+j8f7+BTHYXgiaBSOyJUHttN/q1DzbrgPnwkm3+gsAVWpVuallgoX25KeevQXXqrea41Dr9Tm8vT+BodWRF+ncbNQi/kF+/cUi3Gu8FqteLmRAaryWnmJNGvLUEcuN8OW1PcZLE7fGvJeVTGSd7eThWuFC/E99hP6f1OubXchiXrkF6XTqIKRJhwu1KFFEJoRMVHY4WZh8PPEfgJP4IVUPgxXpHL9HtQpVGHsw4T7XI3fhG5n6vGR8EibcwSuSO/JwuXCdJyPuxVkpAqcKaTxyg7a9RCueF+hZg+LsAQexGPCq7XiVw1uDVVIJNPpHa3g39q65Ity5UdFNJBJo0WDIX0VNlJFaPEhPlbQ0KmWkWUi8Lsj1ffCkBJjNYQqGMmv4kk4O9XnisSqh3AGDwnvBn3TU49dxkg/kY//jjWCqUwtjsEfwjYm4mKROMHzIlqWfsvylsKqVdbYs4kz41yIPunbIhHpwsj0/lJ4o2MFMzBDxFo9Urttqd1OxSzBwFOdaDtQ7OS9RR5/Qfr+NG5T21RXFSGkrEQa0emf0nuLtnn8PKGCY1O9kPcrayOFdTqHxWKHLzVWWUbyEpmABaneT+OZXn4z3KnIgsGt2AdX4a302/1Yn8oD8KxIoOBgbQ8hMrwlbGRqEWLKSGS42PRWCx3Pu94J+DGVpwrPlK34q7g3lWfg+lQuFSyWMfb6ieer5RcL1FLXQWpxVl/hnbLsb7pYzIHYXwSL35agqRCuFqrQmSPOnmL/aBab3ynp+xuYI0L6VhFzFUKVEukIW9J7o9gzMswSanlWA2NtF2UYqcL1Zptf6bHKGHteIqfhgVQ/RJxzFR1rp2KA0OlfhO7fIk5AiJAjS2FH4l21c90JwvjrsTSNd1RRgopKJL+Crdq63vFqlzynYpI4/+2O13Fj+u0SXCccwQglg8WiNlKf3s7OjTVHzbj7iAucZULl+onjIThdMD9CMLMSfxakpzBuFZK4oYE+/UWefnSqfyEWYGYa68UyBJWVSCNeZoM4OclwopDcpaleytCLMpLZyDhh0AcJ1RksHEGT2Py6C3XqJrLI7MphnQjr1+XGGiBO8peI87GG0JmzoyahDpNEqjpRnAx2FVrFhdAneBvviBOWDq+122OklzhEOMd/r8yIqHdJepYLA16T3j+kSTcmon5OfTLJNIvFOUBIcIhwySNF6D9GHFbksV7cQS4SKfKmjpgijj/vEvqcv2lqwSMipBila/9o0JTmmJ3mzM4Dsmd9onFYR4NsznVYhWvVDHtXYrSgZZUafZvzDepVa7f758EO8C/9VV5P78Ee/B/xD+QBLoyy3HnfAAAAAElFTkSuQmCC',
    offset:
      'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADFElEQVR4nO2av2sUQRTHP5tTi4BELMTCQjEqsVAQfyBYiYhnwEob/wFbQe0lFlExGjDxR/wB+j8YbKw8G2MTqxB/YCEYBZGcAUmIicXscG8ns3O5yyy7t84HluzM+87y3rvZuZmXg0AgEAgEAoFAIBBon5vAArAsrgXghmPMdmASmAJ6Hbq9sWYC2OrD2Sz4TTJ4fc07xgwI3bBD90TorvhwVtLl6TmjqE/cZINjTJ+470/RREA1ZUyhkbMgjUlDt8eiOWBoXvt1098MaJUI2Gn02WbBaaO9Kxt3/NNsBmxj5XrxyqJ7Y9Ft8u1sFjRLwHFWBrYA9AjNZmDRojvo09G8XoHdlr71wAnRPgVUVjm2bfJKgHyX6+JergPVFE3pEvBU3PejfOoCTqZoXJumwtBsDZgS9sPAjGgfAo6K9nfgiGi/9eloHjOgAuwQ7WngpWj3k5z+46iEaby+AlnhmgG9JD9dgHOibwJ4J9pnY80P0bclK8d94UpAVdhqcV8PjcPUUnyZX401Me6YL0fzeAXkFJ6O/86iNj2gdolRfF+LbQAfxDhvO8I8EiCdl0GNW7SyrzQJkDNABvXCopV9Ulv4hdC1BnwRtn2G7aOwfTZs+4XtvU9ns2Ce9IKIti0C3YZthEaQI4atm8bZ4KdPZ7PgOjAHDFpsg8AfVBnNpA+1KfqGKpmZ3AX+Arf9uFlM9FY4DVeVKRAIBAI+iVBfOXPA1Zx9aYVrKJ9v0ThXtEwEPKCxMam75YWiTsPve7SRBDP4ZVQ2O4Uhkr6P0kISoniAfMAj8qsftkNEclu9DIyxiiSUIXiNLQkPcSShTMFrbEkYxpKEMgavsSXhjjauiwX3gQti0AzwiQz+H58TX1Ex6R9YXETVHS8BnMf+44b/4TrTxRo2CiVgSVdgzVfgF2oNsJW0OpEKKr6Nom8IuKwbtoXiMeVYBCvAM5KxWStKZUzCqoPXlCkJFeA5LQSvKUMS2g5eYzsMdVIldgwPBzkzCbNueWGokPxt0ZpOsVH8gDqdVRAZQvk8kLcjgUAgEAgEiss/0pxZBTlRkt8AAAAASUVORK5CYII=',
  };
  import { useGetLineList } from '../../../composables/useGetLineList';
  import EchartsPie from '@/components/echarts/Pie.vue';
  import EchartsLine from '@/components/echarts/Line.vue';
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
    components: {
      EchartsLine,
      EchartsPie,
    },
    data() {
      const getLineList = useGetLineList();
      Object.assign(getLineList.addtionalParams, {
        type_name: 'sensor',
        sensor_type: 'tower_title',
      });
      return {
        getLineList,
        params: {
          // 获取列表请求参数
          dept_id: 0,
          line_id: 0,
          uuid: '',
        },
        sensorListLoading: false,
        sensorList: [],
        month: new Date(),
        historyChartOption: {
          grid: {
            containLabel: true,
            top: 80,
            right: 50,
            bottom: 0,
            left: 30,
          },
          textStyle: {
            color: '#fff',
            textShadowColor: '#fff',
          },
          title: {
            text: '杆塔倾斜-设备历史报警数据',
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          legend: {
            orient: 'vertical',
            right: 0,
            height: 80,
            selected: {
              顺线倾斜角: true,
              横向倾斜角: true,
              顺线倾斜度: false,
              横向倾斜度: false,
              总体倾斜度: false,
              顺线偏移量: false,
              横向偏移量: false,
              塔顶部位移值: false,
            },
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          dataZoom: {
            type: 'inside',
          },
          xAxis: { type: 'category', boundaryGap: false, name: '日期' },
          yAxis: { name: '倾斜角度' },
          dataset: {
            dimensions: [
              'time',
              'x_inclination',
              'y_inclination',
              'total_inclination',
              'x_offset',
              'y_offset',
              'total_offset',
              'x',
              'y',
            ],
            source: [],
          },
          series: [
            { type: 'line', smooth: true, name: '顺线倾斜度', showSymbol: false },
            { type: 'line', smooth: true, name: '横向倾斜度', showSymbol: false },
            { type: 'line', smooth: true, name: '总体倾斜度', showSymbol: false },
            { type: 'line', smooth: true, name: '顺线偏移量', showSymbol: false },
            { type: 'line', smooth: true, name: '横向偏移量', showSymbol: false },
            { type: 'line', smooth: true, name: '塔顶部位移值', showSymbol: false },
            { type: 'line', smooth: true, name: '顺线倾斜角', showSymbol: false },
            { type: 'line', smooth: true, name: '横向倾斜角', showSymbol: false },
          ],
          toolbox: {
            top: 10,
            left: 'center',
            // orient: "vertical",
            feature: {
              myLegendAll: {
                show: true,
                title: '统计所有',
                icon: icons.line,
                onclick: function () {
                  console.log(this);
                  this.$refs.historyChart.chart.dispatchAction({
                    type: 'legendAllSelect',
                  });
                }.bind(this),
              },
              myLegendDeg: {
                show: true,
                title: '倾斜度',
                icon: icons.deg,
                onclick: function () {
                  this.historyChartOption.legend.selected = {
                    顺线倾斜角: false,
                    横向倾斜角: false,
                    顺线倾斜度: true,
                    横向倾斜度: true,
                    总体倾斜度: true,
                    顺线偏移量: false,
                    横向偏移量: false,
                    塔顶部位移值: false,
                  };
                }.bind(this),
              },
              myLegendOffset: {
                show: true,
                title: '偏移量',
                icon: icons.offset,
                onclick: function () {
                  this.historyChartOption.legend.selected = {
                    顺线倾斜角: false,
                    横向倾斜角: false,
                    顺线倾斜度: false,
                    横向倾斜度: false,
                    总体倾斜度: false,
                    顺线偏移量: true,
                    横向偏移量: true,
                    塔顶部位移值: true,
                  };
                }.bind(this),
              },
              myLegendAngle: {
                show: true,
                title: '倾斜角',
                icon: icons.angle,
                onclick: function () {
                  this.historyChartOption.legend.selected = {
                    顺线倾斜角: true,
                    横向倾斜角: true,
                    顺线倾斜度: false,
                    横向倾斜度: false,
                    总体倾斜度: false,
                    顺线偏移量: false,
                    横向偏移量: false,
                    塔顶部位移值: false,
                  };
                }.bind(this),
              },
            },
          },
        },
        onlineChartOption: {
          textStyle: {
            color: '#fff',
            textShadowColor: '#fff',
          },
          title: {
            text: '杆塔倾斜',
            subtext: '设备在线状态统计',
            left: 'center',
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'center',
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          dataset: {
            source: [],
          },
          series: [
            {
              name: '设备在线状态统计',
              type: 'pie',
              radius: '50%',
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        },
        deptAnalysisChartOption: {
          textStyle: {
            color: '#fff',
            textShadowColor: '#fff',
          },
          grid: {
            containLabel: true,
            top: 80,
            right: 50,
            bottom: 0,
            left: 30,
          },
          title: {
            text: '杆塔倾斜-月度统计数据',
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          legend: {
            left: 'center',
            textStyle: {
              color: '#fff',
              textShadowColor: '#fff',
            },
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              return `
                    ${params[0].data.day} 日， 报警 ${params[0].data.count} 次 <br />
                  `;
            },
          },
          xAxis: { type: 'category', boundaryGap: false, name: '日期' },
          yAxis: { name: '报警次数' },
          dataset: {
            dimensions: ['day', 'count'],
            source: [],
          },
          series: [{ type: 'line', smooth: true, name: '报警次数' }],
        },
      };
    },
    async created() {
      if (this.device.uuid) {
        this.params.dept_id = this.device.dept_id;
        this.params.line_id = this.device.line_id;
        this.params.uuid = this.device.uuid;
        await this.getLineList.search(this.device.line_name);
      }
      this.search();
    },
    methods: {
      // 获取传感器列表
      async getSensorListData(keyword = '') {
        try {
          this.sensorListLoading = true;
          const res = await APITowerTilt.sensor_list({
            dept_id: this.params.dept_id,
            line_id: this.params.line_id_history,
            page: 1,
            size: 1000,
            keyword,
            sort: 'asc',
            status: 'ALL',
          });
          this.sensorListLoading = false;
          if (res && res.code == 200 && res.data) {
            this.sensorList = res.data;
          } else {
            throw new Error(res.msg || res.statusText);
          }
        } catch (error) {
          this.sensorList = [];
          this.sensorListLoading = false;
        }
      },
      // 查
      search() {
        this.getHistoryData();
        this.getOnlineData();
        this.getDeptAnalysisData();
      },
      // 查询历史数据
      async getHistoryData() {
        this.$refs.historyChart.chart.hideLoading();
        this.historyChartOption.dataset.source = [];
        const reqData = {
          dept_id: this.params.dept_id,
          start: dayjs(this.month).startOf('month').valueOf(),
          end: dayjs(this.month).endOf('month').valueOf(),
          page: 1,
          size: 10000,
          sort: 'asc',
          uuid: this.params.uuid,
        };
        if (reqData.uuid === '') {
          this.$message.closeAll();
          this.$message.warning('请先选择要查看的传感器!');
          return false;
        }
        this.$refs.historyChart.chart.showLoading();
        const [err, resData] = await APITowerTilt.get_history_data(reqData);
        this.$refs.historyChart.chart.hideLoading();
        if (!err && validateResponseCode(resData)) {
          const sec = resData.data.x_time || resData.data.y_time;
          // 不限制最大最小值
          // const max_val = +(res.data.max_val || 0);
          let historyData = [];
          if (sec) {
            historyData = sec.map((s, index) => {
              const item = {
                time: '',
                x: 0,
                x_inclination: 0,
                x_offset: 0,
                y: 0,
                y_inclination: 0,
                y_offset: 0,
                total_inclination: 0,
                total_offset: 0,
              };
              if (s) {
                item.time = dayjs(s * 1000).format('YYYY-MM-DD HH:mm:ss');
                item.x = resData.data.x[index];
                item.x_inclination = resData.data.x_inclination[index];
                item.x_offset = resData.data.x_offset[index];
                item.y = resData.data.y[index];
                item.y_inclination = resData.data.y_inclination[index];
                item.y_offset = resData.data.y_offset[index];
                item.total_inclination = resData.data.total_inclination[index];
                item.total_offset = resData.data.total_offset[index];
              }
              if (item.time) {
                return item;
              }
            });
          }
          // if (max_val) {
          //   this.historyChartOption.yAxis.min = -(max_val + 1);
          //   this.historyChartOption.yAxis.max = +(max_val + 1);
          // }
          this.historyChartOption.dataset.source = historyData;
        } else {
          throw new Error(getResponseMessage(err || resData));
        }
      },
      // 查询设备在线数据 这里的dept_id为数组，后面改的
      async getOnlineData() {
        this.onlineChartOption.dataset.source = [];
        const reqData = { dept_id: this.params.dept_id ? [this.params.dept_id] : [] };
        const [err, resData] = await APITowerTilt.online_count(reqData);
        if (!err && validateResponseCode(resData)) {
          const onlineData = [];
          for (const key in resData.data) {
            const item = { name: '', value: 0 };
            if (key == 'online') {
              item.name = '在线';
              item.value = resData.data[key];
            }
            if (key == 'offline') {
              item.name = '离线';
              item.value = resData.data[key];
            }
            if (item.value) {
              onlineData.push(item);
            }
          }
          this.onlineChartOption.dataset.source = onlineData;
        } else {
          throw new Error(getResponseMessage(err || resData));
        }
      },
      // 查询部门月度统计数据 这里的dept_id为数组，后面改的
      async getDeptAnalysisData() {
        this.deptAnalysisChartOption.dataset.source = [];
        const reqData = {
          dept_id: this.params.dept_id ? [this.params.dept_id] : [],
          line_id: this.params.line_id,
          date: dayjs(this.month).format('YYYY-MM'),
        };
        const [err, resData] = await APITowerTilt.analysis(reqData);
        if (!err && validateResponseCode(resData)) {
          this.deptAnalysisChartOption.dataset.source = resData.data;
        } else {
          throw new Error(getResponseMessage(err || resData));
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chart-layout {
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-flow: column;
    .chart-search {
      margin-bottom: 10px;
      display: flex;
    }
    .chart-container {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      > * {
        flex: 2;
      }
      .chart-online {
        flex: 1;
      }
    }
  }
</style>
