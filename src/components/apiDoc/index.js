import Dom from '../../utils/dom'
import { apiDocParser } from '../../utils/parser'
import _ from '../../utils/type'
import Win from '../win';
import './index.less';
/**
 * api 文档部分
 * @param  param = {
 *  command: 命令行
 * }
 */
export default class ApiDoc extends Win {
  version = "1.0.0";
  #field = ["api", "successExample", "errorExample", "version", "description", "param", "returnParam", "remark"];
  #fieldView = {
    api: "requestView",
    version: "textView",
    successExample: "returnView",
    errorExample: "returnView",
    description: "textView",
    remark: "textView",
    param: "tableView",
    returnParam: "tableView",
  }
  #main = null;
  constructor(param){
    super(param);
    this.param = param;
    this.#init();
  }
  // 初始化
  #init(){
    // 给窗口添加一个新的class
    Dom.addClass(this.window, "api-doc");
    this.#main = Dom.create("div", { class: "api-main hide" }, []);
    
    // 添加工具
    this.#tools();
    this.setContainerHeight(this.#main);
    // 浏览器主体部分
    Dom.append(this.winBody, this.#main);
  }

  /**
   * 请求的url以及请求方式
   */
  requestView(param){
    return `
    <div class="api-header">
    <h3 class="api-title">${param.title || '无标题'}</h3>
    <div class="api-request">
      <div class="method">${param.method || 'any'}</div>
        <div class="url">${param.url}</div>
      </div>
    </div>
    `;
  }
  /**
   * 文本模板
   * @param {*} param 
   * @returns 
   */
  textView(param){
    return `
    <div class="text">
      <h3 class="api-title">${param.title}</h3>
      <div class="content">${param.content}</div>
    </div>
    `;
  }
  /**
   * 返回值模板
   * @param {*} param 
   * @returns 
   */
  returnView(param){
    return `
    <div class="text">
      <h3 class="api-title">${param.title}</h3>
      <div class="json">
        <pre>${param.code}</pre>
      </div>
    </div>
    `
  }
  /**
   * table 模板
   * @param {*} param 
   * @returns 
   */
  tableView(param){
    const list = param.list;
    const str = list.map(item => {
      return `
      <tr>
        <td>${item.field}</td>
        <td>${item.onNull ? "是": "否"}</td>
        <td>${item.type}</td>
        <td>${item.explain}</td>
      </tr>
      `;
    });
    return `
    <div class="field">
      <h3 class="api-title">${param.title}</h3>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <td>参数名</td>
              <td>必选</td>
              <td>类型</td>
              <td>说明</td>
            </tr>
          </thead>
          ${str.join("")}
        </table>
      </div>
    </div>
    `;
  };

  setDoc(doc){
    try{
      const docObj = apiDocParser(doc);
      let str = "";
      this.#field.map(item => {
        // 不存在的就不做处理
        if(_.isEmpty(docObj[item])) return;
        // 没有模板不做操作
        if(_.isEmpty(this.#fieldView[item])) return;
        str += this[this.#fieldView[item]](docObj[item]);
      });
  
      Dom.inner(this.#main, str);
    }catch(e){
      Dom.inner(this.#main, "未知错误");
    }

  }

  /**
     * 点击全屏的时候让代码区域自适应
     * @returns 
     */
  _screen(){
    Dom.delClass(this.#main, "hide")
    Dom.setCss(this.#main, { maxHeight: "", height: (this.getWinHeight() - 40) + "px" })
  }

  // 添加工具
  #tools(){
    const sysParam = {
      version: this.version,
      param: this.param,
      main: this.#main
    }
    // 注册帮助功能帮助功能是不可取消的功能
    this.dynamicRegTool("help", "apiDoc/tool/help", {}, sysParam);
    this.dynamicRegTool("retract", "apiDoc/tool/retract", {}, sysParam);
    const tools = this.param.tool;
    // 没有设置工具就直接退出
    if(!_.isObj(tools)){
      return
    }
  }
}