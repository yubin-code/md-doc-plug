import Clipboard from 'clipboard';
import message from '../../message';
import StateTool from './stateTool'
import Dom from '../../../utils/dom'
/**
 * 复制工具
 * @param  param = {
 *  copySuffix: 复制的后缀
 */
export default class Copy {
  #view = null;
  #sys = {};
  constructor(param, sys){
    this.param = param;   // 用户参数
    this.#sys = sys;      // 系统参数
    this.#view = StateTool("复制", "icon-copy tool-main");
    Dom.addEvent(this.#view, "click", (event) => {
      // 如果绑定过复制事件不重复绑定了
      if(event.target.bindCopy) return;
      // 绑定copy事件
      if(Dom.hasClass(event.target, "icon-copy")){
        event.target.bindCopy = true;
        // 执行拷贝函数
        this.#init(event.target, this.#view);
      }
    });
  }
  /**
   * 初始化注册
   * @param {*} dom       当前被点击的元素
   * @param {*} view  被复制的元素css样式修改
   */
  #init(dom, view){
    const clipboard = new Clipboard(dom, {
      text: () => {
        if(this.#sys.code.innerText === ""){
          message.error("复制失败");
          Dom.timeToggleClass(view, "tool-error", 3000)
          return '';
        }
        return this.#sys.code.innerText + (this.param.copySuffix || '');
      }
    });
    // 复制成功
    clipboard.on('success', (e) => {
      message.success('复制成功');
      Dom.timeToggleClass(view, "tool-success", 3000);
    });
    // 复制失败
    clipboard.on('error', (e) => {
      message.error('复制失败');
    });
  }
  // 启用插件
  enable(){
    return { key: "copy", position: "right", view: this.#view }
  }
}
