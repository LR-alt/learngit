// 默认通用的校验规则
  /* 
     * 文件大小不能超过500kb
     * 文件类型只能是jpg/png
     * 文件名大小不能超过50个字符
     * 文件名必须带有水印两个字
     * 文件名不能重名
     * 文件数量不能超过5个
     */
  const rules = [
    { strategy: 'isJPGFile', errMsg: '上传头像图片只能是 JPG 格式!' },
    { strategy: 'validFileName', errMsg: '文件名长度超过8个字', ruleArgs: 8 },
    { strategy: 'isOver2M', errMsg: '文件大小超过1M', ruleArgs: 1 },
  ];
  
  const strategies = {
    isJPGFile(file, errMsg) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) return errMsg;
    },
    isOver2M(file, errMsg, { ruleArgs: length }) {
      const isLt2M = file.size / 1024 / 1024 < length;
      if (!isLt2M) return errMsg;
    },
    validFileName(file, errMsg, { ruleArgs: length }) {
      const size = file.name.length;
      if (size > length) return errMsg;
    },
  };
  
  export {
    rules,
    strategies
  }