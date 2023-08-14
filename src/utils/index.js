import ImgIconDevTypeUnknown from '@/assets/images/icon-dev--unknown.png';
import ImgIconDevTypeUnGun from '@/assets/images/icon-dev--gun.png';
import ImgIconDevTypeUnPTZ from '@/assets/images/icon-dev--ptz.png';

import { DevTypeMap as I1DevTypeWithoutIcon } from '../apis/i1/common';

/**
 * @type {Map<number|string, {desc: string, icon?: any}>}
 */
export const DevTypeMap = new Map(
  [...I1DevTypeWithoutIcon].map((value) => {
    value[1].icon = ImgIconDevTypeUnknown;
    if ([1, 'GUN'].includes(value[0])) {
      value[1].icon = ImgIconDevTypeUnGun;
    }
    if ([2, 'PTZ'].includes(value[0])) {
      value[1].icon = ImgIconDevTypeUnPTZ;
    }
    return value;
  })
);
