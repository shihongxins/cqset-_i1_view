<script>
  export default {
    model: {
      prop: 'modelValue',
      event: 'update:modelValue',
    },
  };
</script>
<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
      default: false,
    },
    panes: {
      required: true,
      type: Array,
      default: () => [],
    },
    activePaneName: String,
  });
  const emit = defineEmits(['update:modelValue', 'update:activePaneName']);

  const visible = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  const active = computed({
    get() {
      return props.activePaneName;
    },
    set(value) {
      emit('update:activePaneName', value);
    },
  });
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    append-to-body
    destory-on-close
    top="11.5rem"
    width="90%"
    v-bind="$attrs"
    class="dialogtabs-pop"
  >
    <el-tabs type="border-card" class="dialogtabs-tabs" v-model="active">
      <el-tab-pane
        v-for="(pane, index) in panes"
        :key="index"
        :label="pane.label"
        :name="pane.name"
      >
        <slot :name="pane.name"></slot>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .dialogtabs {
    &-pop {
    }
    &-tabs {
      @apply bg-blue-8;
      & :deep() {
        > .el-tabs__header {
          @apply bg-blue-9 border-transparent;
          .el-tabs__item {
            @apply bg-blue-6 color-primary;
            &.is-active {
              @apply color-content border-transparent;
            }
          }
        }
        > .el-tabs__content {
          @apply h-120 overflow-hidden;
          .el-tab-pane {
            @apply h-full overflow-hidden;
          }
          .el-descriptions {
            &__body {
              @apply bg-blue-9 color-content;
              .el-descriptions-item__label {
                @apply bg-blue-950 color-blue;
              }
            }
          }
        }
      }
    }
  }
</style>
