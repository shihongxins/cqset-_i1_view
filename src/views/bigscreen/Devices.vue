<script setup>
  import ImgIconAll from '@/assets/images/icon-count-all.png';
  import ImgIconOnline from '@/assets/images/icon-count-online.png';
  import ImgIconOffline from '@/assets/images/icon-count-offline.png';
  import ImgIconPercentage from '@/assets/images/icon-count-percentage.png';
  import { APIBigscreen } from '../../apis/bigscreen';
  import { validateResponseCode } from '@shihongxins/jsutils';
  import { useGetDeviceList } from '../../composables/useGetDeviceList.js';
  import DeviceCard from './components/DeviceCard.vue';
  import { ref } from 'vue';
  import { router } from '../../router';
  import { Message } from 'element-ui';

  const countList = ref([
    {
      text: '全部',
      value: '0',
      icon: ImgIconAll,
      color: 'primary',
    },
    {
      text: '在线',
      value: '0',
      icon: ImgIconOnline,
      color: 'success',
    },
    {
      text: '离线',
      value: '0',
      icon: ImgIconOffline,
      color: 'danger',
    },
    {
      text: '在线率',
      value: '0%',
      icon: ImgIconPercentage,
      color: 'warning',
    },
  ]);
  const getDevicesStatusCounteData = async () => {
    const [err, resData] = await APIBigscreen.status();
    if (!err && validateResponseCode(resData)) {
      let { total = 0, online = 0, offline = 0, online_rate = 0 } = resData?.data || {};
      if (total === 0 || online === 0) {
        online_rate = 0;
      }
      online_rate += '%';
      [total, online, offline, online_rate].forEach((value, index) => {
        countList.value[index] && (countList.value[index].value = value);
      });
    }
  };
  const getDeviceList = useGetDeviceList();
  getDeviceList.params.size = 8;

  getDevicesStatusCounteData();
  getDeviceList.search();

  const handleRouteToDeviceChannel = (device) => {
    const { cmd_id = '', name = '' } = device;
    if (!(cmd_id || name)) {
      return Message.warning('未知设备信息');
    }
    router.push({ path: '/bigscreen/videos', query: { cmd_id, name } });
  };
</script>

<template>
  <div h="full" flex="~ col" overflow="hidden">
    <div m="b-4" flex="~" justify="between" items="center">
      <ul flex="~">
        <li
          m="x-5"
          flex="~ col"
          justify="center"
          items="center"
          position="relative"
          overflow="hidden"
          v-for="count in countList"
          :key="count.text"
        >
          <img flex="1" :src="count.icon" :alt="count.text" />
          <span position="absolute" top="1/4" p="x-1" w="full" text="center truncate">
            {{ count.value }}
          </span>
          <span flex="1" p="t-2" text="lg" :class="'color-' + count.color">
            {{ count.text }}
          </span>
        </li>
      </ul>
      <div m="r-4" flex="~" items="center">
        <label>在线状态</label>
        <div class="select-wrapper" m="x-4">
          <el-select
            popper-class="select-dropdown-wrapper"
            placeholder="请选择设备状态"
            v-model="getDeviceList.addtionalParams.status"
            @change="getDeviceList.search()"
          >
            <el-option label="不限状态" value="ALL"></el-option>
            <el-option label="在线" value="ONLINE"></el-option>
            <el-option label="离线" value="OFFLINE"></el-option>
          </el-select>
        </div>
        <div rounded ring="~ primary" p="x-2">
          <input
            border="none"
            bg="transparent"
            style="outline: none; line-height: 30px"
            type="text"
            placeholder="搜索设备"
            v-model="getDeviceList.params.keyword"
            @change="getDeviceList.search"
            @keyup.enter="getDeviceList.search"
          />
          <i class="i-material-symbols:search-rounded"></i>
        </div>
      </div>
    </div>
    <div flex="1 ~ col" overflow="hidden">
      <ul
        flex="1 ~ wrap"
        items="start"
        overflow="x-hidden y-auto"
        v-loading="getDeviceList.loading.value"
      >
        <li
          m="r-1 b-1"
          cursor="pointer"
          v-for="device in getDeviceList.list.value"
          :key="device.id"
          @click="handleRouteToDeviceChannel(device)"
        >
          <DeviceCard :device="device"></DeviceCard>
        </li>
      </ul>
      <div class="pager-wrapper">
        <el-pagination
          layout="total, prev, pager, next"
          :currentPage="getDeviceList.params.page"
          :pageSize="getDeviceList.params.size"
          :total="getDeviceList.total.value"
          @current-change="getDeviceList.pageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
