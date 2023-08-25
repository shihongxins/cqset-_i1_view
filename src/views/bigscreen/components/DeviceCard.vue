<script setup>
  import { DevTypeMapWithIcon } from '../../../utils';
  import { computed } from 'vue';
  import { router } from '../../../router';
  import { Message } from 'element-ui';

  const props = defineProps({
    device: {
      type: Object,
      required: true,
    },
  });
  const deviceType = computed(() => {
    return DevTypeMapWithIcon.get(String(props.device?.dev_type || 0));
  });
  const deviceStatus = computed(() => {
    let desc = props.device?.status ? '在线' : '离线';
    let className = props.device?.status ? 'online' : 'offline';
    return {
      desc,
      className,
    };
  });

  const handleRouteToDeviceHistories = () => {
    const { cmd_id = '', name = '' } = props.device;
    if (!(cmd_id || name)) {
      return Message.warning('未知设备信息');
    }
    router.push({ path: '/bigscreen/histories', query: { cmd_id, name } });
  };
</script>

<template>
  <div class="device-card">
    <div class="top">
      <div class="device-icon-wrapper">
        <img :src="deviceType.icon" :alt="deviceType.desc" :class="deviceStatus.className" />
      </div>
      <ul class="device-info">
        <li>设备类型：{{ deviceType.desc }}</li>
        <li>设备编号：{{ device.cmd_id }}</li>
        <li>更新时间：{{ device.updated_at }}</li>
      </ul>
    </div>
    <div class="bottom">
      <p class="device-name">{{ device.name || '未命名设备' }}</p>
      <button class="btn-goto--history" @click.stop="handleRouteToDeviceHistories">
        <span :class="deviceStatus.className">{{ deviceStatus.desc }}</span>
        <span>历史</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .device {
    &-card {
      box-sizing: border-box;
      width: 28.5rem;
      height: 15.625rem;
      overflow: hidden;
      border: 1px solid transparent;
      border-image-repeat: repeat;
      border-image-source: url('@/assets/images/border-device.png');
      border-image-slice: 18 22 194 390 fill;
      // prettier-ignore
      border-image-width: 18PX 22PX 194PX 390PX;
      // prettier-ignore
      border-width: 18PX;
      display: flex;
      flex-flow: column;
      justify-content: center;
    }
    &-icon-wrapper {
      width: 130px;
      height: 130px;
      background: url('@/assets/images/border-devtype.png') center center/100% 100% no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-info {
      flex: 1 1 0%;
      padding: 1em;
      overflow: hidden;
      li {
        @apply truncate;
      }
    }
  }
  .top {
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .bottom {
    padding: 0 14px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .device-name {
      box-sizing: border-box;
      padding-right: 14px;
      width: 130px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .btn-goto--history {
      padding: 2px 30px;
      width: 200px;
      height: 50px;
      background: url('@/assets/images/btn-history.png') center center/100% 100% no-repeat;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      transition: transform 0.2s;
      :last-child {
        align-self: flex-end;
      }
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  .online {
    @apply color-success;
  }
  .offline {
    filter: grayscale(1);
    @apply color-info;
  }
</style>
