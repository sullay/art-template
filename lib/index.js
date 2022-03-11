import { vNode, vTextNode } from './modal/VNode'

// 渲染方法
export function render(element, parentDom) {
  // 如果传入的是字符串则改为文字类型元素
  if (element.constructor === String) element = new vTextNode(element);
  if (!vNode.isVNode(element)) throw new Error("渲染元素类型有误");
  const { type, props, events, children } = element;
  // 根据元素类型创建对应的dom
  const dom = vTextNode.isVNode(element) ? document.createTextNode('') : document.createElement(type);
  // 设置属性
  for (let key in props) dom[key] = props[key];
  // 监听事件
  for (let event in events) dom.addEventListener(event, events[event])
  // 渲染子元素
  for (let child of children) render(child, dom);
  // 绑定到父元素
  parentDom.appendChild(dom);
}

// 创建元素
export function h(type, props, ...children) {
  return new vNode(type, props, children);
}