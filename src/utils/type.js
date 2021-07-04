/**
 * 类型判断的工具库
 */
export default {
  isString(str){
    return Object.prototype.toString.call(str)=="[object String]"
  },
  /**
   * 判断是否是空值
   * @param {*} value 
   * @returns 
   */
  isEmpty(value){
    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
        return true;
    }else{
      if(this.isString(value)){
        value = value.replace(/\s/g,"");
        if(value == ""){
            return true;
        }
      }
      if(this.isObj(value)){
        value = JSON.stringify(value);
        if(value == "[]" || value == "{}"){
          return true;
        }
      }
      return false;
    }
  },
  /**
   * 判断是否是Dom元素
   * @param {*} item 
   * @returns 
   */
  isDom(item) {
    // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
    return (typeof HTMLElement === 'function') ? (item instanceof HTMLElement) : (item && (typeof item === 'object') && (item.nodeType === 1) && (typeof item.nodeName === 'string'));
  },
  /**
   * 判断是否是函数
   * @param {*} fn 
   * @returns 
   */
  isFunction (fn){
    return typeof fn == "function";
  },
  /**
   * 判断是否是数组
   * @param {*} arg 
   * @returns 
   */
  isArray(arg){
    return Array.isArray(arg)
  },
  /**
   * 判断是否是对象
   * @param {*} obj 
   */
  isObj(obj){
    return Object.prototype.toString.call(obj) == '[object Object]'
  },
  /**
   * 判断是否是数字
   * @param {*} value 
   */
  isNumber(value){
    return typeof value === 'number' && !isNaN(value);
  },
  /**
   * 判断是否为真 true || "true"
   * @param {*} bool 
   * @returns 
   */
  isTrue(bool){
    return /^true$/i.test(bool)
  },
  /**
   * 判断是否为假 false || "false"
   * @param {*} bool 
   * @returns 
   */
  isFalse(bool){
    return /^false$/i.test(bool)
  },
  /**
   * 获取ie浏览器的版本
   * @returns 
   */
  isIE() {
    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
      const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      const fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion == 7) {
          return 7;
      } else if(fIEVersion == 8) {
          return 8;
      } else if(fIEVersion == 9) {
          return 9;
      } else if(fIEVersion == 10) {
          return 10;
      } else {
          return 6;//IE版本<=7
      }   
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11  
    }else{
        return -1;//不是ie浏览器
    }
  }
}