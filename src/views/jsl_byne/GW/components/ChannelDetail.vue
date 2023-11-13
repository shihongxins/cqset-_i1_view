<script>
  import { ref, computed } from 'vue';
  import { useListQueryEffect } from '../../../../composables/useListLoadEffect';
  import { Message } from 'element-ui';
  import LeakageCurrent from '../LeakageCurrent.vue';
  import SitePollution from '../SitePollution.vue';
  import PollutionLightningPressure from '../PollutionLightningPressure.vue';
  import MicroMeteorology from '../MicroMeteorology.vue';
  import IceMonitor from '../IceMonitor.vue';
  import BreezeVibrationCharacteristic from '../BreezeVibrationCharacteristic.vue';
  import ConductorDancing from '../ConductorDancing.vue';
  import ConductorTemperature from '../ConductorTemperature.vue';
  import ConductorDeviation from '../ConductorDeviation.vue';
  import ConductorSag from '../ConductorSag.vue';
  import FaultList from './FaultList.vue';

  export default {
    props: {
      channel: {
        required: true,
        type: Object,
        default: () => ({}),
      },
    },
    components: {
      LeakageCurrent,
      SitePollution,
      PollutionLightningPressure,
      MicroMeteorology,
      IceMonitor,
      BreezeVibrationCharacteristic,
      ConductorDancing,
      ConductorTemperature,
      ConductorDeviation,
      ConductorSag,
      FaultList,
    },
    setup(props) {
      const refCompChannel = ref(null);
      const channelDevTypeCompName = computed(() => {
        const { dev_type } = props.channel;
        const DevTypeCompMap = {
          insulator_leakage_current: 'LeakageCurrent',
          site_pollution: 'SitePollution',
          pollution_lightning_pressure: 'PollutionLightningPressure',
          micro_meteorology: 'MicroMeteorology',
          ice_monitor: 'IceMonitor',
          breeze_vibration_characteristic: 'BreezeVibrationCharacteristic',
          conductor_dancing: 'ConductorDancing',
          conductor_temperature: 'ConductorTemperature',
          conductor_deviation: 'ConductorDeviation',
          conductor_sag: 'ConductorSag',
        };
        return DevTypeCompMap[dev_type] || 'FaultList';
      });
      const date = ref(new Date());
      const queryFun = async () => {
        const reqData = {
          ...props.channel,
          ...params,
          start_date: date.value,
          sort: 'desc',
        };
        loading.value = true;
        const resData = await refCompChannel.value.queryFun(reqData);
        loading.value = false;
        if (resData.error) {
          Message.error(resData.error.message);
        }
        list.value = resData.list;
        total.value = resData.total;
      };
      const { params, loading, list, total, pageChange, sizeChange, search, resetSearch } =
        useListQueryEffect(queryFun);
      return {
        refCompChannel,
        channelDevTypeCompName,
        date,
        params,
        loading,
        list,
        total,
        pageChange,
        sizeChange,
        search,
        resetSearch,
      };
    },
    mounted() {
      this.search();
    },
  };
</script>

<template>
  <div class="table_container">
    <div class="table_search">
      <div class="date-time-picker-wrapper">
        <el-date-picker
          size="mini"
          popper-class="date-time-picker-dropdown-wrapper"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="date"
          @change="search"
        >
        </el-date-picker>
      </div>
      <el-button size="mini" type="primary" @click="search">查询</el-button>
      <el-button size="mini" type="primary" plain @click="resetSearch">重置查询</el-button>
    </div>
    <div class="table_body table-wrapper" v-loading="loading">
      <component ref="refCompChannel" :is="channelDevTypeCompName" :list="list"></component>
    </div>
    <div class="pager-wrapper">
      <el-pagination
        :current-page="params.page"
        @size-change="sizeChange"
        @current-change="pageChange"
        :page-sizes="[10, 20, 100, 500, 1000]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
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
