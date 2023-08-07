import { reactive, ref } from 'vue';
import { request } from '../apis/request';
import { useListQueryEffect } from './useListLoadEffect';
import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';

export const useGetDeviceList = () => {
  const addtionalParams = reactive({
    status: 'ALL',
  });

  const queryFunc = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await request.post('/pc/i1/dev/list', reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((device) => {
        device.updated_at = nativeFormat(device.updated_at);
        return device;
      });
      total.value = resData?.total || this.deviceList.length;
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
