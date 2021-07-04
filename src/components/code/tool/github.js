import Dom from '../../../utils/dom';
import _ from '../../../utils/type';
/**
 * 复制工具
 * @param  param = {
 *  copySuffix: 复制的后缀
 */
export default class Copy {
  #view = null;
  #sys = {};
  constructor(url, sys){
    this.#sys = sys;      // 系统参数
    // 点击以后收起目录
    this.#view = Dom.create(
      "a", { class: "tool", target: "_blank", href: url }, [Dom.create("i", { class: "iconfont icon-github" })]
    );
  }
  
  // 启用插件
  enable(){
    return { key: "github", position: "right", view: this.#view }
  }
}