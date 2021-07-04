import _ from '../utils/type';
/**
 * 基础类
 */
export default class Base {
  /**
   * 错误信息提示
   * @param {*} error 
   */
  errorMessage(error){
    this.applyEvent('error', { message: error });
  }
  /**
   * 
   * @param {*} name    应用事件
   * @param {*} param 
   */
  applyEvent(name, ...ags){
    if(_.isFunction(this[name])){
      return this[name](...ags);
    }
  }
}

