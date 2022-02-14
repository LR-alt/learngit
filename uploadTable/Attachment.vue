<template>
  <div class="upload-attachment">
    <el-upload
      class="attachment"
      ref="attachment"
      :action="uploadUrl"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
    >
      <slot>
        <el-button size="small" :type="btnInfo.type">{{ btnInfo.name }}</el-button>
      </slot>
    </el-upload>
  </div>
</template>

<script>
import { useTableParams, useValidator } from './util/common';
import { rules, strategies } from './util/strategy';
export default {
  name: 'Attachment',
  inheritAttrs: false,
  data() {
    return {
      defRules: rules,
    }
  },
  computed: {
    allRules({ customRules, defRules }) {
      const curDefRules = defRules.filter(item => !this.exclude.includes(item.strategy))
      return [...curDefRules, ...customRules];
    },
    emptyItem({ showColumns, idName }) {
      const emptyObj = {};
      const props = showColumns.map(item => item.prop).concat(idName);
      props.forEach(prop => emptyObj[prop] = '');
      return emptyObj;
    }
  },
  mounted() {
    // 初始化校验
    const startVerify = useValidator(strategies, this.allRules);
    // 初始化表格
    const { addNewItem, setEffect } = useTableParams(this.tableData, this.uploadStateFns);
    // 挂载到this中
    Object.assign(this, {
      startVerify,
      addNewItem,
      setEffect,
    })
  },
  methods: {
    beforeUpload(file) {
      // 校验
      const errMsg = this.startVerify({ file, tableData: this.tableData });
      if (errMsg) {
        this.$message.error(errMsg);
        return false;
      }
      // 初始化入参
      this.addNewItem(this.emptyItem, this.curIndex).setEffect('onBefore', { file });
    },
    handleProgress(event, file, fileList) {
      this.setEffect('onProgress', { event, file, fileList })
    },
    handleSuccess(res, file, fileList) {
      this.setEffect('onSuccess', { res, file, fileList })
    },
    handleError(err, file, fileList) {
      this.setEffect('onError', { err, file, fileList })
    },
  },
  props: {
    uploadUrl: {
      type: String,
      default: '',
      required: true,
    },
    // 自定义规则
    customRules: {
      type: Array,
      default: () => [],
    },
    // 排除规则
    exclude: {
      type: Array,
      default: () => []
    },
    // 包含规则
    include: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    },
    // 状态函数
    uploadStateFns: {
      type: Object,
      default: () => ({}),
      validator(statusFnObj) {
        const requiredFnNames = ['onBefore', 'onProgress', 'onSuccess', 'onError', 'onChange'];
        const curFnNames = Object.keys(statusFnObj);
        // 传入的属性值需为函数且函数名称必须包含于requiredFnNames中
        return curFnNames.every(fnName => {
          const isFn = typeof statusFnObj[fnName] === 'function';
          const isInclude = requiredFnNames.includes(fnName);
          return isFn && isInclude;
        })
      }
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    showColumns: {
      type: Array,
      default: () => [],
    },
    idName: {
      type: String,
      default: 'uid',
    },
    curIndex: {
      type: Number,
    },
    btnInfo: {
      type: Object,
      default: () => ({
        type: '',
        name: '上传附件'
      })
    }
  }
}
</script>