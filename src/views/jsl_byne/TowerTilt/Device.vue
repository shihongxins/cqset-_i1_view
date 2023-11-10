<script setup>
  import { reactive, ref } from 'vue';
  import { useGetLineList } from '../../../composables/useGetLineList';
  import { APITowerTilt } from '../../../apis/jsl_byne/towertilt';
  import { validateResponseCode, getResponseMessage, nativeFormat } from '@shihongxins/jsutils';
  import { useListQueryEffect } from '../../../composables/useListLoadEffect';
  import { Message } from 'element-ui';
  import DeviceCard from '../components/DeviceCard.vue';
  import DialogTabs from '../components/DialogTabs.vue';
  import Detail from './Detail.vue';
  import Log from './Log.vue';
  import Alarm from './Alarm.vue';
  import Analysis from './Analysis.vue';

  const originAddtionalParams = () => ({
    line_id: 0,
    status: 'ALL', // ALL ONLINE OFFLINE UNBIND
  });
  const addtionalParams = reactive(originAddtionalParams());
  const getLineList = useGetLineList();
  const queryFun = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await APITowerTilt.list(reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((device) => {
        device.name = device.name || '未命名设备';
        device.status_desc = {
          ONLINE: '在线',
          OFFLINE: '离线',
          UNBIND: '未绑定',
        }[device.status];
        device.status = device.status === 'ONLINE';
        device.updated_at = nativeFormat(device.updated_at);
        device.intro = {
          lonlat: {
            desc: '经纬度',
            formatter: () => {
              const { lon = '0', lat = '0' } = device;
              return `${lon}, ${lat}`;
            },
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
      Message.error('获取地灾监测设备失败：' + getResponseMessage(err || resData));
    }
  };
  const { params, loading, list, total, pageChange, search } = useListQueryEffect(
    queryFun,
    addtionalParams
  );

  params.size = 8;
  search();

  const selectedDevice = ref(null);
  const viewDetail = ref(false);
  const handleSelectDevice = (device) => {
    selectedDevice.value = device;
    viewDetail.value = true;
  };
  const activePaneName = ref('detail');
  const handleChangePanel = (paneName) => {
    activePaneName.value = paneName || 'detail';
  };
</script>

<template>
  <div h="full" flex="~ col" overflow="hidden">
    <div m="b-4" flex="~" justify="between" items="center">
      <div m="r-4" flex="~" items="center">
        <label>所属线路</label>
        <div class="select-wrapper" m="x-4">
          <el-select
            size="mini"
            popper-class="select-dropdown-wrapper"
            placeholder="请选择所属线路"
            v-model="addtionalParams.line_id"
            filterable
            remote
            :loading="getLineList.loading.value"
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
        <label>在线状态</label>
        <div class="select-wrapper" m="x-4">
          <el-select
            size="mini"
            popper-class="select-dropdown-wrapper"
            placeholder="请选择设备状态"
            v-model="addtionalParams.status"
            @change="search()"
          >
            <el-option label="所有状态" value="ALL"></el-option>
            <el-option label="在线" value="ONLINE"></el-option>
            <el-option label="离线" value="OFFLINE"></el-option>
            <el-option label="未绑定" value="UNBIND"></el-option>
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
        :panes="[
          { label: '设备详情', name: 'detail' },
          { label: '日志查询', name: 'log' },
          { label: '告警日志', name: 'alarm' },
          { label: '统计分析', name: 'analysis' },
        ]"
        :active-pane-name="activePaneName"
        @update:activePaneName="handleChangePanel"
      >
        <Detail slot="detail" v-if="activePaneName === 'detail'" :device="selectedDevice"></Detail>
        <Log slot="log" v-if="activePaneName === 'log'" :device="selectedDevice"></Log>
        <Alarm slot="alarm" v-if="activePaneName === 'alarm'" :device="selectedDevice"></Alarm>
        <Analysis
          slot="analysis"
          v-if="activePaneName === 'analysis'"
          :device="selectedDevice"
        ></Analysis>
      </DialogTabs>
    </template>
  </div>
</template>
