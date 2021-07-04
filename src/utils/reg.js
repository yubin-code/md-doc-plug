import _ from './type';
const type = /{(.*?)}/;
export default {
  // 返回
  back(reg){
    if(_.isEmpty(reg)){
      return '';
    }
    return reg[1];
  },
  /**
   * 匹配 {type} 中间的内容
   * @param {*} str 
   */
  type(str){
    const reg = type.exec(str);
    return this.back(reg);
  },
}