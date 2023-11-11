<script setup>
  import { ref, reactive } from 'vue';
  import { APIWirelessTemperatureV2 } from '../../../../apis/jsl_byne/wirelesstemp';
  import { validateResponseCode, nativeFormat, getResponseMessage } from '@shihongxins/jsutils';
  import { useListQueryEffect } from '../../../../composables/useListLoadEffect';
  import { Message } from 'element-ui';
  import DeviceCard from '../../components/DeviceCard.vue';
  import DialogTabs from '../../components/DialogTabs.vue';
  import Log from './Log.vue';

  const originAddtionalParams = () => ({
    status: -1, // -1 0 1
  });
  const addtionalParams = reactive(originAddtionalParams());
  const queryFun = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await APIWirelessTemperatureV2.device.list(reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((device) => {
        device.name = device.name || '未命名设备';
        device.status_desc = {
          ONLINE: '在线',
          OFFLINE: '离线',
          UNBIND: '未绑定',
        }[device.status];
        device.status = !!device.status;
        device.updated_at = nativeFormat(device.updated_at);
        device.intro = {
          dept_name: {
            desc: '所属部门',
          },
          uuid: {
            desc: '设备编号',
          },
          alarm: {
            desc: '报警值',
            formatter() {
              const { alarm_t = 0, alarm_v = 0 } = device;
              return `温度： ${alarm_t} ℃ ， 电压： ${alarm_v} V`;
            },
          },
          updated_at: {
            desc: '更新时间',
          },
        };
        return device;
      });
      total.value = resData?.total || list.value.length;
    } else {
      Message.error('获取无线测温设备失败：' + getResponseMessage(err || resData));
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
  const activePaneName = ref('log');
  const handleChangePanel = (paneName) => {
    activePaneName.value = paneName || 'log';
  };
</script>

<template>
  <div h="full" flex="~ col" overflow="hidden">
    <div m="b-4" flex="~" justify="between" items="center">
      <div m="r-4" flex="~" items="center">
        <label>设备状态</label>
        <div class="select-wrapper" m="x-4">
          <el-select
            size="mini"
            popper-class="select-dropdown-wrapper"
            placeholder="请选择设备状态"
            v-model="addtionalParams.status"
            @change="search()"
          >
            <el-option label="所有状态" :value="-1"></el-option>
            <el-option label="离线" :value="0"></el-option>
            <el-option label="在线" :value="1"></el-option>
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
        :panes="[{ label: '日志查询', name: 'log' }]"
        :active-pane-name="activePaneName"
        @update:activePaneName="handleChangePanel"
      >
        <Log slot="log" v-if="activePaneName === 'log'" :device="selectedDevice"></Log>
      </DialogTabs>
    </template>
  </div>
</template>
