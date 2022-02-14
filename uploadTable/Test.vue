<template>
  <div class="attachment">
    <AttachmentInfo
      :uploadUrl="uploadUrl"
      :tableData="tableData"
      :showColumns="showColumns"
      :customRules="rules"
      :exclude="['']"
      :selectChange="selectChange"
      :uploadStateFns="uploadStateFns"
      isSelect
    >
      <template #fl_def>
        <el-button size="small" type="success">空山鸟语</el-button>
      </template>
      <template #tb_size="{ row }">
        <span>{{ row.size + 'kbi' }}</span>
      </template>
      <template #tb_status="{ row, item }">
        <span>{{ item.prop }}:{{ row.status }}</span>
      </template>
      <template #tb_op="{ row, index }">
        <el-button slot="upload" icon="el-icon-upload"></el-button>
        <el-button icon="el-icon-delete" @click="deleteData(index, row.uid)"></el-button>
        <el-button icon="el-icon-edit" @click="deleteData(index, row.uid)"></el-button>
        <span slot="upload">span</span>
      </template>
    </AttachmentInfo>
  </div>
</template>
<script>
// import AttachmentInfo from './Index.vue';
import AttachmentInfo from './UploadTable.vue';
export default {
  name: 'Test',
  components: {
    AttachmentInfo,
  },
  data() {
    const checkRepeatFile = (file, { tableData }) => {
      if (tableData.some(item => item.name === file.name)) {
        return '文件名又又又又重复';
      }
    };
    return {
      tableData: [],
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      rules: [
        { validator: checkRepeatFile }
      ],
      showColumns: [
        {
          label: '文件名',
          prop: 'name',
          width: '30%',
        },
        {
          label: '文件类型',
          prop: 'fileType',
          width: '30%',
        },
        {
          label: '大小',
          prop: 'size',
          width: '20%',
        },
        {
          label: '状态',
          prop: 'status',
          width: '20%',
        },
      ],
      uploadStateFns: {
        onBefore({ file }) {
          const { uid,name, size, type } = file;
          return {
            uid,
            name,
            fileType: type,
            size,
            status: '上传开始',
          }
        },
        onSuccess({ res, file }) {
          return {
            status: '上传成功!!!',
          }
        },
        onError({ err, file, fileList }) {
          return { 
            status: '上传失败'
          }
        },
        onProgress({ event, file, fileList }) {
          return { 
            status: '上传中...'
          }
        }
      }
    };
  },
  methods: {
    // 
    selectChange(selection) {
      console.log(selection);
    },
    deleteData(index, uid) {
      this.tableData.splice(index, 1);
      // this.fileList = this.fileList.filter(item => item.uid !== id);
    },
  }
}
</script>
