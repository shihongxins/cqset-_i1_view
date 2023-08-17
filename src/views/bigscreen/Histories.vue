<script setup>
  import { useGetLineList } from '../../composables/useGetLineList';
  import { useGetTowerList } from '../../composables/useGetTowerList';
  import { useGetDeviceList } from '../../composables/useGetDeviceList';
  import { useListQueryEffect } from '../../composables/useListLoadEffect';
  import { computed, reactive, ref } from 'vue';
  import { APIBigscreen } from '../../apis/bigscreen';
  import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';
  import dayjs from 'dayjs';
  import HistoryAndLogPreviewCard from './components/HistoryAndLogPreviewCard.vue';
  import useDFSStore from '../../stores/dfs';
  import { router } from '../../router';

  const getLineList = useGetLineList();
  const changeLine = (line_id = 0) => {
    getTowerList.addtionalParams.line_id = line_id;
    getTowerList.list.value = [];
    getDeviceList.addtionalParams.line_id = line_id;
    getDeviceList.addtionalParams.tower_id = 0;
    getDeviceList.list.value = [];
    addtionalParams.line_id = line_id;
    addtionalParams.tower_id = 0;
    addtionalParams.cmd_id = '';
    search();
  };
  const getTowerList = useGetTowerList();
  const changeTower = (tower_id = 0) => {
    getDeviceList.addtionalParams.tower_id = tower_id;
    getDeviceList.list.value = [];
    addtionalParams.tower_id = tower_id;
    addtionalParams.cmd_id = '';
    search();
  };
  const getDeviceList = useGetDeviceList();

  const DFSStore = useDFSStore();
  const originAddtionalParams = () => ({
    dept_id: 0,
    line_id: 0,
    tower_id: 0,
    cmd_id: '',
    media_type: 'all', // all, image, video
    start_date: '',
    end_date: '',
  });
  const addtionalParams = reactive(originAddtionalParams());
  const date = ref(new Date());
  const queryFun = async () => {
    if (date.value) {
      addtionalParams.start_date = dayjs(date.value).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      addtionalParams.end_date = dayjs(date.value).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await APIBigscreen.histories(reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      if (!DFSStore.code) {
        await DFSStore.refresh();
      }
      list.value = [].concat(resData?.data || []).map((history) => {
        history.path = (history.path ? `${history.path}&code=${DFSStore.code}` : '').replace(
          'download=1',
          ''
        );
        history.created_at = nativeFormat(history.created_at);
        return history;
      });
      total.value = resData?.total || list.value.length;
    }
  };
  const adpterResetSearch = (ev) => {
    const searchParams = originAddtionalParams();
    date.value = new Date();
    resetSearch(ev, Object.assign({ size: 4, sort: 'desc' }, searchParams));
  };
  const { params, loading, list, total, pageChange, sizeChange, search, resetSearch } =
    useListQueryEffect(queryFun, addtionalParams);

  const route = router.currentRoute;
  const { cmd_id = '', name = '' } = route?.query || {};
  addtionalParams.cmd_id = cmd_id;
  params.keyword = name;
  params.size = 4;
  params.sort = 'desc';
  search();

  const refDOMItemsContainer = ref(null);
  const itemsDynamicWidth = computed(() => {
    let w = 'auto';
    const containerStyle = getComputedStyle(refDOMItemsContainer.value);
    w = (16 / 9) * (parseFloat(containerStyle.height) / Math.sqrt(params.size));
    w = w ? parseFloat(w).toFixed(4) + 'px' : 'auto';
    console.log(Date.now());
    return w;
  });
</script>

<template>
  <div h="full" overflow="hidden" flex="~ col">
    <div m="4" flex="~" justify="end" items="center">
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
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          placeholder="请选择所属设备"
          v-model="addtionalParams.cmd_id"
          filterable
          remote
          reserve-keyword
          :remote-method="getDeviceList.search"
          :loading="getDeviceList.loading.value"
          @focus="getDeviceList.search()"
          @change="search()"
        >
          <el-option label="不限设备" value=""></el-option>
          <el-option
            v-for="device in getDeviceList.list.value"
            :key="device.cmd_id"
            :label="device.name"
            :value="device.cmd_id"
          ></el-option>
        </el-select>
      </div>
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          placeholder="请选择查询对象"
          v-model="addtionalParams.media_type"
          @change="search()"
        >
          <el-option label="所有媒体" value="all"></el-option>
          <el-option label="图片" value="image"></el-option>
          <el-option label="视频" value="video"></el-option>
        </el-select>
      </div>
      <div class="date-time-picker-wrapper">
        <el-date-picker
          style="width: 9rem"
          popper-class="date-time-picker-dropdown-wrapper"
          type="date"
          placeholder="选择日期"
          v-model="date"
          @change="search"
        >
        </el-date-picker>
      </div>
      <button
        h="8"
        w="20"
        rounded-2
        text="center"
        bg="primary/80"
        color="warning"
        @click="adpterResetSearch"
      >
        重置查询
      </button>
      <label m="l-4">布局</label>
      <div class="select-wrapper">
        <el-select v-model="params.size" @change="sizeChange">
          <el-option label="1 X 1" :value="1"></el-option>
          <el-option label="2 X 2" :value="4"></el-option>
          <el-option label="3 X 3" :value="9"></el-option>
          <el-option label="4 X 4" :value="16"></el-option>
        </el-select>
      </div>
    </div>
    <div flex="1 ~ col" overflow="hidden">
      <ul
        class="items-container"
        :class="`items-grid-count-${params.size}`"
        ref="refDOMItemsContainer"
      >
        <li
          class="item-wrapper"
          v-for="item in list"
          :style="{ width: itemsDynamicWidth }"
          :key="item.id"
        >
          <HistoryAndLogPreviewCard :info="item"></HistoryAndLogPreviewCard>
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
  </div>
</template>

<style lang="scss" scoped>
  .select-wrapper,
  .date-time-picker-wrapper {
    @apply ml-4 mr-2;
  }
  .items-container {
    flex: 1 1 0;
    overflow: hidden;
    display: grid;
    justify-items: center;
    &.items-grid-count {
      &-1 {
        grid-template-rows: repeat(1, 1fr);
        grid-template-columns: repeat(1, 1fr);
      }
      &-4 {
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: repeat(2, 1fr);
      }
      &-9 {
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
      }
      &-16 {
        grid-template-rows: repeat(4, 1fr);
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
  .item-wrapper {
    padding: 0.5rem;
    overflow: hidden;
  }
</style>
