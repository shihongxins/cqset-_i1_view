<!--
  2023-08-16 09:47
-->
<template>
  <span>
    <span @click="handleClear">
      <slot>
        <el-button size="mini" type="warning">处理消缺</el-button>
      </slot>
    </span>
    <el-dialog
      title="消缺信息"
      :visible.sync="dialogVisiable"
      destroy-on-close
      :close-on-click-modal="false"
      append-to-body
      width="500px"
      class="clear-dialog"
    >
      <el-form
        ref="clearInfoForm"
        :model="clearInfo"
        :rules="clearInfoRules"
        size="mini"
        label-position="left"
        label-width="6em"
        v-loading="clearInfoLoading"
      >
        <el-form-item label="是否消缺" prop="is_clear">
          <el-radio-group v-model="clearInfo.is_clear">
            <el-radio-button :label="false">否</el-radio-button>
            <el-radio-button :label="true">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理人" prop="clear_people">
          <el-input v-model="clearInfo.clear_people" placeholder="请输入处理人姓名"></el-input>
        </el-form-item>
        <el-form-item label="处理方式" prop="clear_desc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="clearInfo.clear_desc"
            placeholder="请简述处理方式"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理图片" prop="clear_pics">
          <div class="uploader" @click="handleSelectPic">
            <img
              v-if="clearInfo.clear_pics"
              :src="clearInfo.clear_pics"
              :alt="clearInfo.clear_pics"
              class="uploader-preview"
            />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </div>
        </el-form-item>
        <el-form-item label="处理时间" prop="clear_time">
          <el-date-picker
            v-model="clearInfo.clear_time"
            type="datetime"
            placeholder="选择处理时间"
            default-time="12:00:00"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="danger" @click="delClear" v-if="clearInfo.clear_id"
          >删除记录</el-button
        >
        <el-button size="mini" type="primary" @click="setClear">保存记录</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
  import {
    showOpenFilePicker,
    validateResponseCode,
    getResponseMessage,
    assignCommonProperty,
  } from '@shihongxins/jsutils';
  import { MessageBox } from 'element-ui';
  export default {
    props: {
      /**
       * @type {import('axios').AxiosInstance}
       */
      request: {
        required: true,
      },
      // 摄像机类型，通过此类型查找对应日志表
      /*
      1: "camera_log", // 摄像机日志
      3: "control_ball_log", // 布控球日志
      18: "camera_panorama_log", // 全景
      26: "fishing_log", // 钓鱼日志
      27: "safety_hat_log", // 安全帽（一体）日志
      */
      class_id: {
        type: Number,
      },
      // 传感器没有类型，直接传入表名
      /*
      "lightning_history_log" 故障定位
      "tower_tilt_warning"  杆塔倾斜
      "safe_distance_log" 防触电预警
      */
      options_table: {
        type: String,
        default: () => '',
      },
      // 日志 id
      id: {
        required: true,
        type: Number,
      },
      // 消缺 id
      clear_id: {
        required: true,
        type: Number,
      },
    },
    data() {
      return {
        dialogVisiable: false,
        clearInfoLoading: false,
        clearInfo: {
          clear_desc: '',
          clear_id: 0,
          clear_people: '',
          clear_pics: '',
          clear_time: new Date(),
          id: 0,
          is_clear: true,
          option: 'camera_log',
        },
        clearInfoRules: {
          clear_people: [{ required: true, message: '请输入处理人姓名', trigger: 'blur' }],
        },
        imgObj: null,
      };
    },
    computed: {
      logCanBeClear() {
        return Boolean(this.id && this.class_id && this.options_table);
      },
    },
    watch: {
      imgObj: {
        deep: true,
        handler: function (newRawFile) {
          if (newRawFile && String(newRawFile.type).indexOf('image') > -1) {
            if (URL && URL.createObjectURL) {
              this.clearInfo.clear_pics = URL.createObjectURL(newRawFile);
            } else {
              this.clearInfo.clear_pics = btoa(newRawFile);
            }
          }
        },
      },
    },
    methods: {
      // 处理消缺
      handleClear() {
        this.getClear();
        this.dialogVisiable = true;
      },
      // 选中文件
      async handleSelectPic() {
        this.imgObj = null;
        try {
          const selected = await showOpenFilePicker({
            excludeAcceptAllOption: true,
            types: [{ description: 'Image', accept: { 'image/*': [] } }],
          });
          if (selected && selected.length) {
            const file = await selected[0].getFile();
            if (file && file.type && file.type.indexOf('image') > -1) {
              this.imgObj = file;
            } else {
              throw new Error('非图片类型');
            }
          } else {
            throw new Error('未选择文件');
          }
        } catch (error) {
          this.$message.error('选择文件出错：' + getResponseMessage(error));
        }
      },
      async setClear() {
        this.clearInfoLoading = true;
        try {
          const valid = await this.$refs.clearInfoForm.validate().catch(() => false);
          let imgUrl;
          if (valid && this.clearInfo.option && this.imgObj) {
            const fmData = new FormData();
            fmData.append('files', this.imgObj);
            imgUrl = await this.request
              .post('/sys/upload', fmData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                userIntercetorsConfig: {
                  request: true,
                  response: {
                    useErrorFirstStyle: false,
                  },
                },
              })
              .then((resData) => {
                if (validateResponseCode(resData)) {
                  return resData.data[0];
                } else {
                  throw new Error(getResponseMessage(resData));
                }
              })
              .catch((error) => {
                this.$message.warning(`上传照片附件 出错，请重新尝试：${error && error.message}!`);
                return false;
              });
          } else {
            throw new Error(`消缺处理信息不完整，未上传图片`);
          }
          this.clearInfo.clear_pics = imgUrl || this.clearInfo.clear_pics;
          const reqData = Object.assign({}, this.clearInfo);
          reqData.clear_time = parseInt(new Date(reqData.clear_time).valueOf() / 1000) || null;
          const resData = await this.request.post('/clear/set', reqData, {
            userIntercetorsConfig: {
              request: true,
              response: {
                useErrorFirstStyle: false,
              },
            },
          });
          if (validateResponseCode(resData)) {
            this.dialogVisiable = false;
            this.$message.success('保存日志消缺记录 成功！');
            this.$emit('updateClearInfo');
          } else {
            throw new Error(getResponseMessage(resData));
          }
        } catch (error) {
          this.$message.error(`保存日志消缺记录 出错：${getResponseMessage(error)}！`);
        }
        this.clearInfoLoading = false;
      },
      async delClear() {
        try {
          if (this.clear_id) {
            const cfm = await MessageBox.confirm('确认要删除此条日志的消缺记录吗？', '删除警告', {
              type: 'warning',
            })
              .then((value) => value === 'confirm')
              .catch(() => false);
            if (cfm) {
              this.clearInfoLoading = true;
              const resData = await this.request.post(
                '/clear/del',
                {
                  id: [this.clear_id],
                  option: this.clearInfo.option,
                },
                {
                  userIntercetorsConfig: {
                    request: true,
                    response: {
                      useErrorFirstStyle: false,
                    },
                  },
                }
              );
              if (validateResponseCode(resData)) {
                this.dialogVisiable = false;
                this.$message.success('删除日志消缺记录 成功！');
                this.$emit('updateClearInfo');
              } else {
                throw new Error(getResponseMessage(resData));
              }
            }
          } else {
            this.getClear();
          }
        } catch (error) {
          this.$message.error(`删除日志消缺记录 出错：${error && error.message}！`);
        }
        this.clearInfoLoading = false;
      },
      async getClear() {
        try {
          this.imgObj = null;
          this.clearInfo = this.$options.data().clearInfo;
          this.clearInfo.id = this.id; // 日志ID
          this.clearInfo.clear_id = this.clear_id; // 消缺ID
          this.clearInfo.option =
            this.options_table ||
            {
              1: 'camera_log', // 摄像机日志
              3: 'control_ball_log', // 布控球日志
              18: 'camera_panorama_log', // 全景
              26: 'fishing_log', // 钓鱼日志
              27: 'safety_hat_log', // 安全帽（一体）日志
            }[this.class_id || 1] ||
            'camera_log'; // 消缺日志类型
          // 如果没有消缺过，直接返回
          if (!this.clear_id) {
            return;
          }
          this.clearInfoLoading = true;
          const resData = await this.request.post(
            '/clear/get',
            { id: this.clear_id },
            {
              userIntercetorsConfig: {
                request: true,
                response: {
                  useErrorFirstStyle: false,
                },
              },
            }
          );
          this.clearInfoLoading = false;
          if (validateResponseCode(resData)) {
            assignCommonProperty(this.clearInfo, resData.data);
            this.clearInfo.clear_pics = this.clearInfo.clear_pics.replace(
              /^(\/uploads)?\//,
              location.origin + '/uploads/'
            );
          } else if (resData && resData.code === 402) {
            this.$message.warning('当前日志没有消缺记录。');
          } else {
            throw new Error(getResponseMessage(resData));
          }
        } catch (error) {
          this.clearInfoLoading = false;
          this.$message.error(`获取日志消缺信息 出错：${error && error.message}！`);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .clear-dialog {
    .uploader {
      width: 100%;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      object-fit: contain;

      &:hover {
        border-color: #409eff;
      }

      .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }

      .uploader-preview {
        display: block;
        width: 100%;
        height: 178px;
        object-fit: contain;
      }
    }
  }
</style>
