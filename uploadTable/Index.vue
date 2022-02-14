<!-- 方案一：用模板 -->
<template>
  <div class="upload-file">
    <!-- 上传文件 -->
    <Attachment v-bind="$attrs">
      <el-button size="small" :type="btnInfo.type">{{ btnInfo.name }}</el-button>
    </Attachment>
    <!-- 展示上传的文件信息的表格 -->
    <FileTable v-bind="$attrs">
      <!-- 动态插槽 -->
      <template v-for="item in showColumns" v-slot:[`tb_${item.prop}`]="{ row, item }">
        <slot :name="`tb_${item.prop}`" :row="row" :item="item"></slot>
      </template>
      <!-- 操作列插槽 -->
      <template #defBtn="{ row, index }">
        <slot name="tb_op" :row="row" :index="index"></slot>
        <!-- 操作列-单行直接上传 -->
        <Attachment v-bind="$attrs" :curIndex="index"> 
          <slot name="tb_uploadBtn" :row="row" :index="index"></slot>
        </Attachment>
      </template>
    </FileTable>
  </div>
</template>

<script>
import Attachment from './Attachment';
import FileTable from './FileTable';
export default {
  name: 'Index',
  components: {
    Attachment,
    FileTable,
  },
  computed: {
    showColumns({$attrs}) {
      return $attrs.showColumns;
    }
  },
  props: {
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