<!-- jsx -->
<script>
import Attachment from './Attachment';
import FileTable from './FileTable';
export default {
  name: 'UploadTable',
  components: {
    Attachment,
    FileTable,
  },
  computed: {
    attrData({ $attrs }) {
      return {
        props: $attrs,
      }
    },
    slotNames({ $attrs }) {
      return $attrs.showColumns.map(column => `tb_${column.prop}`);
    }
  },
  methods: {
    // 获取按钮的作用域插槽
    getTbOpSlotFn(opSlotFn) {
      return ({ row, index }) => {
        const tb_opNodes = opSlotFn({ row, index });
        return tb_opNodes.map(btnNode => {
          if (btnNode.tag && btnNode.data.slot === 'upload') {
            return <Attachment curIndex={index} {...this.attrData}>{btnNode}</Attachment>
          }
          return btnNode;
        })
      }
    },
    // 将父组件的作用域插槽分发给子组件
    distributeSlot(scopedSlots, props) {
      const tb_ScopedSlots = {};
      const fl_ScopedSlots = {};
      Object.keys(scopedSlots).forEach(slotName => {
        if (slotName === 'fl_def') {
          fl_ScopedSlots.default = scopedSlots.fl_def;
        } else if (slotName === 'tb_op') {
          tb_ScopedSlots.tb_op = this.getTbOpSlotFn(scopedSlots.tb_op);
        } else if (props.includes(slotName)) {
          tb_ScopedSlots[slotName] = scopedSlots[slotName];
        }
      })
      return {
        fl_ScopedSlots,
        tb_ScopedSlots,
      };
    }
  },
  render() {
    const { $scopedSlots, $slots, attrData, slotNames,dis } = this;
    const { tb_ScopedSlots, fl_ScopedSlots } = this.distributeSlot($scopedSlots, slotNames);
    return (
      <div class="upload-file">
        {/* 头部信息 */}
        <div class="topTitle">
          {$slots.default}
        </div>
        {/* 上传附件 */}
        <Attachment {...attrData} scopedSlots={fl_ScopedSlots} />
        {/* 附件表格 */}
        <FileTable {...attrData} scopedSlots={tb_ScopedSlots} />
      </div>
    )
  },
}
</script>