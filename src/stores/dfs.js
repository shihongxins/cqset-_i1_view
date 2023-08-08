import { defineStore } from 'pinia';
import { request } from '../apis/request';
import { validateResponseCode } from '@shihongxins/jsutils';

const useDFSStore = defineStore('DFS', {
  state() {
    return {
      code: '',
    };
  },
  actions: {
    async refresh() {
      const [err, resData] = await request.post('/pc/dfs/get_code');
      if (!err && validateResponseCode(resData)) {
        this.code = resData.data?.code || '';
      }
    },
  },
});

export { useDFSStore, useDFSStore as default };
