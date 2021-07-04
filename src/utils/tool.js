import _ from './type';
export default {
  /**
   * require 进来的对象默认导出的有一个default
   * 所以需要 compatESModuleRequire 进行转换
   * @param {*} m 
   * @returns 
   */
  compatESModuleRequire (m) {
    return m.default || m;
  },
  /**
   * 把字符串切换数组
   * @param {*} str 被切割字符串
   * @param {*} separator 分割符号
   * @returns 
   */
  strToArray(str, separator){
    if(_.isString(str)){
      const arr = str.split(separator);
      return arr.filter(item => item != "");
    }
    return []
  },
  /**
   * 定时执行两个函数
   * @param {*} start 开始的函数
   * @param {*} end   结束的函数
   * @param {*} time  延迟多久执行
   */
  timeToggle(start, end, time=2000){
    _.isFunction(start) && start();
    setTimeout(() => {
      _.isFunction(end) && end();
    }, time);
  },
  /**
   * 判断是否是苹果x环境
   * @returns 
   */
  isIpx () {
    const agent = navigator.userAgent;
    if(!!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      return screen.height == 812 && screen.width == 375;
    }
  },
  /**
   * 首字母转为大写
   * @param {*} str 
   */
  firstToUpperCase(str){
    return str.slice(0, 1).toUpperCase() + str.slice(1)
  },
  /**
   * 获取分隔过滤之后的数据
   * @param {*} str   需要被切割的字符串
   * @param {*} split 按什么切割
   * @param {*} space 是否过滤空格
   * @returns 
   */
  getSplitFilter(str, split, space=true){
    if(_.isEmpty(str)) return [];
    str = str.split(split).filter(item => item != "");
    if(space){
      str = str.map(item => item.replace(/\s/g, ""));
    }
    return str;
  },
  /**
   * 打开新页面并把内容注入到新到页面中去
   * @param {*} content 
   */
  openWindow(content) {
    const win = window.open("", "winEx2","");
    win.document.open("text/html", "replace"); 
    win.document.write(content);
    win.document.close(); 
  },
  /**
   * 下载文件
   * @param {}} content 
   */
  // openWindow(content) {
  //   const win=window.open('','','top=10000,left=10000');
  //   win.document.write(content)
  //   win.document.execCommand('SaveAs','','byhu.htm')
  //   win.close();
  // },
}