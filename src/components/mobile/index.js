import Dom from '../../utils/dom';
import _ from '../../utils/type';
import message from '../message';
import './index.less';
/**
 * 手机样式
 * @param  param = {
 *  type: 类型 ipx|''
 *  isWechat: 是否启用微信小程序样式
 *  scale: 当前手机缩放尺寸0 -- 100
 * }
 */
export default class Mobile {
  #mobile = null;
  #title = null;
  #iframe = null;
  #wechatHandle = null;
  #wechatMore = null;
  #pageBack = null;
  #pageTitle = null;
  #pageBody = null;
  #pageContainer = null;
  constructor(param){
    this.param = param;
    this.#init();
  }

  // 初始化
  #init(){
    // 标题
    this.#title = Dom.create("div", { class: "title", innerHTML: "无标题" });
    // 微信操作
    this.#wechatHandle = Dom.create("div", { class: "wechat-handle" }, [
      Dom.create("i", { class: "iconfont icon-more", title: "分享" }),
      Dom.create("sapn", { class: "wechat-division" }),
      Dom.create("i", { class: "iconfont icon-wechat-close", title: "关闭小程序" }),
    ]);

    // 微信更多操作部分
    this.#wechatMore = Dom.create("div", { class: "wechat-more-cover" }, [
      Dom.create(
        "div", { class: "wechat-more-box" }, [
        Dom.create("ul", { class: "wechat-more-ability" }, this.#getShareList()),
        Dom.create("button", { class: "close", innerHTML: "取消" })
      ])
    ]);
    // iframe
    this.#iframe = Dom.create("iframe", { class: "iframe", frameborder: 0 });

    // 新建页面部分
    // 新页面回退
    this.#pageBack = Dom.create("div", { class: "back" }, [
      Dom.create("i", { class: "iconfont icon-back" })
    ]);
    // 新建页面的header
    this.#pageTitle = Dom.create("div", { class: "title" });
    // 新建页面body
    this.#pageBody = Dom.create("div", { class: "body" });
    // 页面容器
    this.#pageContainer = Dom.create("div", { class: "page-container" }, [
      Dom.create("div", { class: "page" }, [
        Dom.create("div", { class: "header" }, [ this.#pageBack, this.#pageTitle ]),
        this.#pageBody
      ])
    ]),


    // 主体部分
    this.#mobile = Dom.create("div", { class: this.#getMobileClass() }, [
      Dom.create("div", { class: "mobile-header" }, [
        Dom.create("div", { class: "mobile-top" }, [
          Dom.create("div", { class: "time", innerHTML: "11:06" }),
          Dom.create("div", { class: "carrier", innerHTML: "中文移动" }),
          Dom.create("div", { class: "iconfont icon-signal"}),
          Dom.create("div", { class: "iconfont icon-wifi"}),
          Dom.create("div", { class: "iconfont icon-battery"}),
          Dom.create("div", { class: "bangs"}),
        ]),
        Dom.create("div", { class: "mobile-nav-bar" }, [ this.#title, this.#wechatHandle ]),
      ]),
      Dom.create("div", { class: "mobile-body" }, [ this.#iframe ]),
      this.#wechatMore,
      Dom.create("div", { class: "sound-plus" }),     // 声音加
      Dom.create("div", { class: "sound-reduce" }),   // 声音减
      Dom.create("div", { class: "mute" }),           // 静音按钮
      Dom.create("div", { class: "ip-start" }),       // 启动画面按钮
      Dom.create("div", { class: "ipx-transverse" }), // 苹果x拥有的属性
      // 页面容器
      this.#pageContainer
    ]);

    this.setScale(parseInt(this.param.scale));
    // 给小程序特有的属性添加事件
    Dom.addEvent(this.#wechatHandle, "click", this.#wechatHandleClick.bind(this));
    // 给分享弹出层添加事件
    Dom.addEvent(this.#wechatMore, "click", this.#wechatMoreClick.bind(this));
    // 主体绑定点击事件
    Dom.addEvent(this.#mobile, "click", this.#mobileClick.bind(this));
    // 添加页面返回事件
    Dom.addEvent(this.#pageBack, "click", () => this.showPage(false))
  }
  /**
   * 返回给用户的dom
   * @returns 
   */
  getElement(){
    return this.#mobile;
  }
  /**
   * 打开链接地址
   * @param {*} url 
   */
  open(url){
    if(_.isEmpty(url)) return;
    Dom.setAttr(this.#iframe, "src", url);
  }
  /**
   * 重新加载
   * @param {*} url 
   */
  reload(){
    this.open(Dom.getAttr(this.#iframe, "src"));
  }
  /**
   * 设置标题
   */
  setTitle(title){
    if(_.isEmpty(title)) return;
    Dom.inner(this.#title, title)
  }
  /**
   * 缩放尺寸
   * @param {*} scale 
   */
  setScale(scale){
    if(!_.isNumber(scale)) return;
    Dom.setCss(this.#mobile, { "transform": `scale(${scale/100})` });
  }
  
  /**
   * 延迟添加class
   * @param {*} show 是否显示
   * @param {*} dom  需要操作的dom
   * @param {*} cla  添加删除的class
   * @param {*} time 延迟⌚️
   */
  #delayAddClass(show, dom, cla, time){
    // 显示分享框
    if(show){
      Dom.setCss(dom, { display: "block" });
      setTimeout(() => {
        Dom.addClass(dom, cla)
      }, 10);
      return
    }
    // 隐藏分享框
    Dom.delClass(dom, cla)
    setTimeout(() => {
      Dom.setCss(dom, { display: "none" })
    }, time);
  }
  /**
   * 是否显示分享框
   * @param {*} show 
   */
  showShare(show){
    // 如果打开新的页面了分享就不让点击出现
    if(Dom.hasClass(this.#pageContainer, "show-page")){
      return
    }
    this.#delayAddClass(show, this.#wechatMore, "wechat-more-show", 200);
  }

  /**
   * 返回帮助信息
   */
  openHelpPage(){
    const content = `
      <div class="mobile-help">
        <h3>mdDoc 手机模拟机</h3>
        <p>版本号：1.0.0</p>
      </div>
    `
    this.newPage({ title: "帮助", content });
    this.showShare(false);
  }
  helpClick(){
    // Dom.delClass(this.#mobile, "mobile-help-show")
  }

  /**
   * 设置新页面的title
   * @param {*} title 
   */
  setPageTitle(title){
    Dom.inner(this.#pageTitle, title);
  }
  /**
   * 设置页面的内容
   * @param {*} content 
   */
  setPageBody(content){
    // 先清空内容
    Dom.inner(this.#pageBody, "");
    // 如果传的是dom元素就用append html用 inner
    if(_.isDom(content)){
      Dom.append(this.#pageBody, content)
      return
    }
    Dom.inner(this.#pageBody, content)
  }

  /**
   * 显示隐藏页面
   * @param {*} show 
   */
  showPage(show){
    this.#delayAddClass(show, this.#pageContainer, "show-page", 300);
  }
  /**
   * 打开一个新的页面
   * @param {*} param 
   */
  newPage({ title="无标题", content="" }){
    this.setPageTitle(title);
    this.setPageBody(content);
    this.showPage(true);
  }
  /**
   * 设置主体内容的class
   * @returns 
   */
  #getMobileClass(){
    const classList = ["mobile"];
    // 判断是否使用苹果x样式
    if(this.param.type == "ipx"){
      classList.push("ipx");
    }
    // 判断是否使用微信小程序的按钮
    if(_.isTrue(this.param.isWechat)){
      classList.push("wechat");
    }
    return classList.join(" ");
  }
  /**
   * 微信分享等点击事件
   * @param {*} event 
   */
  #wechatHandleClick(event){
    // 打开分享
    if(Dom.hasClass(event.target, "icon-more")){
      this.showShare(true);
    }
    // 关闭窗口
    if(Dom.hasClass(event.target, "icon-wechat-close")){
      this.#destroy();
    }
  }
  /**
   * 销毁组件
   */
  #destroy(){
    Dom.del(this.#mobile);
    this.#mobile = null;
    this.#title = null;
    this.#iframe = null;
    this.#wechatHandle = null;
    this.#wechatMore = null;
  }

  /**
   * 微信分享弹窗出来的更多功能
   * @param {*} event 
   */
  #wechatMoreClick(event){
    // 关闭分享弹窗
    if(Dom.hasClass(event.target, "wechat-more-cover") || Dom.hasClass(event.target, "close")){
      this.showShare(false);
      return;
    }
    
    if(Dom.delegate(event, ".shezhi") != null) {
      return message.warning('模拟器不支持此功能')
    }
    if(Dom.delegate(event, ".reload") != null) {
      this.reload();
      this.showShare(false);
      return message.success('重新加载成功')
    }
    // 显示帮助
    if(Dom.delegate(event, ".help") != null) {
      this.openHelpPage();
    }
  }
  /**
   * 主体绑定点击事件
   * @param {*} event 
   */
  #mobileClick(event){
    // 禁音
    if(Dom.hasClass(event.target, "mute")){
      message.error("模拟器不支持禁音");
    }
    // 音量加
    if(Dom.hasClass(event.target, "sound-plus")){
      message.error("模拟器不支持音量加");
    }
    // 音量减
    if(Dom.hasClass(event.target, "sound-reduce")){
      message.error("模拟器不支持音量减");
    }
    // 亮屏
    if(Dom.hasClass(event.target, "ip-start")){
      this.showShare(true);
    }
    return false;
  }
  /**
   * 获取小程序分享列表功能
   * @returns 
   */
  #getShareList(){
    const list = [
      // { key: "shezhi", icon: "iconfont icon-shezhi", title: "设置" },
      { key: "reload", icon: "iconfont icon-refresh", title: "重新进入小程序" },
      { key: "help", icon: "iconfont icon-help", title: "帮助信息" },
    ];
    
    return list.map(item => {
      const li = Dom.create(
        "li", { class: item.key }, [
          Dom.create("i", { class: item.icon })
      ]);
      Dom.append(li, Dom.create("span", { innerHTML: item.title}))
      return li;
    })
  }
}
