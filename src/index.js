import _ from "./utils/type"
import Code from "./components/code";
import Browser from "./components/browser";
import Mobile from "./components/mobile";
import Message from "./components/message";
import Termin from "./components/termin";
import Tree from "./components/tree";
import ApiDoc from "./components/apiDoc";
import Dom from "../src/utils/dom";

const components = {
  Code,
  Browser,
  Mobile,
  Message,
  Termin,
  Tree,
  ApiDoc,
  Dom
}

// 判断是否是ie浏览器
if(_.isIE() > 0){
  alert("不支持IE用户");
}
// window.components = components
export default components;

