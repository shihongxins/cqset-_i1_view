<script setup>
  import { useGetVideoList } from '../../composables/useGetVideoList';
  import VideoCard from './components/VideoCard.vue';
  import { router } from '../../router';
  import { Message } from 'element-ui';
  import PlayerDialog from './components/PlayerDialog.vue';
  import { ref } from 'vue';

  const getVideoList = useGetVideoList();
  getVideoList.params.size = 8;

  const route = router.currentRoute;
  const { cmd_id = '', name = '' } = route?.query || {};
  getVideoList.addtionalParams.cmd_id = cmd_id;
  getVideoList.params.keyword = name;

  getVideoList.search();

  const refPlayerDialog = ref(null);
  const handleShowVideoPlayer = (video) => {
    const { cmd_id = '', name = '' } = video;
    if (!(cmd_id || name)) {
      return Message.warning('未知设备信息');
    }
    refPlayerDialog.value.show(video);
  };
</script>

<template>
  <div h="full" flex="~ col" overflow="hidden">
    <div m="4" flex="~" justify="end" items="center">
      <label m="l-8 r-2">在线状态</label>
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          placeholder="请选择设备状态"
          v-model="getVideoList.addtionalParams.status"
          @change="getVideoList.search()"
        >
          <el-option label="不限状态" value="ALL"></el-option>
          <el-option label="在线" value="ONLINE"></el-option>
          <el-option label="离线" value="OFFLINE"></el-option>
        </el-select>
      </div>
      <label m="l-8 r-2">设备类型</label>
      <div class="select-wrapper">
        <el-select
          popper-class="select-dropdown-wrapper"
          placeholder="请选择设备类型"
          v-model="getVideoList.addtionalParams.media_type"
          @change="getVideoList.search()"
        >
          <el-option label="不限类型" value="all"></el-option>
          <el-option label="枪机" value="image"></el-option>
          <el-option label="云台" value="video"></el-option>
        </el-select>
      </div>
      <div rounded ring="~ primary" m="l-8" p="x-2">
        <input
          border="none"
          bg="transparent"
          style="outline: none; line-height: 30px"
          type="text"
          placeholder="搜索设备"
          v-model="getVideoList.params.keyword"
          @change="getVideoList.search"
          @keyup.enter="getVideoList.search"
        />
        <i class="icon uno-icon-fix i-material-symbols:search-rounded"></i>
      </div>
    </div>
    <div flex="1 ~ col" overflow="hidden">
      <ul
        flex="1 ~ wrap"
        items="start"
        overflow="x-hidden y-auto"
        v-loading="getVideoList.loading.value"
      >
        <li
          m="r-1 b-1"
          cursor="pointer"
          v-for="video in getVideoList.list.value"
          :key="video.id"
          @click="handleShowVideoPlayer(video)"
        >
          <VideoCard :video="video"></VideoCard>
        </li>
      </ul>
      <div class="pager-wrapper">
        <el-pagination
          layout="total, prev, pager, next"
          :currentPage="getVideoList.params.page"
          :pageSize="getVideoList.params.size"
          :total="getVideoList.total.value"
          @current-change="getVideoList.pageChange"
        ></el-pagination>
      </div>
    </div>
    <div position="fixed -z-1">
      <PlayerDialog ref="refPlayerDialog"></PlayerDialog>
    </div>
  </div>
</template>
