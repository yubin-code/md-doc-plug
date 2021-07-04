import Dom from '../../utils/dom';
import "../../less/tool/help.less"
/**
 * 帮助
 */
export default class Help {
  #helpContainer = null;
  #view = null;
  constructor(){
    this.#helpContainer = Dom.create("div", { class: "help-container" });
    this.#view = Dom.create(
      "div", { class: "tool-container" }, [
        Dom.create("div", { class: "tool", title: "帮助" }, [
          Dom.create("i", { class: "iconfont icon-help help-tool" }),
        ]),
        this.#helpContainer
      ]
    );
    Dom.addEvent(this.#view, "click", this.#helpClick.bind(this))
  }

  /**
   * 帮助功能
   * @param {*} event 
   * @returns 
   */
  #helpClick(event){
    const toolHelp = Dom.delegate(event, ".tool-container")
    // 只有help-tool被点击的时候才触发
    if(Dom.hasClass(event.target, "help-tool")){
      const helpContainer = Dom.getLast(toolHelp);
      // 判断当前元素是否已经被显示了
      if(Dom.getCss(helpContainer, "display") == "block"){
        Dom.setCss(helpContainer, { display: "none" });
        return
      }
      Dom.setCss(helpContainer, { display: "block" });
      // 给document 绑定点击事件
      Dom.addEventDocument("click", (e) => {
        const container = Dom.delegate(e, ".help-container");
        if(container == null){
          Dom.setCss(helpContainer, { display: "none" });
          return true;
        }
      })
    }
  }
  /**
   * 设置内容
   * @param {*} html 
   */
  setContent(html){
    this.#helpContainer.innerHTML = html;
  }
  /**
   * 获取视图
   */
  getView(){
    return this.#view;
  }
}

