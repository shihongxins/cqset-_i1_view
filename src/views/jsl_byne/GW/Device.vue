<script>
  import { ref, reactive, computed } from 'vue';
  import { useGetStationList } from '../../../composables/useGetStationList';
  import { useGetLineList } from '../../../composables/useGetLineList';
  import { useGetTowerList } from '../../../composables/useGetTowerList';
  import { useGetDFSCode } from '../../../composables/useGetDFSCode';
  import { useI1CommonAPI, ChannelDevTypeMap } from '../../../apis/i1/common';
  import { request } from '../../../apis/request';
  import { validateResponseCode, nativeFormat, getResponseMessage } from '@shihongxins/jsutils';
  import { useListQueryEffect } from '../../../composables/useListLoadEffect';
  import { Message } from 'element-ui';
  import DeviceCard from '../components/DeviceCard.vue';
  import DialogTabs from '../components/DialogTabs.vue';
  import DeviceDetail from './components/DeviceDetail.vue';
  import DeviceChannelList from './components/DeviceChannelList.vue';
  import ChannelDetail from './components/ChannelDetail.vue';

  export default {
    name: 'GWDeviceList',
    components: {
      DeviceCard,
      DialogTabs,
      DeviceDetail,
      DeviceChannelList,
      ChannelDetail,
    },
    setup() {
      const originAddtionalParams = () => ({
        station_id: 0,
        line_id: 0,
        tower_id: 0,
        dev_type: 0,
        status: 'ALL', // ALL ONLINE OFFLINE
      });
      const addtionalParams = reactive(originAddtionalParams());
      const getStationList = useGetStationList();
      const changeStation = (station_id = 0) => {
        getTowerList.addtionalParams.line_id = 0;
        addtionalParams.station_id = station_id;
        addtionalParams.tower_id = 0;
        addtionalParams.line_id = 0;
        search();
      };
      const getLineList = useGetLineList();
      const changeLine = (line_id = 0) => {
        getTowerList.addtionalParams.line_id = line_id;
        getTowerList.list.value = [];
        addtionalParams.line_id = line_id;
        addtionalParams.station_id = 0;
        addtionalParams.tower_id = 0;
        addtionalParams.cmd_id = '';
        search();
      };
      const getTowerList = useGetTowerList();
      const changeTower = (tower_id = 0) => {
        addtionalParams.tower_id = tower_id;
        addtionalParams.station_id = 0;
        addtionalParams.cmd_id = '';
        search();
      };
      const APII1Common = useI1CommonAPI('/pc/gw_i1', request);
      const queryFun = async () => {
        const reqData = Object.assign({}, params, addtionalParams);
        loading.value = true;
        const [err, resData] = await APII1Common.dev.list(reqData);
        loading.value = false;
        if (!err && validateResponseCode(resData)) {
          list.value = [].concat(resData?.data || []).map((device) => {
            device.name = device.name || '未命名设备';
            device.status = !!device.status;
            device.status_desc = device.status ? '在线' : '离线';
            device.updated_at = nativeFormat(device.updated_at);
            device.intro = {
              station_name: {
                desc: '变电站',
              },
              line_name: {
                desc: '线路',
              },
              tower_name: {
                desc: '杆塔',
              },
              uuid: {
                desc: '设备编号',
              },
              updated_at: {
                desc: '更新时间',
              },
            };
            return device;
          });
          total.value = resData?.total || list.value.length;
        } else {
          Message.error('获取设备列表失败：' + getResponseMessage(err || resData));
        }
      };
      const { params, loading, list, total, pageChange, search } = useListQueryEffect(
        queryFun,
        addtionalParams
      );
      params.size = 8;

      const selectedDevice = ref(null);
      const selectedDeviceChannelList = ref([]);
      const DialogTabPanes = computed(() => {
        return [
          { label: '设备详情', name: 'detail' },
          { label: '设备通道', name: 'channelList' },
          { label: '故障信息', name: 'faultList' },
        ].concat(
          selectedDeviceChannelList.value.map((channel) => {
            return {
              label: channel.tabLabel,
              name: channel.tabName,
            };
          })
        );
      });
      const selectedChannel = computed(() => {
        return selectedDeviceChannelList.value.find(
          (channel) => channel.tabName === activePaneName.value
        );
      });
      const viewDetail = ref(false);
      const activePaneName = ref('detail');
      const handleChangePanel = (paneName) => {
        activePaneName.value = paneName || 'detail';
      };
      const handleSelectDevice = async (device) => {
        selectedDevice.value = device;
        selectedDeviceChannelList.value = [];
        const res = await APII1Common.channel.list(device.cmd_id);
        const { error: err, data: resData } = res;
        if (!err && validateResponseCode(resData)) {
          const { code = '' } = await useGetDFSCode();
          selectedDeviceChannelList.value = resData.data.map((channel) => {
            channel.dev_type_desc = ChannelDevTypeMap[channel.dev_type] || '未知类型';
            channel.updated_at = nativeFormat(channel.updated_at);
            channel.picurl = channel.picurl ? `${channel.picurl}&code=${code}` : '';
            channel.tabLabel = `通道：${channel.channel_no} ${
              channel.name || channel.dev_type_desc
            }`;
            channel.tabName = `channel_${channel.channel_no}_${channel.dev_type}`;
            channel.name = channel.tabLabel;
            return channel;
          });
        }
        viewDetail.value = true;
        handleChangePanel();
      };
      return {
        addtionalParams,
        getStationList,
        changeStation,
        getLineList,
        changeLine,
        getTowerList,
        changeTower,
        queryFun,
        params,
        loading,
        list,
        total,
        pageChange,
        search,
        selectedDevice,
        selectedDeviceChannelList,
        DialogTabPanes,
        selectedChannel,
        viewDetail,
        handleSelectDevice,
        activePaneName,
        handleChangePanel,
      };
    },
    watch: {
      '$route.path': {
        handler(path = '') {
          const dev_type = parseInt(path.split('/').pop()) || 0;
          if (dev_type) {
            this.addtionalParams.dev_type = dev_type;
            this.search();
          } else {
            this.$alert('未知设备类型', '错误', {
              callback: () => {
                this.$router.back();
              },
            });
          }
        },
        immediate: true,
      },
    },
  };
</script>

<template>
  <div h="full" flex="~ col" overflow="hidden">
    <div m="b-4" flex="~" justify="between" items="center">
      <div m="r-4" flex="~" items="center">
        <div class="select-wrapper">
          <el-select
            popper-class="select-dropdown-wrapper"
            placeholder="请选择所属变电站"
            v-model="addtionalParams.station_id"
            filterable
            remote
            reserve-keyword
            :remote-method="getStationList.search"
            :loading="getStationList.loading.value"
            @focus="getStationList.search()"
            @change="changeStation"
          >
            <el-option label="不限变电站" :value="0"></el-option>
            <el-option
              v-for="station in getStationList.list.value"
              :key="station.id"
              :label="station.name"
              :value="station.id"
            ></el-option>
          </el-select>
        </div>
        <div class="select-wrapper">
          <el-select
            popper-class="select-dropdown-wrapper"
            placeholder="请选择所属线路"
            v-model="addtionalParams.line_id"
            filterable
            remote
            reserve-keyword
            :remote-method="getLineList.search"
            :loading="getLineList.loading.value"
            @focus="getLineList.search()"
            @change="changeLine"
          >
            <el-option label="不限线路" :value="0"></el-option>
            <el-option
              v-for="line in getLineList.list.value"
              :key="line.id"
              :label="line.name"
              :value="line.id"
            ></el-option>
          </el-select>
        </div>
        <div class="select-wrapper">
          <el-select
            popper-class="select-dropdown-wrapper"
            placeholder="请选择所属杆塔"
            v-model="addtionalParams.tower_id"
            filterable
            remote
            reserve-keyword
            :remote-method="getTowerList.search"
            :loading="getTowerList.loading.value"
            @focus="getTowerList.search()"
            @change="changeTower"
          >
            <el-option label="不限杆塔" :value="0"></el-option>
            <el-option
              v-for="tower in getTowerList.list.value"
              :key="tower.id"
              :label="tower.name"
              :value="tower.id"
            ></el-option>
          </el-select>
        </div>
        <div class="select-wrapper" m="x-4">
          <el-select
            size="mini"
            popper-class="select-dropdown-wrapper"
            placeholder="请选择设备状态"
            v-model="addtionalParams.status"
            @change="search()"
          >
            <el-option label="所有状态" value="ALL"></el-option>
            <el-option label="离线" value="OFFLINE"></el-option>
            <el-option label="在线" value="ONLINE"></el-option>
          </el-select>
        </div>
        <div rounded ring="~ primary" p="x-2">
          <input
            border="none"
            bg="transparent"
            style="outline: none; line-height: 30px"
            type="text"
            placeholder="搜索设备"
            v-model="params.keyword"
            @change="search"
            @keyup.enter="search"
          />
          <i class="icon uno-icon-fix i-material-symbols:search-rounded"></i>
        </div>
      </div>
    </div>
    <div flex="1 ~ col" overflow="hidden">
      <ul flex="1 ~ wrap" items="start" overflow="x-hidden y-auto" v-loading="loading">
        <li
          box="border"
          p="y-4 x-1"
          w="1/4"
          h="1/2"
          overflow="hidden"
          cursor="pointer"
          v-for="device in list"
          :key="device.id"
          @click="handleSelectDevice(device)"
        >
          <DeviceCard :device="device"></DeviceCard>
        </li>
      </ul>
      <div class="pager-wrapper">
        <el-pagination
          layout="total, prev, pager, next"
          :currentPage="params.page"
          :pageSize="params.size"
          :total="total"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <template v-if="viewDetail">
      <DialogTabs
        v-model="viewDetail"
        :panes="DialogTabPanes"
        :active-pane-name="activePaneName"
        @update:activePaneName="handleChangePanel"
      >
        <DeviceDetail
          slot="detail"
          v-if="activePaneName === 'detail'"
          :device="selectedDevice"
        ></DeviceDetail>
        <DeviceChannelList
          slot="channelList"
          v-if="activePaneName === 'channelList'"
          :device="selectedDevice"
          :channels="selectedDeviceChannelList"
        ></DeviceChannelList>
        <ChannelDetail
          v-if="selectedChannel || activePaneName === 'faultList'"
          :slot="activePaneName"
          :channel="selectedChannel"
        ></ChannelDetail>
      </DialogTabs>
    </template>
  </div>
</template>
