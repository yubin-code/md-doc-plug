import Dom from '../../utils/dom'
import './index.less';
class Message {
  constructor(){
    // 多长时间隐藏
    this.time = 3000;
  }
  // 创建 message
  create(text, type){
    if(!text) return;
    const msg = Dom.create("div", { class: "message" });
    Dom.inner(msg, `<i class="iconfont ${type}"></i>${text}`);
    Dom.append(document.body, msg);
    Dom.setCss(msg, { marginLeft: -(msg.offsetWidth / 2) + "px" });
    setTimeout(() => {
      Dom.addClass(msg, "hide");
      setTimeout(() => {
        Dom.del(msg);
      }, 300)
    }, this.time)
  }
  success(text){
    this.create(text, 'icon-success');
  }
  error(text){
    this.create(text, 'icon-error');
  }
  warning(text){
    this.create(text, 'icon-warning');
  }
}


export default new Message();