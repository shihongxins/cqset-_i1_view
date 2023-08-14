import { defineStore } from 'pinia';
import { APII1 } from '../apis/i1/i1';
import { validateResponseCode } from '@shihongxins/jsutils';

export const useVideoStore = defineStore('Video', {
  state() {
    return {
      channel: null,
      video: {
        url: '',
        isLive: false,
      },
      /**
       * @type {null|import('../apis/i1/i1.js').I1PresentPoint}
       */
      presetSelected: null,
      /**
       * @type {import('../apis/i1/i1.js').I1PresentPoint[]}
       */
      presetList: [],
    };
  },
  getters: {
    title() {
      let { name = '未命名设备', channel_name, cmd_id } = this.channel || {};
      return `${name} ${channel_name || cmd_id}`;
    },
    onLivePlaying() {
      return Boolean((this.video.isLive && this.video.url) || window.i1VideoInfo);
    },
  },
  actions: {
    /**
     * 阻止窗口异常关闭
     * @param {BeforeUnloadEvent} e
     */
    preventWindowClose(e) {
      if (this.video.isLive || window.i1VideoInfo) {
        this.stop();
        let now = new Date();
        while (new Date() - now < 100) {
          console.log('stopping video stream');
        }
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    },
    async toggleStreamTransStatus() {
      const reqData = {
        cmd_id: this.channel?.cmd_id || window.i1VideoInfo?.cmd_id || '',
        channel_no: this.channel?.channel_no || window.i1VideoInfo?.channel_no || 0,
        control: this.onLivePlaying ? 0 : 1, // 0 停止推流， 1 开始推流
      };
      const [err, resData] = await APII1.ctrl.video(reqData);
      if (!err && validateResponseCode(resData, [0, 200])) {
        this.video.isLive = Boolean(reqData.control && resData?.data?.play_url);
      } else {
        this.video.isLive = false;
      }
      window.i1VideoInfo = reqData;
      setTimeout(() => {
        if (this.video.isLive) {
          this.play(resData.data.play_url);
        } else {
          this.stop(false);
        }
      }, 0);
      return [err, resData];
    },
    play(url = '') {
      if (url) {
        this.video.url = url;
      }
    },
    stop(autoCheck = true) {
      if (autoCheck && this.onLivePlaying) {
        this.toggleStreamTransStatus();
      }
      window.i1VideoInfo = void 0;
      this.video = {
        isLive: false,
        url: '',
      };
    },
    async presetListLoad() {
      this.presetList = [];
      this.presetSelected = null;
      let err, resData;
      if (this.channel?.channel_type === 'PTZ') {
        const reqData = {
          cmd_id: this.channel.cmd_id,
          channel_no: this.channel.channel_no,
          page: 1,
          size: 255,
        };
        [err, resData] = await APII1.preset.list(reqData);
        if (!err && validateResponseCode(resData)) {
          this.presetList = resData.data
            .map((preset) => {
              preset.present_point += 0;
              preset.memo = preset?.memo ? preset.memo : `预置点位 ${preset.present_point}`;
              return preset;
            })
            .filter((preset) => preset?.present_point > 0)
            .sort((a, b) => a.present_point - b.present_point);
        }
      }
      return [err, resData];
    },
  },
});
