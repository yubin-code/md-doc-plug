import _ from '../../utils/type';
import tool from '../../utils/tool';

import Dom from '../../utils/dom';
import Base from '../base';
import './index.less';
/**
 * 窗口类
 */
export default class Win extends Base {
  #winHeaderTitle = null;
  #footerLeft = null;
  #footerRight = null;
  #topRight = null;
  #winHandle = null;
  #containerHeight = null;
  #toolExample = {};
  #tools = {};      // 保存所有工具
  // 错误信息提示
  constructor(param={}){
    super();
    this.param = param;
    this.#init();
  }
  
  /**
   * 初始化
   */
  #init(){
    this.#winHeaderTitle = Dom.create("div", { class: "win-title" });
    this.#footerLeft = Dom.create("div", { class: "left" });
    this.#footerRight = Dom.create("div", { class: "right" });
    this.#topRight = Dom.create("div", { class: "top-right" });
    this.winBody = Dom.create("div", { class: "win-body" });

    const handle = []
    // 是否关闭关闭功能
    if(!this.param.closeOff)
      handle.push(Dom.create("i", { class: "iconfont icon-close", title: "关闭" }));
    // 关闭收起功能
    if(!this.param.narrowOff)
      handle.push(Dom.create("i", { class: "iconfont icon-narrow", title: "收起" }));
    // 关闭全屏功能
    if(!this.param.screenOff)
      handle.push(Dom.create("i", { class: "iconfont icon-screen", title: "全屏" }));

    // win 头部
    this.#winHandle = Dom.create(
      "div", { class: "win-handle" },
      handle,
    );

    // 窗口
    this.window = Dom.create(
      "div", { class: "macWin" },
      [
        Dom.create(
          "div", { class: "win-header" },
          [ this.#winHandle, this.#winHeaderTitle, this.#topRight ]
        ),
        this.winBody,
        Dom.create("div", { class: "win-footer" }, [ this.#footerLeft, this.#footerRight ])
      ]
    );

    // 操作拦添加事件
    Dom.addEvent(this.#winHandle, 'click', this.#handleClick.bind(this));
  }

  /**
   * 操作拦被点击的时候
   */
  #handleClick(event){
    // 关闭
    if(Dom.hasClass(event.target, "icon-close")){
      this.destroy();
    }

    // 收起
    if(Dom.hasClass(event.target, "icon-narrow")){
      this.narrow();
    }

    // 全屏
    if(Dom.hasClass(event.target, "icon-screen")){
      this.screen();
    }
  }

  /**
   * 缩小
   */
  narrow(){
    Dom.delClass(this.window, "full-screen");
    Dom.toggleClass(this.window, "full-narrow");

    if(!Dom.hasClass(this.window, "full-narrow")){
      this.setContainerHeight();
    }
  }

  /**
   * 全屏
   */
  screen(){
    Dom.delClass(this.window, "full-narrow");
    Dom.toggleClass(this.window, tool.isIpx() ? "full-screen-ipx" : "full-screen");
    
    // 全屏的时候调用子类方法
    if(_.isFunction(this._screen)){
      if(!Dom.hasClass(this.window, "full-screen")){
        this.setContainerHeight();
        return;
      }
      this._screen();
    }
  }
  
  /**
   * 关闭以后就销毁所有的东西
   */
  destroy(){
    Dom.destroy(this.window);
    this.#winHeaderTitle = null;
    this.#footerLeft = null;
    this.#footerRight = null;
    this.#winHandle = null;
    this.#topRight = null;
    this.winBody = null;
    this.window = null;
  }

  /**
   * 设置标题
   * @param {*} title 
   */
  setTitle(title){
    Dom.inner(this.#winHeaderTitle, title);
  }

  /**
   * 设置窗口容器的高宽
   */
  setContainerHeight(container){
    if(this.#containerHeight == null){
      this.#containerHeight = container;
    }
    
    const defaultHeight = {
      height: '',
      minHeight: '',
      maxHeight: '',
    };
    if(this.param.height){
      defaultHeight.height = this.param.height + "px";
    }
    if(this.param.minHeight){
      defaultHeight.minHeight = this.param.minHeight + "px";
    }
    if(this.param.maxHeight){
      defaultHeight.maxHeight = this.param.maxHeight + "px";
    }
    
    Dom.setCss(this.#containerHeight, defaultHeight)
  }
  // 获取窗口高度
  getWinHeight(){
    let height = Dom.getDocHeight();
    // 判断是否是苹果x如果是需要减去底部的高度
    if(tool.isIpx()){
      height -= 20;
    }
    return height;
  }
  /**
   * 获取所有的工具栏工具
   * @param {*} key 
   * @returns 
   */
  getTool(key){
    if(!_.isEmpty(key)){
      return this.#tools[key];
    }
    return this.#tools;
  }
  /**
   * 判断一个工具是否存在
   * @param {*} key 
   * @returns 
   */
  hasTool(key){
    return this.#tools[key];
  }
  /**
   * 注册工具栏工具
   * @param {*} tool { key: 唯一标识, position: left|right 默认为right, view: 模版内容, before: 在谁之前插入填写key值}
   */
  regTool(tool){
    // 名字不允许为空
    if(_.isEmpty(tool.key)){
      this.errorMessage("附加工具key不能为空");
      return
    }
    // 判断工具key是否已经存在
    if(this.hasTool(tool.key)){
      this.errorMessage(`附加工具${tool.key}已被注册`);
      return
    }
    // 保存工具
    this.#tools[tool.key] = tool;
    // 创建一个div用来存放创建出来值
    const sham = Dom.create('div');
    
    /**
     * 判断是dom元素如果是使用append方法加入
     * 如果不是使用inner方法加入元素
     */
    _.isDom(tool.view) ? Dom.append(sham, tool.view) : Dom.inner(sham, tool.view);
    // 工具方法下面元素只允许拥有一个多余就抛出错误
    if(Dom.getChildLength(sham) > 1){
      this.errorMessage("附加工具只能添加一个dom元素");
      return
    }
    
    // 获取视图
    const view = Dom.getTop(sham);
    /**
     * 判断用户内容是否是是使用了标签
     */
    if(!view.tagName){
      this.errorMessage("附加工具只能使用标签");
      return
    }
    // 默认在右边
    let parent = this.#footerRight;
    // 左边添加工具
    if(tool.position == "left"){
      parent = this.#footerLeft;
    }
    // 在顶部添加工具
    if(tool.position == "top"){
      parent = this.#topRight;
    }
    
    let insertBefore = null;
    // 如果设置追加什么位置了
    if(_.isString(tool.before)){
      insertBefore = this.getTool(tool.before);
    }
    
    // 设置元素的唯一key值
    Dom.setAttr(view, 'key', tool.key);
    // 左边加入
    if(tool.position == "left"){
      Dom.append(parent, view);
    }
    // 右边加入
    if(tool.position == "right"){
      Dom.insert(parent, view, insertBefore);
    }
    // 顶部加入
    if(tool.position == "top"){
      Dom.insert(parent, view, insertBefore);
    }
  }
  /**
   * 删除工具
   * @param {*} key 
   * @returns 
   */
  delTool(key){
    if(_.isEmpty(key)) return;
    Dom.destroy(this.getTool(key));
  }

  /**
   * 动态注册工具
   * @param {*} name      需要注册的名字
   * @param {*} path      工具地址
   * @param {*} param     用户参数
   * @param {*} sysParam  系统参数
   * @returns 
   */
  dynamicRegTool(name, path, param, sysParam){
    try{
      const T = tool.compatESModuleRequire(require(`../${path}`));
      // 如果函数不存在不注册
      if(!_.isFunction(T))
        return;
      const example = new T(param, sysParam);
      
      // 保存工具类实例
      this.#toolExample[name] = example;
      this.regTool(example.enable());
    }catch(e){
      this.errorMessage(`${name} 工具不存在`);
    }
  }
  
  /**
   * 获取工具类实例
   * @param {*} name 工具类名字
   * @returns 
   */
  getToolExample(name){
    return this.#toolExample[name];
  }
  /**
   * 获取 Element 对象
   * @returns 
   */
  getElement(){
    return this.window;
  }
}

