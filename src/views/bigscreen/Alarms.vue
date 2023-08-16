<script setup>
  import { useGetLineList } from '../../composables/useGetLineList';
  import { useGetTowerList } from '../../composables/useGetTowerList';
  import { useGetDeviceList } from '../../composables/useGetDeviceList';
  import { useListQueryEffect } from '../../composables/useListLoadEffect';
  import { reactive, ref } from 'vue';
  import { APIBigscreen } from '../../apis/bigscreen';
  import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';
  import dayjs from 'dayjs';
  import useDFSStore from '../../stores/dfs';
  import HistoryAndLogPreviewCard from './components/HistoryAndLogPreviewCard.vue';
  import LogClear from '../../components/LogClear.vue';
  import { request } from '../../apis/request';

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
    const [err, resData] = await APIBigscreen.alarms(reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      if (!DFSStore.code) {
        await DFSStore.refresh();
      }
      list.value = [].concat(resData?.data || []).map((alarm) => {
        alarm.path = (alarm.path ? `${alarm.path}&code=${DFSStore.code}` : '').replace(
          'download=1',
          ''
        );
        alarm.created_at = nativeFormat(alarm.created_at);
        return alarm;
      });
      total.value = resData?.total || list.value.length;
    }
  };
  const adpterResetSearch = (ev) => {
    const searchParams = originAddtionalParams();
    date.value = new Date();
    resetSearch(ev, Object.assign({ size: 10, sort: 'desc' }, searchParams));
  };
  const { params, loading, list, total, pageChange, search, resetSearch } = useListQueryEffect(
    queryFun,
    addtionalParams
  );

  params.sort = 'desc';
  search();

  const onPreview = ref(false);
  const previewData = ref(null);
  const handlePreview = (alarm = null) => {
    previewData.value = alarm;
    onPreview.value = alarm?.id > 0;
  };
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
    </div>
    <div flex="1 ~ col" overflow="hidden">
      <div flex="1" overflow="hidden" class="table-wrapper">
        <el-table height="100%" border :data="list">
          <!-- <el-table-column type="selection" width="40px"></el-table-column> -->
          <el-table-column label="所属线路" prop="line_name"></el-table-column>
          <el-table-column label="所属杆塔" prop="tower_name"></el-table-column>
          <el-table-column label="设备名称" prop="name"></el-table-column>
          <el-table-column label="设备编号" prop="cmd_id"></el-table-column>
          <el-table-column label="通道号" prop="channel_no"></el-table-column>
          <el-table-column label="预置点位" prop="present_no"></el-table-column>
          <el-table-column label="告警时间" prop="created_at"></el-table-column>
          <el-table-column label="告警内容" prop="alarm_name"></el-table-column>
          <el-table-column label="告警状态" prop="clear_id" align="center">
            <template #default="{ row }">
              <!-- <span >{{  }}</span> -->
              <LogClear
                v-if="row.types === 'alarm'"
                :request="request"
                :id="row.id"
                :clear_id="row.clear_id"
                options_table="i1_images_video"
                @updateClearInfo="search"
              >
                <el-link type="warning" icon="el-icon-edit-outline">处理消缺</el-link>
              </LogClear>
              <span v-else> 未告警 </span>
            </template>
          </el-table-column>
          <el-table-column label="查看抓拍" prop="path" align="center">
            <template #default="{ row }">
              <el-link type="primary" icon="el-icon-view" @click="handlePreview(row)">
                查看抓拍
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <el-drawer
      custom-class="drawer-wrapper-main"
      :with-header="false"
      :visible.sync="onPreview"
      :before-close="handlePreview"
      destroy-on-close
      append-to-body
    >
      <div
        box="border"
        p="4"
        w="full"
        h="full"
        overflow="hidden"
        flex="~ col"
        justify="center"
        items="center"
      >
        <div w="full" h="100" ring="~ ring-2 ring-primary">
          <HistoryAndLogPreviewCard :info="previewData"></HistoryAndLogPreviewCard>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
  .select-wrapper,
  .date-time-picker-wrapper {
    @apply ml-4 mr-2;
  }
</style>
