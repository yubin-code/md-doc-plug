import _ from '../../utils/type';
import tool from '../../utils/tool';
import Dom from '../../utils/dom';
import Base from '../base';
import './index.less';
      
/**
 * 树形结构生成类
 * @param  param = {
 *  clickClass: 'tree-treenode',  // 被点击的class
 *  hideClass: 'hide',            // 隐藏的时候使用的class
 *  childClass: 'child',          // 子元素的class
 *  openClass: "open",          // 元素被打开的时候设置的class
 *  disableOpen: true,        // 是否禁用菜单打开关闭功能
 *  template: this.template.bind(this),  // 菜单模板
 *  showAll: false,          // 是否展开所有的列表
 *  attr: ['path', 'suffix'],   // 把指定属性存放在data-xx上面
 * }
 *  
 *  click 菜单被点击的时候触发
 *  setFileName 自定义title
 *  setSource 设置数据源
 *  getElement 获取tree dom对象
 */
export default class Tree extends Base{
  #treeElement = Dom.create('div');  // 存放Element
  #flatTree = [];       // 存放平行数据
  constructor (param={} ,space){
    super();
    this.setTime = null;  // 保存定时器
    this.source = [];     // 原数据
    this.param = param;   // 用户参数

    // 中间空隙参数
    this.space = space || {
      // 在标题前面点击以后可以展开的icon
      open: `<span class="tree-unit"><i class="iconfont icon-xiangyou"></i></span>`,
      // 目录标题
      title: `<span class="tree-title">{name}</span>`,
      // 空格
      unit: `<span class="tree-unit"></span>`,
      // 最后一个间隙样式
      last: `<span class="tree-unit-border-bottom"></span>`,
      // 中间间隙样式
      center: `<span class="tree-unit-border-center"></span>`,
      // 左边间隙样式
      left: `<span class="tree-unit-border-left"></span>`,
    }
    this.clickClass = 'tree-treenode';
    this.openClass = 'open';

    // 给tree添加点事件
    Dom.addEvent(this.#treeElement, 'click', this.#eventClick.bind(this))
    Dom.setAttr(this.#treeElement, 'class', 'dir-tree');
  }
  /**
   * 设置数据源
   * @param {array} source 树 
   */
   setSource(source){
    if(!_.isArray(source)){
      this.source = [];
      this.errorMessage("数据源不是数组");
      return;
    }
    // 设置源数据
    this.source = source;
  }

  /**
   * 系统模板
   * @param {Object} item 子
   */
  #template(item){
    return `<div> {unit} ${this.#getTitle(item)} </div>`;
  }
  
  /**
   * 生成平行数据
   * @param {array} tree 树 
   * @param {number} index 层级 
   * @param {string} key key表达层级关系 
   * @param {array} unit 占位符 
   * @param {boolean} isLast 父级是否是最后一个元素
   */
  #getFlatTree(tree, index, key, unit=[], isLast=false){
    // 生成平行数据之前先排序目录排前面
    // tree.sort((a,b) => {
		// 	return  a.type.charCodeAt(0) - b.type.charCodeAt(0);
		// });
    // 循环数据
    tree.forEach((item, i) => {
      const newData = { name: item.name }
      let count = index+1
      let keys = `${key}-${i+1}`
      if(!key){
        keys = `${i+1}-1`
      }
      // 生成必要参数
      newData.key = keys;
      // 保存父级的key
      newData.parentKey = key;
      // 判断是否存在儿子
      newData.isExischild = Array.isArray(item.children);
      // 判断是否是最后一个
      newData.last = tree.length == i+1;
      // 统计层级
      newData.count = index;
      // 判断是否是顶级
      newData.isTop  = index == 0
      // 获取内容空隙
      newData.unit = this.#getArrayUnit(newData, unit, isLast);
      const children = item.children;
      // 然后把取好的数据给 flatTree 数组
      this.#flatTree.push(Object.assign(item, newData));
      // 判断是否存在子元素
      if(children && children.length > 0){
        this.#getFlatTree(children, count, keys, newData.unit, newData.last);
      }
    });
  }
  /**
   * 获取中间间隙
   * @param {Object} item 树 
   * @param {array} unit 中间间隙数组
   * @param {boolean} isLast 是否是最后一个元素
   */
  #getArrayUnit(item, unit=[], isLast){
    const space = JSON.parse(JSON.stringify(unit));
    if(item.count > 0 ){
      // 空隙判断
      if(isLast){
        space.push('unit');
      }else {
        space.push('left');
      }
    }
    // 如果不是最后一个元素并且没有子元素说明也是文件
    if(!item.last && !item.isExischild && item.count != 0){
      space.push('center');
    }
    // 最后一个元素并且没有子元素说明是一个文件
    if(item.last && !item.isExischild && item.count != 0){
      space.push('last');
    }

    return space
  }
  /**
   * 获取标题的html
   * @param {Object} item 树 
   */
  #getTitle(item){
    let str = ""
    // 判断是否存在子级
    if(item.isExischild){
      str += this.space.open || '';
    }
    
    // 如果用户自定义了标题那么标题处理交给用户自己
    const title =  this.applyEvent("setFileName", item);;
    if(_.isString(title)){
      str += title;
      return str;
    }

    // 设置名字
    if(item.name){
      str += this.space.title
        .replace('{name}', item.name)||'';
    }
    return str;
  }

  /**
   * 将平行数组转为html
   */
  #getFlatElement(){
    const flatTree = this.#flatTree;
    // 创建一个容器
    const tempNode = Dom.create('div');
    let str = "";
    flatTree.forEach((item, index) => {
      // 判断是否展开所有
      const showAll = this.param.showAll == undefined || this.param.showAll;
      // 占位符号
      const unit = item.unit.map(item => this.space[item]).join("") || '';
      
      // 如果自定义了模板就使用自定义模板
      let template = _.isFunction(this.param.template) && this.param.template(item) || this.#template(item);
      template = template.replace('{unit}', unit);
      tempNode.innerHTML = template;
      // 获取模板第一个节点
      const TemplateDom = Dom.getTop(tempNode);
      // 如果模板不存在直接返回空
      if(!TemplateDom){
        return ''
      }

      // 添加专属属性
      Dom.setAttr(TemplateDom, "data-key", item.key);
      Dom.setAttr(TemplateDom, "data-isexischild", item.isExischild || false);
      Dom.setAttr(TemplateDom, "data-index", index);
      
      /**
       * 如果默认不是展开所有必须在每一个子级别添加他的父级key
       * 不然容易导致列表点击乱了
       */
      if(!showAll){
        Dom.setAttr(TemplateDom, "data-parentKey", item.parentKey);
      }

      // class 集合
      const classList = tool.getSplitFilter(Dom.getClass(TemplateDom), " ");

      // 只有有父级的才有open效果
      if(item.isExischild){
        Dom.setAttr(TemplateDom, "data-open", showAll);
        // 如果设置了元素被点击的时候的class那么就设置他
        const openClass = this.param.openClass || this.openClass;
        if(showAll && this.param.disableOpen != true){
          classList.push(openClass);
        }
      }
      
      // 判断用户是否自定义保存属性
      // 这个属性必须存在在item上面
      if(_.isArray(this.param.attr)){
        this.param.attr.forEach(key => {
          !_.isEmpty(item[key]) && Dom.setAttr(TemplateDom, `data-${key}`, item[key]);
        })
      }

      // 添加点击的那个class
      const clickClass = this.param.clickClass || this.clickClass;
      /**
       * 点击的clickClass如果没有用系统提供的
       */
      if(classList.indexOf(clickClass) == -1){
        classList.push(clickClass);
      }

      // 如果不是顶级菜单在添加一个class方便设置样式
      if(!item.isTop && this.param.childClass){
        classList.push(this.param.childClass);
      }
      
      // 设置隐藏样式
      if(!showAll && !item.isTop){
        classList.push(this.param.hideClass || 'hide');
      }

      // 最终生成class
      TemplateDom.className = classList.join(" ");
      str += tempNode.innerHTML;
    });
    
    Dom.inner(this.#treeElement, str);
  }

  /**
   * 执行生成树结构数据
   */
  getElement(source){
    // 获取平行数据
    this.#getFlatTree(source||this.source, 0);
    this.#getFlatElement();
    // 获取html
    return this.#treeElement;
  }
  /**
   * 添加事件
   * @param {event} event 判断条件
   */
   #eventClick(event){
    const child = Dom.delegate(event, `.${this.param.clickClass || this.clickClass}`);
    // 无效点击事件
    if(!child){
      return
    }

    // 获取当前元素的key
    const currentKey = Dom.getAttr(child, "data-key");
    // 获取当前元素的下标
    const index = Dom.getAttr(child, "data-index");

    // 根据当前元素生成正则
    const currentReg = new RegExp(`^${currentKey}`);

    // 通过父级获取所有子元素
    const childMate = [];
    // 循环所有子元素
    Dom.for(this.#treeElement.children, (item) => {
      const childkey = Dom.getAttr(item, "data-key");
      if(currentReg.test(childkey) && childkey != currentKey){
        childMate.push(item)
      }
    });
    
    // 如果用户设置点击事件那么就返回当前属性给用户
    this.applyEvent("click", this.#flatTree[index], child);
    
    // 禁用菜单打开关闭等功能
    if(this.param.disableOpen){
      return
    }

    // 没有子元素的就不执行下来内容浪费时间
    const isExischild = Dom.getAttr(child, "data-isexischild");
    if(isExischild == "false"){
      return
    }

    // 判断当前元素是否开启
    const isOpen = Dom.getAttr(child, "data-open") == "true" ? false : true;
    // 元素被打开的时候添加的class
    const openClass = this.param.openClass || this.openClass;
    if(openClass && isExischild == "true"){
      isOpen ? Dom.addClass(child, openClass) : Dom.delClass(child, openClass)
    }

    // 设置打开状态
    Dom.setAttr(child, "data-open", isOpen);
    const hide = this.param.hideClass || 'hide'
    // 对数据排序不然收起来动画怪怪的
    childMate.reverse();
    // 循环子对象做删除添加class处理
    childMate.forEach(item => {

      /**
       * 做层级判断
       * 判断是谁关闭了子元素
       * 不是直接关闭子元素的无权打开子元素
       * 一共三个条件
       */
      const parentKey = Dom.getAttr(item, "data-parentKey");
      if(isOpen && parentKey == currentKey){
        Dom.delClass(item, hide);
        Dom.setAttr(item, "data-parentKey", null);
        Dom.setAttr(item, "data-last-state", null);
        return
      }

      // 如果父元素parentKey等于空那么就设置他父元素的key
      if(_.isEmpty(parentKey)){
        Dom.setAttr(item, "data-parentKey", currentKey);
      }
      Dom.addClass(item, hide);
    });
  }
  
  /**
   * 搜索树中内容
   * @param {array} tree 树
   * @param {string} value 搜索的值
   * @param {string} field 被查询的字段
   */
  #searchTree(tree, value, field){
    let result = [];
    tree.forEach((item, i) => {
      // 使用 Object.assign 防止数据引用
      const newItem = Object.assign({}, item)
      // 父级别是否已经添加到数组
      let isPush = false;
      // 判断是否找到值了
      if(newItem[field] && newItem[field].indexOf(value) != -1){
        newItem.highlight = true;
        isPush = true;
        result.push(newItem);
      }

      // 如果存在子级接着寻找子元素
      if(newItem.children && newItem.children.length > 0){
        const children = this.#searchTree(newItem.children, value, field);
        if(children.length > 0){
          newItem.children = children;
          // 判断父级是否已经添加到数组
          if(isPush){
            result[i-1] = newItem;
            return
          }
          result.push(newItem);
        }
      }
    })

    return result;
  }
  
  /**
   * 搜索功能
   * @param {string} value 搜索的值
   * @param {string} field 被查询的字段
   */
  search(value, field){
    // 防止重复点击搜索
    clearTimeout(this.setTime);
    this.setTime = setTimeout(() => {
      if(value.trim() === ''){
        this.#flatTree = [];
        return this.getElement();
      }
      const result = this.#searchTree(this.source, value, field);
      this.#flatTree = [];
      this.getElement(result);
    }, 100);
  }
}
