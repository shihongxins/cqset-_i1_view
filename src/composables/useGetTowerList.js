import { reactive, ref } from 'vue';
import { useListQueryEffect } from './useListLoadEffect';
import { request } from '../apis/request';
import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';

export const useGetTowerList = () => {
  const addtionalParams = reactive({
    dept_id: 0,
    line_id: 0,
  });

  const queryFunc = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await request.post('/pc/tower/list', reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((tower) => {
        tower.updated_at = nativeFormat(tower.updated_at);
        return tower;
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
