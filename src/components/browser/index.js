import Dom from '../../utils/dom'
import _ from '../../utils/type'
import Win from '../win';
import './index.less';
/**
 * 浏览器部分
 * @param  param = {
 * }
 */
export default class Browser extends Win {
  version = "1.0.0";
  #reload = null; 
  #url = null;
  #body = null;
  #iframe = null;
  constructor(param){
    super(param);
    this.param = param;
    this.#init();
  }
  // 初始化
  #init(){
    // 给窗口添加一个新的class
    Dom.addClass(this.window, "browser");
    this.#reload = Dom.create(
      "div", { class: "browser-reload" }, [
        Dom.create("i", { class: "iconfont icon-front" }),
        Dom.create("i", { class: "iconfont icon-after" }),
        Dom.create("i", { class: "iconfont icon-reload" }),
      ]);
    
    this.#url = Dom.create("input", { type: "text", name: "url", value: "" });
    // 浏览器操作部分
    Dom.append(this.winBody,
      Dom.create("div", { class: "browser-handle" }, 
      [
        this.#reload,
        Dom.create("div", { class: "browser-url" }, [ this.#url ]),
        Dom.create("div", { class: "browser-suffix" })
      ])
    );
    
    this.#iframe = Dom.create("iframe", { class: "iframe", frameborder: 0 });
    this.#body = Dom.create("div", { class: "browser-body"}, [ this.#iframe ]);
    this.setContainerHeight(this.#body);

    // 添加工具
    this.#tools();
    
    // 浏览器主体部分
    Dom.append(this.winBody, this.#body);
    // 添加点击事件
    Dom.addEvent(this.#reload, "click", this.#handle.bind(this));
  }

  /**
   * 点击事件
   * @param {*} event 
   */
   #handle(event){
    /**
     * 后退 因为安全限制不能直接实现，间接控制主窗口来实现
     * 导致的问题是所有的ifname都会出现前进后退的情况
     */
    
    if(Dom.hasClass(event.target, "icon-front")){
      this.front();
    }
    // 前进 因为安全限制不能直接实现，间接控制主窗口来实现
    if(Dom.hasClass(event.target, "icon-after")){
      this.after();
    }
    
    // 刷新s
    if(Dom.hasClass(event.target, "icon-reload")){
      this.reload();
    }
  }
  /**
   * 前进
   */
  front(){
    window.history.go(-1)
  }
  /**
   * 前进
   */
  after(){
    window.history.go(1)
  }

  /**
   * 刷新
   */
  reload(){
    const reload = Dom.find(this.#reload, 'icon-reload');
    Dom.timeToggleClass(reload, 'rotate');
    Dom.setAttr(this.#iframe, "src", Dom.getAttr(this.#iframe, "src"));
  }
  /**
   * 设置URL
   * @param {*} url 
   */
  #setURL(url){
    this.#url.value = url || "about:blank";
  }
  /**
   * 设置src
   * @param {*} src 
   * @returns 
   */
  open(url){
    this.#setURL(url);
    Dom.setAttr(this.#iframe, "src", url);
  }

  /**
     * 点击全屏的时候让代码区域自适应
     * @returns 
     */
  _screen(){
    Dom.setCss(this.#body, { maxHeight: "", height: (this.getWinHeight() - 75) + "px" })
  }

  // 添加工具
  #tools(){
    const sysParam = {
      version: this.version,
      param: this.param,
      url: this.#url,
    }
    // 注册帮助功能帮助功能是不可取消的功能
    this.dynamicRegTool("help", "browser/tool/help", {}, sysParam);
    const tools = this.param.tool;
    // 没有设置工具就直接退出
    if(!_.isObj(tools)){
      return
    }
    
    // 循环所有用户注册的工具动态注册工具
    Object.keys(tools).forEach(name => {
      this.dynamicRegTool(name, `browser/tool/${name}`, this.param.tool[name], sysParam)
    });
  }
}