import Win from '../win';
import Tree from '../tree';
import _ from '../../utils/type'
import Dom from '../../utils/dom'
import suffixIcon from './suffixIcon';
import './index.less';
const fileType = { js: 'javascript', ts: 'typescript', html: 'xml' };
/**
 * 代码显示库
 * @param  param = {
 *  closeOff: false,    关闭关闭功能
 *  narrowOff: false,   关闭缩小功能
 *  screenOff: false,   关闭全屏功能
 *  hideLine: false,   是否隐藏代码行
 *  height: 100;       编辑器高度
 *  closeRetract:false; 禁止目录收回
 *  minHeight: 100;    编辑器最小高度
 *  maxHeight: 100;    编辑器最大高度       
 * }
 * defaultOpenFile 默认打开的文件
 * dirClick 目录被点击的时候触发
 * setDir 设置文档
 *   dir:[              目录数组
 *      { key: 必须传, name: 文件名字, code: 显示的代码, suffix: 文件后缀 }
 *  ]
 */
export default class Code extends Win {
  version = "1.0.0";
  // 保存打开的文件
  #openFileList = {};
  #suffixIcon = suffixIcon; // 保存icon
  #catalogue = null;  // 保存目录容器
  #openFileUl = null; // 目录列表容器
  #code = null;       // 显示代码
  #codeNumber = null; // 保存代码行使用
  #codeContainer = null;  // 代码容器
  #codeRegion = null;   // 代码区域包括代码行与代码
  #codeMain = null;   // 代码主体部分
  #loadingPrompt = null;  // 加载提示文字容器
  #loading = null;    // 加载容器
  constructor(param){
    super(param);
    this.#init();
  }
  // 初始化
  #init(){
    // 给窗口添加一个新的class
    Dom.addClass(this.window, "editor");
    // 用于显示目录
    this.#catalogue = Dom.create("div", { class: "editor-left catalogue-tree" });
    // 打开的文件
    this.#openFileUl = Dom.create("ul", { class: "open-file" })
    this.#codeNumber = Dom.create("ul", { class: "code-number" });
    this.#code = Dom.create("pre", { class: "code" });
    // 代码容器
    this.#codeContainer = Dom.create("div", { class: "code-container" }, [ this.#code ]);
    // 代码区域
    this.#codeRegion = Dom.create(
      "div", { class: "code-region" },
      [
        Dom.create("div", { class: "code-number-container" }, [ this.#codeNumber ]),
        this.#codeContainer
      ]);
    // 代码主体部分
    this.#codeMain = Dom.create(
      "div", { class: "editor-right" },
      [ this.#openFileUl, this.#codeRegion ]
    );

    // 记载模块的名字
    this.#loadingPrompt =  Dom.create("span", { class: "prompt" });
    // 加载模块
    this.#loading = Dom.create(
      "div", { class: "editor-loading" },
      [
        Dom.create("div", { class: "loading-content" },
        [
          Dom.create("i", { class: "iconfont icon-loading" }),
          this.#loadingPrompt
        ])
      ]
    );
    // 把新建出来的元素添加到winbody中去
    Dom.append(this.winBody, this.#catalogue);
    Dom.append(this.winBody, this.#codeMain);
    // 添加工具
    this.#tools();
    
    // 判断是否隐藏代码行
    if(_.isTrue(this.param.hideLine)){
      Dom.addClass(this.#codeRegion, "hide-number");
    }
    
    // 设置代码容器的高度
    this.setContainerHeight(this.#codeContainer);
    // 绑定打开文件被点击的事件
    Dom.addEvent(this.#openFileUl, "click", this.fileLiClick.bind(this));

    // 设置滚动事件让代码跟代码行能一起滚动起来
    Dom.addEvent(this.#codeContainer, "scroll", (event) => {
      Dom.setCss(this.#codeNumber, { marginTop: `-${event.srcElement.scrollTop}px` });
    });
  }
  /**
   * 点击全屏的时候让代码区域自适应
   * @returns 
   */
  _screen(){
    let height = this.getWinHeight() - 40;
    const openlist = Object.keys(this.#openFileList);
    // 判断存在打开文件如果存在
    // 全屏的时候需要减去打开文件的高度
    if(openlist.length > 1){
      height -= 35;
    }
    
    Dom.setCss(this.#codeContainer, { maxHeight: "", height: height + "px" })
  }
  
  /**
   * 获取 Element 对象
   * @returns 
   */
  getElement(){
    return this.window;
  }
  /**
   * 是否设置加载状态
   * @param {*} load 
   */
  setLoad(load, text){
    if(load){
      this.#loadingPrompt.innerHTML = (text || '');
      Dom.append(this.#codeMain, this.#loading)
      return
    }
    Dom.del(this.#loading);
  }

  /**
   * 获取文件icon
   */
  #getFileIcon(icon){
    return this.#suffixIcon[icon] || this.#suffixIcon['wenjian'];
  }

  /**
   * 设置树的标题
   * @param {*} item 
   */
  #setTreeTitle(item){
    let icon = this.#getFileIcon(item.suffix);
    // 文件夹单独处理
    if(item.isExischild){
      icon = this.#suffixIcon['file'];
    }
    return `<span class="tree-title"><img src="${icon}"/>
      ${item.name}
    </span>`
  }
  /**
   * 设置目录数据
   * @param {*} filelist 
   */
  setDir(dir){
    if(!_.isArray(dir)) return;
    Dom.addClass(this.window, 'project');
    // 判断文档模式
    this.tree = new Tree({
      // clickClass: 'tree-treenode',  // 被点击的class
      // hideClass: 'hide',            // 隐藏的时候使用的class
      // childClass: 'child',          // 子元素的class
      // disableOpen: true,        // 是否禁用菜单打开关闭功能
      // template: this.template.bind(this),  // 菜单模板
      // showAll: false,          // 是否展开所有的列表
      openClass: "open",          // 元素被打开的时候设置的class
      attr: ['path', 'suffix'],   // 把指定属性存放在data-xx上面
    });
    
    // 点击的时候调用用户事件
    this.tree.click = (...param) => {
      this.applyEvent('dirClick', ...param);
    }
    this.tree.error = (error) => {
      this.errorMessage(error);
    }
    
    this.tree.setFileName = this.#setTreeTitle.bind(this);
    this.tree.setSource(dir);
    Dom.inner(this.#catalogue, "");
    Dom.append(this.#catalogue, this.tree.getElement());
    // 收起功能不可不注册
    if(!this.param.closeRetract){
      // 注册收起关闭菜单功能
      this.dynamicRegTool("retract", "code/tool/retract", {}, { winBody: this.winBody});
    }
  }
  /**
   * 搜索功能
   * @param {*} value 搜索的值
   */
  search(value){
    this.tree.search(value, 'name');
  }
  /**
   * 设置当前那个元素被选中
   * @param {*} dom 
   */
  #setOpenActive(dom){
    Dom.clearChildClass(this.#openFileUl.children, "active");
    Dom.addClass(dom, "active");
  }
  /**
   * 打开文件的模版
   * @param {*} name 
   * @param {*} attr 
   * @returns 
   */
  #openFileView(name, attr){
    const icon = this.#getFileIcon(attr.suffix);
    const suffix = Dom.create("img", { src: icon, class: "file-icon" });
    const nameDom = Dom.create("span", { class: "name" });
    
    const children = [suffix, nameDom];
    
    // 禁止关闭文件文件
    if(!_.isFalse(this.param.closeFile)){
      children.push(Dom.create("span", { class: "iconfont icon-close" }));
    }
    
    nameDom.innerHTML = name;
    return Dom.create( "li", attr, children);
  }

  /**
   * 删除打开的文件
   * @param {*} dom 需要被删除的文件li
   * @param {*} key 被删除的文件key
   * @returns 
   */
  #delFile(dom, key){
  /**
   * 删除打开文件以后获取上一个打开的文件
   * 如果上一个打开的文件不存在那么就获取下一个元素
   * 如果两个都不存在说明所有打开的文件都已经关闭了
   */
    const openFile = Dom.getUpper(dom) || Dom.getDown(dom);
    // 删除元素
    Dom.del(dom);
    delete this.#openFileList[key];
    if(openFile == null){
      Dom.inner(this.#code, "");
      Dom.inner(this.#codeNumber, "");
      return null;
    }
    return openFile;
  }

  /**
   * 添加光标
   * @param {*} text 
   * @returns 
   */
  #addCursor(text){
    const code = text.split('\n');
    code.push("<i class='cursor'></i>");
    return code.filter(item => item !== '');
  }

  /**
   * 获取高亮的代码
   * @param {*} code 
   * @param {*} suffix 
   */
  #getHighlight(code, suffix){
    // 说没有引入高亮这个文件
    if(!hljs){
      return text
    }

    // 取消json与bash 因为我们需要重新定义
    // hljs.unregisterLanguage('json');
    hljs.unregisterLanguage('bash');

    // 过滤不支持的语言
    const language = _.isString(suffix) && suffix.toLowerCase();
    // 不支持高亮的语言
    if(hljs.listLanguages().indexOf(language) == -1){
      return this.#addCursor(code);
    }

    // 获取代码行数
    const html = hljs.highlight(code, { language }).value;
    return this.#addCursor(html);
  }

  /**
   * 设置代码显示
   * @param {*} file { code 显示的代码,  suffix: 文件后缀}
   */
  #setCodo(file){
    // 如果代码为空
    if(file.code == null){
      Dom.inner(this.#code, "<div class='empty-file'>代码不存在</div>");
      Dom.inner(this.#codeNumber, "");
      return;
    }
    const code = this.#getHighlight(file.code || '', fileType[file.suffix] || file.suffix);
    // 显示代码行
    if(_.isArray(code)){
      if(!this.param.hideLine){
        Dom.inner(this.#codeNumber, code.map((item, index) => `<li>${index+1}</li>`).join("\n"))
      }
    }

    // 生成出来代码必须是数组
    if(_.isArray(code)){
      Dom.inner(this.#code, code.map(item => `<div class="code-line">${item}</div>`).join(""))
    }
  }
  
  /**
   * 当前打开文件被点击的元素
   * @param {*} e 
   */
  fileLiClick(e){
    let li = '',
        key = '',
        active=false;
    // 如果用户传都是字符串那么就根据字符串寻找对应都li
    if(_.isString(e)){
      Dom.for(this.#openFileUl.children, (item) => {
        li = item;
      })
    }
    // 如果li没有设置值那么就根据e对象去寻找
    if(_.isEmpty(li) && !_.isString(e)){
      li = Dom.delegate(e, ".file");
    }

    /**
     * 如果li 为null 说明没有找到li
     * 或者用户点击了openfile空白处
     */
    if(_.isEmpty(li)){
      return
    }
    key = Dom.getAttr(li, "key");
    active = Dom.hasClass(li, "active");
    
    // 判断是否点击了关闭
    if(_.isString(e) || Dom.hasClass(e.target, "icon-close")){
      // 删除当前元素并返回上一个元素或下一个元素
      const openFile = this.#delFile(li, key);
      // 如果关闭当是当前元素那么就重新上开上一个元素或者下一个会元素
      if(openFile == null || !active){
        return
      }
      // 重新获取当前元素key
      key = Dom.getAttr(openFile, "key");
    }
    
    // 文件已经打开那么就从dom中取
    this.openFile(this.#openFileList[key]);

  }
  /**
   * 默认打开的文件
   * @param {*} file 
   */
   defaultOpenFile(file){
    // 不是数组不处理
    if(!_.isArray(file)){
      return
    }
    file.forEach(item => {
      const li = this.#openFileView(item.name, { key: item.key, class: "file", suffix: item.suffix });
      this.#openFileList[item.key] = item;
      Dom.append(this.#openFileUl, li)
    });

    this.#isHideFileList();
    // 判断第一个是否是对象
    if(_.isObj(file[0])){
      this.openFile(file[0]);
    }
  }
  /**
   * 设置打开文件的位置
   * @param {*} dom 
   */
  #setOpenFilePos(dom){
  /**
   * 计算当前元素所在的位置并移动到他可视区域
   */
    const openWidth = this.#openFileUl.offsetWidth;
    const pos = (dom.offsetLeft + dom.offsetWidth)-(openWidth/2);
    this.#openFileUl.scrollLeft = pos;
  }
  /**
   * 是否隐藏打开文件的列表
   */
  #isHideFileList(){
    // 判断是否显示打开代码的目录切换拦
    if(Object.keys(this.#openFileList).length > 0 && Dom.hasClass(this.#openFileUl, "hide-open-file")){
      Dom.delClass(this.#openFileUl, "hide-open-file");
    }
    
    if(Object.keys(this.#openFileList).length == 1 && !Dom.hasClass(this.window, 'project')){
      Dom.addClass(this.#openFileUl, "hide-open-file");
    }
  }
  /**
   * 打开文件
   * @param {*} file    { key: 必须传,  suffix: 文件后缀， code: 代码, name: 文件名字 }
   * @returns 
   */
  openFile(file){
    if(_.isEmpty(file)){
      this.errorMessage("缺少参数")
    }
    // 每一个文件必须有一个key而且不能重复
    if(_.isEmpty(file.key)){
      this.errorMessage("文件key不存在不允许打开")
      return
    }

    // 设置项目标题
    const projectName = this.param.projectName;
    this.setTitle(`${(projectName && projectName + " - " || '')} ${(file.name || '')}`);

    // 说明文件已经存在那么只要跳转当前文件就行
    if(this.#openFileList[file.key]){
      let current = '';
      // 循环所有元素让当前元素处于选中状态
      Dom.for(this.#openFileUl.children, (item) => {
        const key = Dom.getAttr(item, "key");
        // 根据key去做匹配
        if(key == file.key){
          current = item;
        }
        
      });
      
      // 设置选中状态
      this.#setOpenActive(current);
      
      // 设置当前li的位置
      this.#setOpenFilePos(current);
      // 设置代码
      this.#setCodo(this.#openFileList[file.key]);
      return
    }

    // 保存用户提交过来都打开文件
    this.#openFileList[file.key] = file;

    this.#isHideFileList();
    // 获取 li 的模版
    const li = this.#openFileView(file.name, { key: file.key, class: "file", suffix: file.suffix });
    this.#setOpenActive(li);
    Dom.append(this.#openFileUl, li);

    // 设置当前li的位置
    this.#setOpenFilePos(li);
    // 渲染代码
    this.#setCodo(file);
  }

  /**
   * 注册图标
   * @param {*} icon { [图标名字]: 图标地址或者bash64 }
   * @returns 
   */
  regIcon(icon){
    if(!_.isObj(icon)){
      this.errorMessage("注册icon必须传入json对象")
      return
    }
    Object.keys(icon).forEach(i => {
      this.#suffixIcon[i] = icon[i];
    });
  }
  /**
   * 删除图标
   * @param {*} icon 需要删除的图标名字
   * @returns 
   */
  delIcon(icon){
    if(!_.isArray(icon)){
      this.errorMessage("删除icon必须传入数组对象")
      return
    }
  }
  /**
   * 获取所有的icon列表|或当个图标
   * @param {*} icon 
   * @returns 
   */
  getIcon(icon){
    if(_.isString(icon)){
      return this.#suffixIcon[icon];
    }
    return this.#suffixIcon;
  }

  /**
   * 添加工具栏
   */
  #tools(){

    // 系统参数
    const sysParam = {
      code: this.#code,
      winBody: this.winBody,
      version: this.version,
      param: this.param
    }
    const tools = this.param.tool;
    
    // 注册帮助功能帮助功能是不可取消的功能
    this.dynamicRegTool("help", "code/tool/help", {}, sysParam);

    // 没有设置工具就直接退出
    if(!_.isObj(tools)){
      return
    }
    
    // 循环所有用户注册的工具动态注册工具
    Object.keys(tools).forEach(name => {
      this.dynamicRegTool(name, `code/tool/${name}`, this.param.tool[name], sysParam)
    });
  }
}