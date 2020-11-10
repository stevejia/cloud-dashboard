//事件存储器
const effects = new Map(); //数据池数据响应事件列表（id---triggers）
let reactiveBool = false;
//开始响应触发机制
function startReactive() {
  reactiveBool = true;
}
//set触发机制
const reactiveHandler = {
  set(target, key, value, receiver) {
    const oldValue = target[key];
    const newValue = Reflect.set(target, key, value, receiver);
    if (reactiveBool && oldValue != value) {
      getTriggerList(key, { oldValue, newValue });
    }
    return newValue;
  }
};
/**
 * 创建effect
 * @param {Object} target 图元对象
 * @param {String} type 图元属性类型：a，s
 * @param {String} key 图元属性
 * @param {Array} params 计算函数传参
 * @param {String} computedFn 计算函数实体
 */
function createEffect(target, hopeValue, points, computedFn) {
  //   let eTarget = target;
  //   let eType = type;
  //   let eKey = key;
  let eParams = points;
  return function() {
    const poolIdValues = eParams.map(poolId => reactive[poolId]);
    computedFn(target, hopeValue, poolIdValues);
  };
}
/**
 * 添加数据响应对应的事件
 * @param {String} poolId 数据池属性
 * @param {Function} effect
 */
function addToReactive(poolId, effect) {
  reactive[poolId] = null;
  if (effect) {
    let poolIdEffects = effects.get(poolId) || [];
    poolIdEffects.push(effect);
    effects.set(poolId, poolIdEffects);
  }
}

/**
 *
 * @param {String} poolId 数据池属性
 * @param {Object} extraInfo 属性新旧值
 */
function getTriggerList(poolId, extraInfo) {
  const triggers = effects.get(poolId) || [];
  triggers.forEach(effect => {
    if (extraInfo.oldValue !== extraInfo.newValue) {
      effect();
    }
  });
}
const reactive = new Proxy({}, reactiveHandler);

export { reactive, startReactive, addToReactive, createEffect };
