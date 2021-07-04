import Dom from '../../../utils/dom';
import _ from '../../../utils/type';
/**
 * 新窗口打开
 * @param  param = {}
 */
export default class Blank {
  #sys = {};
  #view = null;
  constructor(param, sys){
    this.#sys = sys;
    // 点击以后收起目录
    this.#view = Dom.create(
      "a", { class: "tool", title: "新窗口打开" }, [Dom.create("i", { class: "iconfont icon-open-blank" })]
    );

    Dom.addEvent(this.#view, "click", this.#helpClick.bind(this))
  }
  /**
   * 新窗口打开事件
   * @returns 
   */
  #helpClick(){
    const value = this.#sys.url.value;
    if(_.isEmpty(value)) return;
    window.open(value)
  }
  // 启用插件
  enable(){
    return { key: "blank", position: "right", view: this.#view }
  }
}

