/**
 * @type {import('vue-router').RouteRecord[]}
 */
export const routes = [
  {
    path: 'devices',
    name: 'BigscreenDevices',
    component: () => import('@/views/bigscreen/Devices.vue'),
    meta: {
      text: '设备',
      iconClass: 'i-material-symbols:lists-rounded',
      active: false,
    },
  },
  {
    path: 'videos',
    name: 'BigscreenVideos',
    component: () => import('@/views/bigscreen/Videos.vue'),
    meta: {
      text: '视频',
      iconClass: 'i-material-symbols:camera-video-outline',
      active: false,
    },
  },
  {
    path: 'histories',
    name: 'BigscreenHistories',
    component: () => import('@/views/bigscreen/Histories.vue'),
    meta: {
      text: '历史',
      iconClass: 'i-material-symbols:image-search-rounded',
      active: false,
    },
  },
  {
    path: 'alarms',
    name: 'BigscreenAlarms',
    component: () => import('@/views/bigscreen/Alarms.vue'),
    meta: {
      text: '告警',
      iconClass: 'i-material-symbols:detector-alarm-outline-rounded',
      active: false,
    },
  },
  {
    path: 'logs',
    name: 'BigscreenLogs',
    component: () => import('@/views/bigscreen/Logs.vue'),
    meta: {
      text: '日志',
      iconClass: 'i-material-symbols:docs-outline',
      active: false,
    },
  },
];
