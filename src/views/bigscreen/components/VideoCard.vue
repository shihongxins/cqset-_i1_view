<script setup>
  defineProps({
    video: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="video-card">
    <el-image class="video-cover" alt="视频封面" fit="contain" :src="video.path">
      <template #error>
        <div class="video-cover-error">
          <i class="el-icon-picture-outline"></i>
          <p>暂无最新图片</p>
        </div>
      </template>
    </el-image>
    <div class="video-info">
      <el-popover trigger="hover" placement="top-start" popper-class="popover-poper-wrapper">
        <ul class="video-detail">
          <li>设备类型 {{ video.dev_type_detail.desc }}</li>
          <li>设备编号 {{ video.cmd_id }}</li>
          <li>设备名称 {{ video.name }}</li>
          <li>设备状态 {{ video.status_detail.desc }}</li>
          <li>通道类型 {{ video.channel_type_detail.desc }}</li>
          <li>通道序号 {{ video.channel_no }}</li>
          <li>通道名称 {{ video.channel_name }}</li>
          <li>最新时间 {{ video.last_time }}</li>
        </ul>
        <p slot="reference" class="video-resume" :class="video.status_detail.className">
          <span> {{ video.last_time }} </span>
          <span>{{ video.channel_type_detail.desc }}</span>
          <span>{{ video.name }}</span>
          <span>{{ video.channel_name }}</span>
        </p>
      </el-popover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .video {
    &-card {
      box-sizing: border-box;
      width: 28rem;
      height: 17rem;
      overflow: hidden;
      border: 1px solid transparent;
      border-image-repeat: repeat;
      border-image-source: url('@/assets/images/border-channel.png');
      border-image-slice: 60 60 60 60 fill;
      // prettier-ignore
      border-image-width: 60PX 60PX 60PX 60PX;
      // prettier-ignore
      border-width: 32PX 18PX 20PX;
      // prettier-ignore
      border-radius: 10PX;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    &-cover {
      flex: 1;
      // prettier-ignore
      border-radius: 20PX;
      width: 100%;
      height: 100%;
      &::v-deep &-error {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
    }
    &-info {
      position: absolute;
      inset: 0;
      z-index: 1;
      top: auto;
      // prettier-ignore
      border-radius: 0 0 20PX 20PX;
      overflow: hidden;
      @apply shadow-primary;
      background: linear-gradient(to top, var(--un-shadow-color), transparent);
    }
    &-resume {
      padding: 0.5em 1em;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        padding: 0 1em;
      }
    }
    &-detail {
      width: 15rem;
      color: white;
      li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
