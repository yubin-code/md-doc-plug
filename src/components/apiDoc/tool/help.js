import BaseHelp from '../../public/help'
/**
 * 帮助
 * @param  param = {}
 */
export default class Help extends BaseHelp{
  constructor(param, sys){
    super();
    this.setContent(`
      <h3>mdDocAPI文档</h3>
      <p>版本: ${sys.version}</p>
    `);
  }

  // 启用插件
  enable(){
    return { key: "help", position: "right", view: this.getView() }
  }
}

