import Dom from '../../../utils/dom';
/**
 * 复制工具
 * @param  param = {
 *  copySuffix: 复制的后缀
 */
export default class Retract {
  #sys = {};
  #view = null;
  constructor(param, sys){
    this.param = param;   // 用户参数
    this.#sys = sys;      // 系统参数
    
    // 点击以后收起目录
    this.#view = Dom.create(
      "a", { class: "tool" }, [Dom.create("i", { class: "iconfont icon-shouqi" })]
    );

    Dom.addEvent(
      this.#view,
      "click",
      () => this.handle(Dom.hasClass(this.#sys.winBody, "hide-menu"))
    );
    // 获取页面宽度当页面宽度小于多少的时候自动收起菜单栏
    if(Dom.getDocWidth() < 500){
      Dom.addClass(Dom.getTop(this.#view), "contrary");
      Dom.addClass(this.#sys.winBody, "hide-menu");
    }
  }
  /**
   * 点击以后收起目录
   * @param {*} show 是否收起
   * @returns 
   */
  handle(show){
    if(show){
      Dom.delClass(Dom.getTop(this.#view), "contrary");
      Dom.delClass(this.#sys.winBody, "hide-menu");
      return
    }
    Dom.addClass(Dom.getTop(this.#view), "contrary");
    Dom.addClass(this.#sys.winBody, "hide-menu");
  }
  
  // 启用插件
  enable(){
    return { key: "retract", position: "left", view: this.#view }
  }
}