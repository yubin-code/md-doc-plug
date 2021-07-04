import Dom from '../../../utils/dom';
export default (name, cla) => {
  return Dom.create(
    "a", { title: name, class: "tool-move" },
    [
      Dom.create("i", { class: "iconfont icon-close tool-close" }),
      Dom.create("i", { class: `iconfont ${cla}` }),
      Dom.create("i", { class: "iconfont icon-success-tick tool-success-tick" }),
    ]
  )
}