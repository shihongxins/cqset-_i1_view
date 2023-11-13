<script setup>
  defineProps({
    device: {
      required: true,
      type: Object,
      default: () => ({}),
    },
    channels: {
      type: Array,
      default: () => [],
    },
  });
</script>

<template>
  <div class="table_container">
    <div class="table_body table-wrapper">
      <el-table :data="channels" height="100%" border size="mini">
        <el-table-column prop="cmd_id" label="设备编号"></el-table-column>
        <el-table-column prop="channel_no" label="通道序号"></el-table-column>
        <el-table-column prop="component_id" label="通道编号"></el-table-column>
        <el-table-column prop="dev_type_desc" label="通道类型"></el-table-column>
        <el-table-column prop="name" label="通道名称"></el-table-column>
        <el-table-column prop="picurl" label="最新抓图">
          <template #default="{ row: { picurl } }">
            <el-image
              v-if="picurl"
              style="width: 5rem; height: 3.75rem"
              :src="picurl"
              :preview-src-list="[picurl]"
              fit="contain"
            ></el-image>
            <p v-else>暂无最新抓图</p>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .table_container {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    .table_search {
      display: flex;
      align-items: center;
      > * {
        margin-right: 10px;
      }
    }
    .table_body {
      margin: 10px 0;
      flex: 1;
      overflow: hidden;
    }
  }
</style>
