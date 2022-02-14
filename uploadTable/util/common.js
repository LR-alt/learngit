// 使用校验器
function useValidator(strategies, rules) {
  const cache = [];
  // 定义目标值、外层入参
  const outArgs = {
    file: undefined,
  };
  // 添加规则
  const addRule = (rules) => {
    rules.forEach(rule => {
      const { strategy, errMsg, ruleArgs, validator } = rule;
      cache.push(() => {
        if (typeof validator === 'function') {
          return validator(outArgs.file, outArgs);
        } else {
          return strategies[strategy](outArgs.file, errMsg, { ruleArgs, outArgs });
        }
      });
    })
  }
  // 开启验证
  const start = (argObj) => {
    // 初始化
    Object.assign(outArgs, argObj);
    // 遍历调用
    for (const validFn of cache) {
      const errMsg = validFn();
      if (errMsg) {
        return errMsg;
      }
    }
  }
  // 添加
  addRule(rules);
  return start;
}
// 设置表格参数
function useTableParams(tableData, uploadStateFns) {
  if (!Array.isArray(tableData)) { return; }
  let newItem;
  // 添加表格项
  const addNewItem = function (item, curInx) {
    if(Number.isFinite(curInx)) {
      newItem = tableData[curInx];
    } else {
      newItem = {...item};
      tableData.push(newItem);
    }
    return this;
  }
  // 设置表格项入参
  const setEffect = function (stateType, fileObj) {
    // debugger;
    const tarItem = (stateType in uploadStateFns) && uploadStateFns[stateType](fileObj);
    if (typeof tarItem !== 'object' || tarItem === null) return;
    if (stateType === 'onBefore') {
      Object.assign(newItem, tarItem);
    } else {
      const { file: { uid } } = fileObj;
      const oldItem = tableData.find(item => item.uid === uid);
      oldItem && Object.assign(oldItem, tarItem);
    }
  }

  return {
    addNewItem,
    setEffect,
  }
}

export {
  useValidator,
  useTableParams,
}