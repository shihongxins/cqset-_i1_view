import ImgIconDevTypeUnknown from '@/assets/images/icon-dev--unknown.png';
import ImgIconDevTypeUnGun from '@/assets/images/icon-dev--gun.png';
import ImgIconDevTypeUnPTZ from '@/assets/images/icon-dev--ptz.png';

export const DevTypeMap = new Map([
  [
    0,
    {
      desc: '未知',
      icon: ImgIconDevTypeUnknown,
    },
  ],
  [
    1,
    {
      desc: '枪机',
      icon: ImgIconDevTypeUnGun,
    },
  ],
  [
    2,
    {
      desc: '云台',
      icon: ImgIconDevTypeUnPTZ,
    },
  ],
  [
    'GUN',
    {
      desc: '枪机',
      icon: ImgIconDevTypeUnGun,
    },
  ],
  [
    'PTZ',
    {
      desc: '云台',
      icon: ImgIconDevTypeUnPTZ,
    },
  ],
]);
