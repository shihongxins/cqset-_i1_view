import ImgIconDevTypeUnknown from '@/assets/images/icon-dev--unknown.png';
import ImgIconDevTypeUnGun from '@/assets/images/icon-dev--gun.png';
import ImgIconDevTypeUnPTZ from '@/assets/images/icon-dev--ptz.png';

import { DevTypeMap, ChannelDevTypeMap } from '../apis/i1/common';

/**
 * @type {Map<number|string, {desc: string, img?: any}>}
 */
export const DevTypeMapWithIcon = new Map(
  [...Object.entries(DevTypeMap), ...Object.entries(ChannelDevTypeMap)].map((item) => {
    const value = {
      desc: item[1]['name'] || item[1]['zh'] || item[1],
      img: ImgIconDevTypeUnknown,
    };
    if (['1', 'GUN'].includes(item[0])) {
      value.img = ImgIconDevTypeUnGun;
    }
    if (['2', 'PTZ'].includes(item[0])) {
      value.img = ImgIconDevTypeUnPTZ;
    }
    return [item[0], value];
  })
);
