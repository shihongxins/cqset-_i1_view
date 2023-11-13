import { reactive, ref } from 'vue';
import { useListQueryEffect } from './useListLoadEffect';
import { request } from '../apis/request';
import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';

export const useGetStationList = () => {
  const addtionalParams = reactive({
    dept_id: 0,
  });

  const queryFunc = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await request.post('/pc/station/list', reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((line) => {
        line.updated_at = nativeFormat(line.updated_at);
        return line;
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
