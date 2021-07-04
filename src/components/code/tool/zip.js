import message from '../../message';
import StateTool from './stateTool';
import Dom from '../../../utils/dom';
import _ from '../../../utils/type';
/**
 * 复制工具
 * @param  param = {
 *  copySuffix: 复制的后缀
 */
export default class Zip {
  #view = null;
  #sys = {};
  constructor(url, sys){
    this.#sys = sys;      // 系统参数
    this.#view = StateTool("下载", "icon-yasuobao tool-main");
    Dom.addEvent(this.#view, "click", (event) => {
      // 绑定copy事件
      if(Dom.hasClass(event.target, "icon-yasuobao")){
        if(_.isEmpty(url)){
          message.error("无效的压缩包链接");
          return
        }
        window.open(url);
        message.success("开始下载中...");
        Dom.timeToggleClass(this.#view, "tool-success", 3000);
      }
    });
  }
  
  // 启用插件
  enable(){
    return { key: "zip", position: "right", view: this.#view }
  }
}