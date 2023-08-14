<script setup>
  import { computed, ref } from 'vue';
  import { useVideoStore } from '../stores/video';
  import { APII1 } from '../apis/i1/i1';
  import { getResponseMessage, isNumberInRange, validateResponseCode } from '@shihongxins/jsutils';
  import { Message, MessageBox } from 'element-ui';
  import { errorHandler } from '../apis/request/tools';
  import SnapTask from './SnapTask.vue';

  defineProps({
    togglePlayStatusWithMessage: {
      type: Function,
      required: true,
    },
  });
  const videoStore = useVideoStore();
  const vidoeStatus = computed(() => {
    return {
      className: videoStore.video.url ? 'playing' : 'paused',
      desc: videoStore.video.url ? '停止观看' : '观看直播',
    };
  });

  const flagSnaping = ref(false);
  const snap = async () => {
    if (flagSnaping.value) {
      return;
    }
    flagSnaping.value = true;
    let present = 255;
    if (videoStore.channel.channel_type === 'PTZ' && videoStore.presetSelected) {
      present = videoStore.presetSelected?.present_point;
    }
    const reqData = {
      cmd_id: videoStore.channel.cmd_id,
      channel_no: videoStore.channel.channel_no,
      present,
    };
    const [err, resData] = await APII1.ctrl
      .snap(reqData)
      .then(errorHandler.wrapDataToErrorFirstStyle);
    const isSuccess = !err && validateResponseCode(resData, 0);
    Message({
      type: isSuccess ? 'success' : 'error',
      message: `抓图${isSuccess ? '成功' : '失败' + getResponseMessage(resData || err, 30)}`,
    });
    setTimeout(() => {
      flagSnaping.value = false;
    }, 2 * 1000);
  };

  const flagRecording = ref(false);
  const recording = async () => {
    if (flagRecording.value) {
      return;
    }
    flagRecording.value = true;
    const cap_time = await MessageBox.prompt('请输入录像时长（单位：秒）', '手动录像', {
      inputValue: 10,
      inputPlaceholder: '短视频仅支持录像 10~255 秒',
      inputErrorMessage: '录像时长不合法',
      inputValidator: (value) => {
        if (!(value && /\d+/.test(value))) {
          return '录像时长不合法';
        }
        value = parseInt(value);
        if (!(10 <= value && value <= 255)) {
          return '录像时长超出范围';
        }
        return true;
      },
    })
      .then((data) => parseInt(data.value || 0))
      .catch(() => 0);
    if (cap_time) {
      let present = 255;
      if (videoStore.channel.channel_type === 'PTZ' && videoStore.presetSelected) {
        present = videoStore.presetSelected?.present_point;
      }
      const reqData = {
        cmd_id: videoStore.channel.cmd_id,
        channel_no: videoStore.channel.channel_no,
        present,
        cap_time,
      };
      const [err, resData] = await APII1.ctrl
        .recording(reqData)
        .then(errorHandler.wrapDataToErrorFirstStyle);
      const isSuccess = !err && validateResponseCode(resData, 0);
      Message({
        type: isSuccess ? 'success' : 'error',
        message: `下发录像命令${
          isSuccess ? '成功' : '失败' + getResponseMessage(resData || err, 30)
        }`,
      });
    }
    setTimeout(() => {
      flagRecording.value = false;
    }, cap_time * 1000);
  };

  const flagBusyKey = ref('');
  const handlePTZCtrlMousedown = async (key) => {
    if (flagBusyKey.value) return;
    flagBusyKey.value = key;
    await handlePTZCtrl();
  };
  const handlePTZCtrlMouseUp = () => {
    flagBusyKey.value = '';
  };
  const handlePTZCtrl = async (arg = {}) => {
    const KEYMAP = {
      up: 3,
      down: 4,
      left: 5,
      right: 6,
      focalZoomIn: 7,
      focalZoomOut: 8,
      apertureZoomIn: 100,
      apertureZoomOut: 101,
      gatherZoomIn: 102,
      gatherZoomOut: 103,
      presetGoto: 2,
      presetSave: 9,
    };
    const reqData = Object.assign(arg, {
      cmd_id: videoStore.channel.cmd_id,
      channel_no: videoStore.channel.channel_no,
      action: KEYMAP[flagBusyKey.value],
    });
    if (reqData.action) {
      const [err, resData] = await APII1.ctrl
        .ptz(reqData)
        .then(errorHandler.wrapDataToErrorFirstStyle);
      if (err || !validateResponseCode(resData, 0)) {
        Message.error(`云台控制出错：${getResponseMessage(resData || err, 30)}`);
      }
    }
  };

  const presetGoto = async (present_point = 0) => {
    if (videoStore.channel.channel_type === 'PTZ' && videoStore.presetSelected) {
      present_point = videoStore.presetSelected?.present_point;
    }
    if (present_point) {
      flagBusyKey.value = 'presetGoto';
      await handlePTZCtrlMousedown({
        action_arg: present_point,
      });
      handlePTZCtrlMouseUp();
    }
  };
  const presetSave = async () => {
    const memo = await MessageBox.prompt('请输入备注信息', '保存预置点位', {
      inputPlaceholder: '请输入备注信息',
    })
      .then(({ value = '' }) => value)
      .catch(() => '');
    let present_point = 0;
    if (videoStore.channel.channel_type === 'PTZ' && videoStore.presetSelected) {
      present_point = videoStore.presetSelected?.present_point;
    }
    if (!isNumberInRange(present_point, 0, 256)) {
      for (let i = 1; i < 256; i++) {
        if (
          videoStore.presetList.findIndex((preset) => preset.present_point === i) === -1 ||
          i === 255
        ) {
          present_point = i;
          break;
        }
      }
    }
    flagBusyKey.value = 'presetSave';
    await handlePTZCtrl({
      action_arg: present_point,
      memo,
    });
    handlePTZCtrlMouseUp();
  };
</script>

<template>
  <aside class="ptz-ctrl">
    <!-- 推流控制 -->
    <div class="group">
      <div class="group-title">
        <i class="icon i-material-symbols:video-camera-back"></i>
        <span>直播控制</span>
      </div>
      <div class="group-items ptz-ctrl--live">
        <button :class="vidoeStatus.className" @click="togglePlayStatusWithMessage">
          {{ vidoeStatus.desc }}
        </button>
        <button class="snap" v-loading="flagSnaping" @click="snap">抓图</button>
        <button class="recording" v-loading="flagRecording" @click="recording">录像</button>
      </div>
    </div>
    <!-- 定时任务 -->
    <div class="group">
      <div class="group-title">
        <i class="icon i-material-symbols:task-rounded"></i>
        <span>定时抓图</span>
      </div>
      <div class="group-items">
        <SnapTask>
          <button class="task">管理定时抓图任务</button>
        </SnapTask>
      </div>
    </div>
    <template v-if="videoStore.channel?.channel_type === 'PTZ'">
      <!-- 云台 -->
      <div class="group">
        <div class="group-title">
          <i class="icon i-material-symbols:camera-video-outline"></i>
          <span>云台控制</span>
        </div>
        <div class="group-items">
          <!-- 方向 -->
          <div class="direction">
            <button
              style="grid-area: t"
              class="icon el-icon-caret-top"
              @mousedown="handlePTZCtrlMousedown('up')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <button
              style="grid-area: r"
              class="icon el-icon-caret-right"
              @mousedown="handlePTZCtrlMousedown('right')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <button
              style="grid-area: b"
              class="icon el-icon-caret-bottom"
              @mousedown="handlePTZCtrlMousedown('buttom')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <button
              style="grid-area: l"
              class="icon el-icon-caret-left"
              @mousedown="handlePTZCtrlMousedown('left')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <button style="grid-area: c" class="icon el-icon-news center"></button>
          </div>
          <!-- 焦距 -->
          <div class="btn-group focal">
            <button
              class="el-icon-minus"
              @mousedown="handlePTZCtrlMousedown('focalZoomOut')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <span>焦距</span>
            <button
              class="el-icon-plus"
              @mousedown="handlePTZCtrlMousedown('focalZoomIn')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
          </div>
          <!-- 光圈 -->
          <div class="btn-group aperture">
            <button
              class="el-icon-minus"
              @mousedown="handlePTZCtrlMousedown('apertureZoomOut')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <span>光圈</span>
            <button
              class="el-icon-plus"
              @mousedown="handlePTZCtrlMousedown('apertureZoomIn')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
          </div>
          <!-- 聚焦 -->
          <div class="btn-group gather">
            <button
              class="el-icon-minus"
              @mousedown="handlePTZCtrlMousedown('gatherZoomOut')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
            <span>聚焦</span>
            <button
              class="el-icon-plus"
              @mousedown="handlePTZCtrlMousedown('gatherZoomIn')"
              @mouseup="handlePTZCtrlMouseUp"
              @mouseleave="handlePTZCtrlMouseUp"
            ></button>
          </div>
        </div>
      </div>
      <!-- 预置点位 -->
      <div class="group">
        <div class="group-title">
          <i class="icon i-material-symbols:stack-star-outline-rounded"></i>
          <span>预置点位</span>
        </div>
        <div class="group-items preset">
          <div class="select-wrapper">
            <el-select
              popper-class="select-dropdown-wrapper"
              placeholder="请选择预置点位"
              value-key="id"
              v-model="videoStore.presetSelected"
              @focus="videoStore.presetListLoad"
            >
              <el-option label="空预置点位（可新增）" :value="null"></el-option>
              <el-option
                v-for="preset in videoStore.presetList"
                :key="preset.present_point"
                :label="preset.memo"
                :value="preset"
              ></el-option>
            </el-select>
          </div>
          <button
            class="preset-goto el-icon-aim"
            :disabled="!videoStore.presetSelected"
            @click="presetGoto"
          >
            转到
          </button>
          <button class="preset-save el-icon-s-flag" @click="presetSave">保存</button>
        </div>
      </div>
    </template>
  </aside>
</template>

<style lang="scss" scoped>
  .ptz-ctrl {
    @apply color-content;
    .group {
      .group-title {
        @apply mb-2 flex items-center;
        .icon {
          @apply mr-2 text-2xl;
        }
      }
      .group-items {
        @apply mb-4 rounded-2 p-4 overflow-hidden bg-white/60;
      }
    }
    button {
      line-height: 2.5rem;
      @apply rounded-2 px-2 h-10 text-center truncate bg-transparent transition-all hover:scale-110;
      &.paused {
        @apply bg-primary;
      }
      &.playing {
        @apply bg-warning;
      }
      &.snap {
        @apply bg-content color-danger;
      }
      &.recording {
        @apply bg-danger;
      }
      &.task {
        @apply w-full bg-content color-primary ring ring-primary;
      }
      &[disabled],
      &:disabled {
        background: #fff !important;
        color: #666 !important;
        cursor: not-allowed !important;
      }
    }
    .ptz-ctrl--live {
      @apply flex flex-wrap;
      button {
        @apply flex-auto flex-shrink-0;
        &:first-child {
          @apply mb-2 w-full;
        }
      }
    }
    .direction {
      @apply m-a rounded-1/2 w-40 h-40 overflow-hidden bg-primary relative grid;
      grid-template-areas:
        '. t .'
        'l c r'
        '. b .';
      place-content: center;
      place-items: center;
      &::before,
      &::after {
        content: '';
        @apply absolute inset-0 z-0 top-1/2 -mt-0.5 h-1 bg-white rotate-45;
      }
      &::after {
        @apply rotate-135;
      }
      button {
        @apply relative z-1 w-10 text-center hover:text-2xl;
        &[class*='center'] {
          @apply m-2 rounded-1/2 bg-white color-primary;
        }
      }
    }
    .btn-group {
      @apply mt-2 rounded-2 flex items-center;
      &.focal {
        @apply bg-primary;
      }
      &.aperture {
        @apply bg-warning;
      }
      &.gather {
        @apply bg-danger;
      }
      > span {
        @apply flex-1 text-center border-x border-content;
      }
    }
    .preset {
      @apply flex flex-wrap;
      > * {
        @apply flex-auto flex-shrink-0;
      }
      .select-wrapper ::v-deep .el-input__inner {
        line-height: 2.5rem;
        height: 2.5rem;
        @apply mb-2 border-primary bg-primary/80 color-content;
      }
      .preset-goto {
        @apply bg-primary;
      }
      .preset-save {
        @apply bg-warning;
      }
    }
  }
</style>
