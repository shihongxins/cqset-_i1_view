<script>
  import { useVideoStore } from '../stores/video';
  import { APII1 } from '../apis/i1/i1';
  import { getResponseMessage, isNumberInRange, validateResponseCode } from '@shihongxins/jsutils';
  import { errorHandler } from '../apis/request/tools';

  export default {
    data() {
      return {
        videoStore: useVideoStore(),
        visibleForTable: false,
        loadingForTable: false,
        dataForTable: [],
        visibleForForm: false,
        loadingForForm: false,
        dataForForm: {
          preset_no: 255,
          start_hour: '',
          close_hour: '',
          minute: 10,
        },
        rules: {
          preset_no: [
            {
              trigger: 'blur',
              required: true,
              validator: (r, v, cb) => {
                if (typeof v === 'number' && isNumberInRange(v, 0, 256)) {
                  return cb();
                }
                cb(new Error('请选择预置点位'));
              },
            },
          ],
          start_hour: [{ trigger: 'blur', required: true, message: '请选择开始时间' }],
          close_hour: [{ trigger: 'blur', required: true, message: '请选择结束时间' }],
          minute: [
            {
              trigger: 'blur',
              required: true,
              validator: (r, v, cb) => {
                if (
                  typeof v === 'number' &&
                  isNumberInRange(v, this.minuteRange[0], this.minuteRange[1], true)
                ) {
                  return cb();
                }
                cb(new Error('间隔不合法'));
              },
            },
          ],
        },
      };
    },
    computed: {
      minuteRange() {
        const min = 5;
        const max =
          ((parseInt(this.dataForForm.close_hour) || 1) -
            (parseInt(this.dataForForm.start_hour) || 0)) *
            60 || 60;
        return [min, max];
      },
    },
    methods: {
      async loadTask() {
        this.dataForForm.preset_no = this.videoStore.channel?.channel_type === 'PTZ' ? null : 255;
        this.loadingForTable = true;
        const { cmd_id = '', channel_no = 0 } = this.videoStore.channel;
        const [err, resData] = await APII1.snapTask
          .get({ cmd_id, channel_no })
          .then(errorHandler.wrapDataToErrorFirstStyle);
        this.loadingForTable = false;
        if (!err && validateResponseCode(resData, 0)) {
          this.dataForTable = [].concat(resData.data || []);
        } else {
          this.$message.error(`加载定时抓图任务列表出错：${getResponseMessage(resData)}`);
        }
      },
      async setTask(delTask) {
        const { cmd_id = '', channel_no = 0 } = this.videoStore.channel;
        const reqData = {
          cmd_id,
          channel_no,
          set_flag: delTask ? 2 : 1, // 1 添加 2 删除
          time_point: delTask,
        };
        // 新增时校验
        if (!delTask) {
          const valid = await this.$refs.refTaskForm.validate().catch(() => false);
          if (!valid) return;
          reqData.time_point = {
            preset_no: parseInt(this.dataForForm.preset_no),
            start_hour: parseInt(this.dataForForm.start_hour),
            close_hour: parseInt(this.dataForForm.close_hour),
            minute: parseInt(this.dataForForm.minute),
          };
        }
        this.loadingForForm = true;
        const [err, resData] = await APII1.snapTask
          .set(reqData)
          .then(errorHandler.wrapDataToErrorFirstStyle);
        this.loadingForForm = false;
        if (err || !validateResponseCode(resData, 0)) {
          this.$message.error(
            `${delTask ? '删除' : '设置'}定时抓图任务出错：${getResponseMessage(resData)}`
          );
        } else if (!delTask) {
          this.$refs.refTaskForm.resetFields();
          this.visibleForForm = false;
        }
        this.loadTask();
      },
    },
  };
</script>

<template>
  <div class="snap-task">
    <!-- 默认触发DOM -->
    <span @click="visibleForTable = true">
      <slot>
        <el-divider>定时抓图</el-divider>
        <el-button size="mini" icon="el-icon-s-tools">管理定时任务</el-button>
      </slot>
    </span>
    <!-- 任务列表 -->
    <el-dialog
      title="定时抓图任务列表"
      width="70vw"
      append-to-body
      destory-on-close
      :visible.sync="visibleForTable"
      @open="loadTask"
    >
      <div class="snap-task--table">
        <el-table size="mini" height="100%" border v-loading="loadingForTable" :data="dataForTable">
          <el-table-column label="通道号" prop="channel_no" width="80"></el-table-column>
          <el-table-column label="任务列表">
            <template #default="{ row: { human } }">
              <el-table :data="human" border>
                <el-table-column label="预置点" prop="preset_no"></el-table-column>
                <el-table-column label="开始时刻" prop="start_hour"></el-table-column>
                <el-table-column label="结束时刻" prop="close_hour"></el-table-column>
                <el-table-column label="抓图任务" prop="minute">
                  <template #default="{ row: { minute } }">
                    <span>每 {{ minute }} 分钟执行一次</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-link size="mini" type="danger" icon="el-icon-delete" @click="setTask(row)">
                      删除
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button size="mini" @click="visibleForForm = true">添加</el-button>
      </template>
    </el-dialog>
    <!-- 添加任务 -->
    <el-dialog
      title="添加定时抓图任务"
      width="21.875rem"
      append-to-body
      destory-on-close
      :visible.sync="visibleForForm"
    >
      <el-form
        ref="refTaskForm"
        size="mini"
        label-width="6em"
        v-loading="loadingForForm"
        :model="dataForForm"
        :rules="rules"
      >
        <el-form-item
          label="预置点位"
          prop="preset_no"
          v-show="videoStore.channel?.channel_type === 'PTZ'"
        >
          <el-select
            style="width: 100%"
            v-model="dataForForm.preset_no"
            placeholder="请选择预置点位"
            @focus="videoStore.presetListLoad()"
          >
            <el-option
              v-for="preset in videoStore.presetList"
              :key="preset.present_point"
              :label="preset.memo"
              :value="preset.present_point"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时刻" prop="start_hour">
          <el-time-select
            style="width: 100%"
            placeholder="开始时刻"
            v-model="dataForForm.start_hour"
            :picker-options="{
              start: '00:00',
              end: '23:00',
              step: '01:00',
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="结束时刻" prop="close_hour">
          <el-time-select
            style="width: 100%"
            placeholder="结束时刻"
            v-model="dataForForm.close_hour"
            :picker-options="{
              start: '00:00',
              end: '23:00',
              step: '01:00',
              minTime: dataForForm.start_hour,
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="执行间隔" prop="minute">
          <el-input
            style="width: 100%"
            v-model.number="dataForForm.minute"
            :min="minuteRange[0]"
            :max="minuteRange[1]"
            placeholder="请输入抓拍间隔时间"
          >
            <template #append>
              <small><i>(次/分钟)</i></small>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="visibleForForm = false">取消</el-button>
        <el-button size="mini" type="primary" @click="setTask()">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .snap-task {
    text-align: center;
    &--table {
      height: 30rem;
    }
  }
</style>
