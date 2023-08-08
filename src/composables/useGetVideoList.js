import { reactive, ref } from 'vue';
import { useListQueryEffect } from './useListLoadEffect';
import { APIBigscreen } from '../apis/bigscreen';
import { useDFSStore } from '../stores/dfs';
import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';
import { DevTypeMap } from '../utils';

export const useGetVideoList = () => {
  const addtionalParams = reactive({
    status: 'ALL',
    cmd_id: '',
    media_type: 'all',
  });

  const queryFunc = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await APIBigscreen.dev(reqData);
    loading.value = false;
    const DFSStore = useDFSStore();
    if (!DFSStore.code) {
      await DFSStore.refresh();
    }
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((video) => {
        video.last_time = nativeFormat(video.last_time);
        video.path = video.path
          ? (video.path + `&code=${DFSStore.code}`).replace(/&download=1/, '')
          : '';
        video.dev_type_detail = DevTypeMap.get(video.dev_type || 0);
        video.channel_type_detail = DevTypeMap.get(video.channel_type || 0);
        video.status_detail = {
          desc: video.status ? '在线' : '离线',
          className: video.status ? 'online' : 'offline',
        };
        return video;
      });
      total.value = resData?.total || list.value.length;
    }
    error.value = err;
  };

  const error = ref(null);
  const { params, loading, list, total, search, resetSearch, pageChange, sizeChange } =
    useListQueryEffect(queryFunc, addtionalParams);

  return {
    addtionalParams,
    queryFunc,
    error,
    params,
    loading,
    list,
    total,
    search,
    resetSearch,
    pageChange,
    sizeChange,
  };
};
