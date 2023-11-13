import { DevTypeMapWithIcon } from '../utils';
const GW_DEV_Routes = Array(9)
  .fill(0)
  .map((_, i) => {
    const DevType = DevTypeMapWithIcon.get(`${i + 1}`);
    if ([0, 1, 2, 4].includes(i + 1) || !(DevType && DevType.desc)) {
      return;
    }
    return {
      path: `gw/${i + 1}`,
      name: `GW_DEV_${i + 1}`,
      component: () => import('@/views/jsl_byne/GW/Device.vue'),
      meta: {
        text: `GW${DevType.desc}`,
        iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
        active: false,
      },
    };
  })
  .filter((r) => r);
/**
 * @type {import('vue-router').RouteRecord[]}
 */
export const routes = [
  {
    path: 'disaster',
    name: 'JSL_BYNR_Disaster',
    component: () => import('@/views/jsl_byne/Disaster/Devices.vue'),
    meta: {
      text: '地灾监测',
      iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
      active: false,
    },
  },
  {
    path: 'tower_tilt',
    name: 'JSL_BYNR_TowerTilt',
    component: () => import('@/views/jsl_byne/TowerTilt/Device.vue'),
    meta: {
      text: '杆塔倾斜',
      iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
      active: false,
    },
  },
  {
    path: 'wireless_temp/v2_device',
    name: 'JSL_BYNR_WirelessTemp',
    component: () => import('@/views/jsl_byne/WirelessTemp/V2/Device.vue'),
    meta: {
      text: '无线测温',
      iconClass: 'uno-icon-fix i-material-symbols:lists-rounded',
      active: false,
    },
  },
  ...GW_DEV_Routes,
];
