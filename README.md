## mdDoc 的插件项目


## api 文档用法
```javaScript
import { ApiDom } from 'md-doc-plug';
const apiDom = new ApiDom({ tool: {} });

// 设置文档
apiDom.setDoc(`
@version 1.0.0
@api {GET} /product/{id}  获取产品列表
@description 指定产品id , 删除产品的全部信息，包括关联的schema

@param {String} *firstname  用户名
@param {String} lastname   用户姓

@returnParam {String} firstname 用户参数
@returnParam {String} firstname 用户参数

@errorExample
{
  error: 'eoor'
}
@successExample
{
  "error_code": 0,
  "data": {
    "uid": "1",
    "username": "12154545",
    "name": "吴系挂",
    "groupid": 2 ,
    "reg_time": "1436864169",
    "last_login_time": "0",
  }
}

@remark
这个是一个备注信息
`);

window.onload = () => {
  document.body.append(apiDom.getElement())
}
```

## 浏览器用法
```javaScript
import { Browser } from 'md-doc-plug';
const browser = new Browser({ minHeight: 300, tool: { blank: {} } });

browser.open("http://www.baidu.com");

window.onload = () => {
  document.body.append(browser.getElement())
}

```
## 手机模拟器用法
```javaScript
import { Mobile } from 'md-doc-plug';
// type ipx 苹果x样式
// isWechat 小程序样式
// scale 缩放程度

const mobile = new Mobile({ type: 'ipx', isWechat:true, scale: 80 });

mobile.open("https://caniuse.com/");
mobile.setTitle("新的标题");

window.onload = () => {
  document.body.append(mobile.getElement())
}

```

## 终端用法
```javaScript
import { Termin } from 'md-doc-plug';
const termin = new Termin({
  command: `> ls 
  README.md         index.html        node_modules      package.json      postcss.config.js src               webpack.config.js yarn.lock
  > a
  wa >
  `
});

window.onload = () => {
  document.body.append(termin.getElement())
}

```
## 代码显示器用法
```javaScript
import { Code } from 'md-doc-plug';
const code = new Code({
  hideLine: false,    // 是否隐藏行高
  height: 300,        // 高度
  closeFile: false,   // 禁止关闭文件
  // minHeight: 300,
  // maxHeight: 300,   // 最大高度
  // closeRetract: true,  // 禁止菜单收回
  projectName: "admin",   // 项目名字
  tool: {
    copy: { copySuffix: "\n-------------------\n谢谢复制\n------------------- "}, // 复制的后缀
    zip: "xxxx",        // 压缩包地址
    github: "xxx",      // github地址
  }
});
const dir = [
  {
    name: 'src',
    children: [
      { name: 'index.js', suffix: "js", },
      { name: 'index.css', suffix: "css", },
    ]
  },
]

// 设置目录
code.setDir(dir);
// 打开一个文件
code.openFile({
  key: "index",
  name: "index.js",
  code: "var name ='张三'",
  suffix: "js",
});
// 设置默认打开文件多个文件只渲染一个所以速度更快
code.defaultOpenFile([
  { key: "js", name: "index.js", code: "var name = 'var'", suffix: "js" },
  { key: "css", name: "index.css", code: "body{ width: 100px; }", suffix: "css" },
]);

code.dirClick = (item, child) => {
  console.log("目录被点击粗发")
}

window.onload = () => {
  document.body.appendChild(code.getElement());
}

```

# 树结构用法
```javaScript
import { Tree } from 'md-doc-plug';

 // 判断文档模式
  const tree = new Tree({
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
  tree.click = (...param) => {

  }
  // 错误调用
  this.tree.error = (error) => {

  }
  
  // 设置file名字
  tree.setFileName = this.#setTreeTitle.bind(this);
  // 设置树源
  tree.setSource(dir);
  window.onload = () => {
    document.body.appendChild(tree.getElement());
  }
```

# message 提示
```javaScript
import { Message } from 'md-doc-plug';

Message.success("成功提示");
Message.error("错误提示");
Message.warning("警告提示");

```