<script setup>
  import LivePlayer from '@liveqing/liveplayer';

  defineProps({
    info: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="his-log-prev-card">
    <div class="his-log-prev-wrapper">
      <el-image
        style="width: 100%; height: 100%"
        fit="contain"
        v-if="info.file_types === 1"
        :src="info.path"
        :alt="info.cmd_id + ':' + info.created_at"
        :preview-src-list="[info.path]"
      ></el-image>
      <LivePlayer
        v-else
        :video-url="info.path"
        :video-title="info.name"
        aspect="fullscreen"
        :autoplay="false"
        controls
      ></LivePlayer>
    </div>
    <el-popover trigger="hover" placement="top-start" popper-class="popover-poper-wrapper">
      <ul class="his-log-prev-desc-detail" :class="info.types">
        <li>设备编号 {{ info.cmd_id }}</li>
        <li>设备名称 {{ info.name }}</li>
        <li>通道序号 {{ info.channel_no }}</li>
        <li>通道名称 {{ info.channel_name }}</li>
        <li>预置点位 {{ info.present_no }}</li>
        <li>记录时间 {{ info.created_at }}</li>
        <li>记录类型 {{ info.types === 'alarm' ? '告警抓拍' : '普通抓拍' }}</li>
        <li v-show="info.types === 'alarm'">报警类型 {{ info.alarm_type }}</li>
      </ul>
      <p slot="reference" class="his-log-prev-desc" :class="info.types">
        <span>时间 {{ info.created_at }}</span>
        <span>{{ info.name || '未命名设备' }}</span>
        <span>通道 {{ info.channel_no }}</span>
        <span>预置点位 {{ info.present_no }}</span>
      </p>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
  .his-log-prev-card {
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-flow: column;
    .his-log-prev-wrapper {
      flex: 1 1 0;
      overflow: hidden;
      position: relative;
    }
    .his-log-prev-desc {
      margin: 0;
      padding: 0.5rem;
      font-size: 0.875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @apply ring-primary;
      background-image: linear-gradient(to top, var(--un-ring-color), transparent);
      > span {
        display: inline-block;
        margin-right: 1.5rem;
      }
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
      box-sizing: border-box;
      @apply ring ring-inset ring-primary;
    }
    .his-log-prev-desc {
      &,
      &-detail {
        @apply color-content;
        &.alarm {
          @apply color-warning;
        }
      }
    }
  }
</style>
