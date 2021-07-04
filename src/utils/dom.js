import _ from './type';
import tool from './tool';
/**
 * dom 操作工具方法
 */
export default {
  /**
   * 创建标签
   * @param {*} label 标签名字
   * @param {*} attr 元素上面的属性
   * @param {*} child 子元素
   * @returns 
   */
  create(label, attr={}, child){
    const dom = document.createElement(label);
    if(!_.isEmpty(attr.innerHTML)){
      dom.innerHTML = attr.innerHTML;
      delete attr.innerHTML;
    }
    // 如果自定义了属性就设置自定义属性
    if(_.isObj(attr)){
      Object.keys(attr).forEach(i => {
        dom.setAttribute(i, attr[i]);
      })
    }
    // 如果存在儿子节点就添加儿子
    if(_.isArray(child)){
      child.forEach(item => {
        // 如果为空不做操作
        if(_.isEmpty(item)){
          return
        }
        dom.appendChild(item);
      });
    }
    return dom;
  },
  /**
   * 把元素追加到父元素后面
   * @param {*} parent 父元素
   * @param {*} child  被追加到元素
   */
  append(parent, child){
    parent.appendChild(child);
  },
  /**
   * 把元素追加到父元素前面
   * @param {*} parent 父元素
   * @param {*} child  被追加到元素
   */
  insert(parent, child, oldNode){
    if(!_.isDom(parent)) return;
    if(!_.isDom(oldNode)){
      oldNode = this.getTop(parent);
    }
    try{
      parent.insertBefore(child, oldNode);
    }catch(e){
      throw new Error("之前元素不存在当前元素不可追加");
    }
  },
  /**
   * 插入元素到父元素中
   * @param {*} parent 
   * @param {*} child 
   */
  inner(parent, child){
    parent.innerHTML = child;
  },
  /**
   * 替换父元素下面的所有子元素
   * @param {*} parent 
   * @param {*} child 
   */
  replace(parent, child){
    parent.replaceChild(child, this.getTop(parent));
  },
  /**
   * 获取所有子元素
   * @param {*} dom 
   */
  getAllChild(dom){
    return dom.children;
  },
  /**
   * 获取子元素的长度
   * @param {*} dom 
   * @returns 
   */
  getChildLength(dom){
    if(!_.isDom(dom)) return;
    return this.getAllChild(dom).length;
  },
  /**
   * 获取儿子dom的第一个元素
   * @param {*} dom 
   */
  getTop(dom){
    if(!_.isDom(dom)) return;
    // 判断是否支持
    if (dom.firstElementChild) {
      return dom.firstElementChild;
    }
    //第一个节点
    let node = dom.firstChild;
    while (node && node.nodeType == 1){
      node = node.nextSibling;
    }
    return node;
  },
  /**
   * 获取dom最后一个元素
   * @param {*} dom 
   */
  getLast(dom){
    if(!_.isDom(dom)) return;
    // 支持
    if(dom.lastElementChild){
      return dom.lastElementChild;
    }
    //第一个节点
    let node = element.lastChild;
    while(node && node.nodeType != 1){
      node = node.previousSibling;
    }
    return node;
  },
  /**
   * 获取上一个元素
   * @param {*} dom 
   */
  getUpper(dom){
    return dom.previousSibling;
  },
  /**
   * 获取下一个元素
   * @param {*} dom 
   */
  getDown(dom){
    return dom.nextSibling;
  },
  /**
   * 找到指定的子元素只能支持找一级
   * @param {*} dom 
   * @param {*} cla 
   */
  find(dom, cla){
    if(!_.isDom(dom)) return;
    if(_.isEmpty(cla)) return;
    const children = dom.children;
    for(let i in children){
      if(this.hasClass(children[i], cla)){
        return children[i];
      }
    }
  },
  /**
   * 循环子元素dom
   * @param {*} dom       被循环的父元素
   * @param {*} callback  回调
   */
   for(dom, callback){
    for(let i in dom){
      const item = dom[i];
      if(_.isDom(item)){
        _.isFunction(callback) && callback(item);
      }
    }
  },
  /**
   * 删除一个dom
   * @param {*} dom 
   */
  del(dom){
    dom.parentNode.removeChild(dom);
  },
  // 做兼容 matches 处理
  matches(element, selector) {
    if (element.matches) {
      return element.matches(selector);
    } else if (element.matchesSelector) {
      return element.matchesSelector(selector);
    } else if (element.webkitMatchesSelector) {
      return element.webkitMatchesSelector(selector);
    } else if (element.msMatchesSelector) {
      return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector) {
      return element.mozMatchesSelector(selector);
    } else if (element.oMatchesSelector) {
      return element.oMatchesSelector(selector);
    }
    return false;
    //  else if (element.querySelectorAll) {
    //   var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
    //   i = 0; 
    //   while (matches[i] && matches[i] !== element) i++;         return matches[i] ? true : false;
    // }
    // throw new Error('Your browser version is too old,please upgrade your browser');
  },
  // 委托父级别寻找子元素
  delegate(event, cla){
    let t = event.target;
    while(!this.matches(t, cla)){
      if(t === event.currentTarget) {
        t = null;
        break;
      }
      t = t.parentNode;
    }
    return t;
  },
  /**
   * 绑定事件
   * @param {*} dom        需要添加事件的doim
   * @param {*} event      添加的事件名字
   * @param {*} callback   执行的事件函数
   */
   addEvent(dom, event, callback){
    dom.addEventListener(event, callback, true)
  },
  /**
   * 删除事件
   * @param {*} dom        需要添加事件的doim
   * @param {*} event      添加的事件名字
   * @param {*} callback   执行的事件函数
   */
  delEvent(dom, event, callback){
    dom.removeEventListener(event, callback, true);
  },
  /**
   * 给document绑定一次性事件
   * 用完销毁
   * 注意：函数一定要返回 true 才能销毁不然一直存在
   * @param {*} event 
   * @param {*} callback 
   */
  addEventDocument(event, callback){
    const call = (e) => {
      if(_.isFunction(callback) && callback(e)){
        this.delEvent(document, event, call);
      }
    }
    this.addEvent(document, event, call)
  },
  /**
   * 设置自定义属性
   * @param {*} dom     需要设置属性的元素
   * @param {*} key     key值
   * @param {*} value   值
   * @returns 
   */
  setAttr(dom, key, value){
    dom.setAttribute(key, value);
  },
  /**
   * 获取自定义属性值
   * @param {*} dom 
   * @param {*} key 
   */
  getAttr(dom, key){
    return dom.getAttribute(key);
  },
  /**
   * 销毁一个dom
   * @param {*} dom 被销毁的dom
   */
  destroy(dom){
    dom.parentNode.removeChild(dom);
  },
  /**
   * 判断和一个class是否存在
   * @param {*} dom 被操作class的元素
   * @param {*} cla 操作的class名字
   */
  hasClass(dom, cla){
    // 空值就直接返回不存在
    if(_.isEmpty(cla)){
      return false;
    }
    if(dom.className.indexOf(cla) != -1){
      return true;
    }
    return false;
  },
  /**
   * 获取class
   * @param {*} dom 被操作class的元素
   */
  getClass(dom){
    if(_.isEmpty(dom.className)) return "";
    return dom.className
  },
  /**
   * 删除class
   * @param {*} dom 被操作class的元素
   * @param {*} cla 操作的class名字
   */
  delClass(dom, cla){
    const classList = tool.strToArray(dom.className, " ");
    const newClassList = classList.filter(item => item != cla);
    dom.className = newClassList.join(" ");
  },
  /**
   * 添加一个class
   * @param {*} dom 被操作class的元素
   * @param {*} cla 操作的class名字
   */
  addClass(dom, cla){
    // 如果class 存在不重复添加
    if(this.hasClass(dom, cla)){
      return
    }
    const classList = tool.strToArray(dom.className);
    classList.push(cla);
    dom.className = classList.join(" ");
  },
  /**
   * 清除所有子元素的cla
   * @param {*} dom 
   * @param {*} cla 
   */
  clearChildClass(dom, cla){
    this.for(dom, (item) => {
      this.delClass(item, cla);
    });
  },
 /**
  * 定时切换class
  * @param {*} dom 
  * @param {*} cla 
  * @param {*} time 
  * @returns 
  */
  timeToggleClass(dom, cla, time=2000){
    if(!_.isDom(dom)){
      return
    }
    tool.timeToggle(() => { this.addClass(dom, cla); }, () => { this.delClass(dom, cla); }, time)
  },
  /**
   * 如果class存在就删除不存在就添加
   * @param {*} dom 被操作class的元素
   * @param {*} cla 操作的class名字
   * @returns 
   */
  toggleClass(dom, cla){
    // 如果class 存在不重复添加
    if(this.hasClass(dom, cla)){
      this.delClass(dom, cla)
      return
    }
    this.addClass(dom, cla)
  },
  /**
   * 设置样式
   * @param {*} dom   被设置的dom
   * @param {*} style 设置的样式
   */
  setCss(dom, style){
    Object.keys(style).forEach(i => {
      dom.style[i] = style[i];
    })
  },
  /**
   * 获取css值
   * @param {*} dom 
   * @param {*} style 
   */
  getCss(dom, style){
    return dom.style[style];
  },
  /**
   * 获取可视窗口高度
   */
  getDocHeight(){
    return document.documentElement.clientHeight
  },
  /**
   * 获取可视窗口高度
   */
  getDocWidth(){
    return document.documentElement.clientWidth
  }
}