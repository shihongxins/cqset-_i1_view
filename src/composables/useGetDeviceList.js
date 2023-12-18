import { reactive, ref } from 'vue';
import { request } from '../apis/request';
import { useI1CommonAPI } from '../apis/i1/common';
import { useListQueryEffect } from './useListLoadEffect';
import { nativeFormat, validateResponseCode } from '@shihongxins/jsutils';
import { DevTypeMapWithIcon } from '../utils/index';

const APII1Common = useI1CommonAPI('/pc/i1', request);

export const useGetDeviceList = () => {
  const addtionalParams = reactive({
    dept_id: 0,
    line_id: 0,
    tower_id: 0,
    status: 'ALL',
  });

  const queryFunc = async () => {
    const reqData = Object.assign({}, params, addtionalParams);
    loading.value = true;
    const [err, resData] = await APII1Common.dev.list(reqData);
    loading.value = false;
    if (!err && validateResponseCode(resData)) {
      list.value = [].concat(resData?.data || []).map((device) => {
        device.updated_at = nativeFormat(device.updated_at);
        const DevType = DevTypeMapWithIcon.get(String(device?.dev_type || 0));
        device.dev_type_desc = DevType?.desc;
        device.iconImage = DevType?.img;
        device.intro = {
          line_name: {
            desc: '线路',
          },
          tower_name: {
            desc: '杆塔',
          },
          dev_type_desc: {
            desc: '设备类型',
          },
          cmd_id: {
            desc: '设备编号',
          },
          updated_at: {
            desc: '更新时间',
          },
        };
        return device;
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
