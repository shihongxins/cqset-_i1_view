/**
 * @type {import('vue-router').RouteRecord[]}
 */
export const routes = [
  {
    path: 'devices',
    name: 'DashboardDevices',
    component: () => import('@/views/dashboard/DashBoardDevices.vue'),
    meta: {
      text: '设备',
      iconClass: 'i-material-symbols:lists-rounded',
      active: false,
    },
  },
  {
    path: 'video',
    name: 'DashboardVideo',
    component: () => import('@/views/dashboard/DashBoardDevices.vue'),
    meta: {
      text: '视频',
      iconClass: 'i-material-symbols:camera-video-outline',
      active: false,
    },
  },
  {
    path: 'history',
    name: 'DashboardHistory',
    component: () => import('@/views/dashboard/DashBoardDevices.vue'),
    meta: {
      text: '历史',
      iconClass: 'i-material-symbols:image-search-rounded',
      active: false,
    },
  },
  {
    path: 'alarms',
    name: 'DashboardAlarms',
    component: () => import('@/views/dashboard/DashBoardDevices.vue'),
    meta: {
      text: '告警',
      iconClass: 'i-material-symbols:detector-alarm-outline-rounded',
      active: false,
    },
  },
  {
    path: 'logs',
    name: 'DashboardLogs',
    component: () => import('@/views/dashboard/DashBoardDevices.vue'),
    meta: {
      text: '日志',
      iconClass: 'i-material-symbols:docs-outline',
      active: false,
    },
  },
];
