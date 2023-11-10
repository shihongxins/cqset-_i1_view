<script setup>
  import { DevTypeMapWithIcon } from '../../../utils';
  import { computed } from 'vue';
  import IconDeviceUnknown from '@/assets/images/icon-dev--unknown.png';

  const emits = defineEmits(['actionClick']);

  const props = defineProps({
    device: {
      type: Object,
      required: true,
    },
  });

  const deviceType = computed(() => {
    let { dev_type_desc, icon } = props.device || {};
    if (!(dev_type_desc || icon)) {
      const dev_type = DevTypeMapWithIcon.get(String(props.device?.dev_type || 0));
      dev_type_desc = dev_type?.desc;
      icon = dev_type?.icon;
    }
    return {
      desc: dev_type_desc || '未知设备类型',
      icon: icon || IconDeviceUnknown,
    };
  });

  const deviceStatus = computed(() => {
    let desc = props.device?.status ? '在线' : '离线';
    let className = props.device?.status ? 'online' : 'offline';
    return {
      desc,
      className,
    };
  });
</script>

<template>
  <div class="device-card">
    <div class="top">
      <div class="device-icon-wrapper">
        <img :src="deviceType.icon" :alt="deviceType.desc" :class="deviceStatus.className" />
      </div>
      <slot name="intro">
        <div class="device-intro">
          <template v-if="device.intro">
            <p v-for="(val, key) in device.intro" :key="key">
              <strong>{{ val.desc }}</strong>
              <b> ： </b>
              <span>{{ val.formatter ? val.formatter(device[key]) : device[key] }}</span>
            </p>
          </template>
          <p v-else>无设备简介信息</p>
        </div>
      </slot>
    </div>
    <div class="bottom">
      <p class="device-name">{{ device.name || '未命名设备' }}</p>
      <slot name="action">
        <button class="btn-action" @click="emits('actionClick')">
          <span :class="deviceStatus.className">{{ deviceStatus.desc }}</span>
          <span>详情</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .device {
    &-card {
      box-sizing: border-box;
      margin: auto;
      width: 100%;
      height: 100%;
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
    &-intro {
      flex: 1 1 0%;
      padding: 1em;
      overflow: hidden;
      font-size: 14px;
      & > * {
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
      width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .btn-action {
      padding: 2px 30px;
      width: 200px;
      height: 50px;
      background: url('@/assets/images/btn-default.png') center center/100% 100% no-repeat;
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
