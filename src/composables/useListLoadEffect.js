import { reactive, ref } from 'vue';
import { assignCommonProperty } from '@shihongxins/jsutils';

export const useListQueryEffect = (queryFunc, additionalParams) => {
  if (typeof queryFunc !== 'function') {
    throw new Error('useListQueryEffect require the param "queryFunc" must be a function');
  }
  const originParams = () => ({
    page: 1,
    size: 10,
    sort: 'asc',
    keyword: '',
  });
  const params = reactive(originParams());
  const loading = ref(false);
  const list = ref([]);
  const total = ref(0);

  const pageChange = async (page = 1) => {
    params.page = Math.max(parseInt(page), 1);
    return await queryFunc();
  };
  const sizeChange = async (size = 10) => {
    params.page = 1;
    params.size = Math.max(parseInt(size), 1);
    return await queryFunc();
  };
  const sortChange = async (sort = 'asc') => {
    sort = String(sort).toLowerCase();
    params.sort = ['asc', 'desc'].includes(sort) ? sort : 'asc';
    return await queryFunc();
  };
  const search = async (event, searchParams) => {
    if (typeof searchParams === 'string') {
      params.keyword = searchParams;
    } else if (searchParams) {
      assignCommonProperty(params, searchParams);
      assignCommonProperty(additionalParams, searchParams);
    } else if (typeof event === 'string') {
      params.keyword = event;
    }
    params.page = 1;
    return await queryFunc();
  };
  const resetSearch = async (event, searchParams) => {
    Object.assign(params, originParams());
    search(event, searchParams);
  };

  return {
    params,
    loading,
    list,
    total,
    pageChange,
    sizeChange,
    sortChange,
    search,
    resetSearch,
  };
};
