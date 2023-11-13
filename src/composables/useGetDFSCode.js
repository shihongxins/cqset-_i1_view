import { validateResponseCode } from '@shihongxins/jsutils';
import { request } from '../apis/request';

export const useGetDFSCode = async () => {
  let code = '';
  const [err, resData] = await request.post('/pc/dfs/get_code');
  if (!err && validateResponseCode(resData)) {
    code = resData.data.code;
  }
  return code;
};
