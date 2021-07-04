import Dom from '../../../utils/dom';
/**
 * 帮助
 * @param  param = {}
 */
export default class Retract {
  #sys = {};
  #view = null;
  constructor(param, sys){

    this.param = param;   // 用户参数
    this.#sys = sys;      // 系统参数

    // 点击以后收起目录
    this.#view = Dom.create(
      "a", { class: "tool" }, [Dom.create("i", { class: "iconfont icon-zhankai" })]
    );

    Dom.addEvent(this.#view, "click", this.#helpClick.bind(this))
  }
  /**
   * 收起
   * @param {*} event 
   * @returns 
   */
  #helpClick(event){
    if(Dom.hasClass(this.#sys.main, "hide")){
      Dom.delClass(this.#sys.main, "hide");
      return
    }
    Dom.addClass(this.#sys.main, "hide");
  }
  // 启用插件
  enable(){
    return { key: "retract", position: "top", view: this.#view }
  }
}