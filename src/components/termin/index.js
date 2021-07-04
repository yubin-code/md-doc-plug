import Dom from '../../utils/dom'
import _ from '../../utils/type'
import Win from '../win';
import './index.less';
/**
 * 终端
 * @param  param = {
 *  command: 命令行
 * }
 */
export default class Termin extends Win {
  version = "1.0.0";
  #home = "<i class='iconfont instruct'></i><i class='termin-home'>~</i>";
  #commandReg = /^>/;
  constructor(param){
    super(param);
    this.#init();
  }
  // 初始化
  #init(){
    // 给窗口添加一个新的class
    Dom.addClass(this.window, "termin");
    const view = Dom.create("div");
    view.innerHTML = this.parser();
    this.#tools();
    Dom.inner(this.winBody, view.innerHTML);
  }
  /**
   * 指令模版
   * @param {*} command 执行的执行
   * @returns 
   */
  #commandView(command){
    return `<div class="code-line">${command}</div>`
  }

  /**
   * 内容模板用于解析更多内容
   * 这里需要更多细节判断先忽略
   * @param {*} content 
   */
  #contentView(content){
    content = content.replace(/\s/g, "&nbsp;")
    return this.#commandView(content);
  }

  /**
   * 添加光标
   * @param {*} text 
   * @returns 
   */
   #addCursor(text){
    return this.#commandView(`${this.#home}<i class='cursor'></i>`)
  }

  /**
   * 终端命令解析器
   */
  parser(){
    const str = this.param.command;
    if(!_.isString(str)){
      return
    }

    const line = str.split("\n");
    const command = line.filter(item => !_.isEmpty(item.trim())).map(item => {
      const content = item.trim();
      // 判断是否已 > 开始如果是说明是指令
      if(this.#commandReg.test(content)){
        return this.#commandView(content.replace(this.#commandReg, this.#home));
      }
      // 其他内容模板
      return this.#contentView(content);
    });
    command.push(this.#addCursor())
    
    return command.join("");
  }
  // 添加工具
  #tools(){
    const sysParam = {
      version: this.version,
    }
    // 注册帮助功能帮助功能是不可取消的功能
    this.dynamicRegTool("help", "termin/tool/help", {}, sysParam);
    const tools = this.param.tool;
    // 没有设置工具就直接退出
    if(!_.isObj(tools)){
      return
    }
    
    // 循环所有用户注册的工具动态注册工具
    Object.keys(tools).forEach(name => {
      this.dynamicRegTool(name, `termin/tool/${name}`, this.param.tool[name], sysParam)
    });
  }
}