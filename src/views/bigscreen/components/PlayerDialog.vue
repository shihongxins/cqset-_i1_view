<script setup>
  import { ref } from 'vue';
  import { Message } from 'element-ui';
  import { useVideoStore } from '../../../stores/video';
  import LivePlayer from '@liveqing/liveplayer';
  import { getResponseMessage, validateResponseCode } from '@shihongxins/jsutils';
  import PTZCtrl from '../../../components/PTZCtrl.vue';

  const visible = ref(false);
  const device = ref(null);
  const videoStore = useVideoStore();

  const show = (channel) => {
    if (!(channel?.cmd_id && channel?.channel_no)) {
      return Message.warning('未知设备编号');
    }
    device.value = channel;
    visible.value = true;
    videoStore.channel = channel;
    togglePlayStatusWithMessage();
    window.addEventListener('beforeunload', videoStore.preventWindowClose);
  };
  const hidden = () => {
    videoStore.stop();
    videoStore.channel = null;
    window.removeEventListener('beforeunload', videoStore.preventWindowClose);
    device.value = null;
    visible.value = false;
  };
  const togglePlayStatusWithMessage = async () => {
    const [err, resData] = await videoStore.toggleStreamTransStatus();
    if (err || !validateResponseCode(resData, [0, 200])) {
      Message.error(`拉取设备视频流出错：${getResponseMessage(err || resData)}`);
    }
  };

  defineExpose({
    show,
    hidden,
  });
</script>

<template>
  <el-dialog
    width="100%"
    top="10rem"
    custom-class="player-dialog"
    modal-append-to-body
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    @close="hidden"
  >
    <div class="player-container">
      <div class="player-wrapper">
        <LivePlayer
          v-if="videoStore.video.url"
          :video-url="videoStore.video.url"
          :video-title="videoStore.title"
          :live="videoStore.video.isLive"
          class="player"
          aspect="fullscreen"
          autoplay
          custom-buttons="停止:el-icon-switch-button"
        >
        </LivePlayer>
        <i v-else class="el-icon-video-play" @click="togglePlayStatusWithMessage"></i>
      </div>
      <div class="player-control-wrapper">
        <PTZCtrl :togglePlayStatusWithMessage="togglePlayStatusWithMessage"></PTZCtrl>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    ::v-deep {
      .el-dialog__close {
        @apply text-3xl color-content hover:(color-warning);
      }
      .player-dialog {
        @apply absolute top-0 right-0 bottom-0 left-0 mb-10 px-4 box-border overflow-hidden bg-transparent flex flex-col;
        > * {
          @apply m-4 p-0;
        }
        .el-dialog__body {
          @apply flex-1 overflow-hidden;
        }
      }
      .player-container {
        @apply ring-2 ring-inset ring-primary rounded-2 w-full h-full overflow-hidden bg-black flex;
        .player-wrapper {
          margin: 0.125rem;
          @apply flex-1 overflow-hidden relative;
          .player {
            margin: 0;
            @apply h-full;
          }
          .el-icon-video-play {
            @apply absolute top-1/2 left-1/2 text-4xl -translate-1/2 color-content cursor-pointer hover:(scale-105 color-primary);
          }
        }
        .player-control-wrapper {
          @apply box-border p-4 w-60 h-full overflow-x-hidden overflow-y-auto bg-primary/20 ring-primary/90;
          background-image: linear-gradient(to right, transparent 30%, var(--un-ring-color));
        }
      }
    }
  }
</style>
