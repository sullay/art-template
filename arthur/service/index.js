import { vNode, vTextNode, vCompoentNode } from '../modal/VNode'
import { Component } from '../modal/Component'
import $root from '../modal/Root'

// 渲染domTree
export function renderDomTree(element, parentNode, oldDom) {
  // 如果传入的是字符串则改为文字类型元素
  if (element.constructor === String) element = new vTextNode(element);
  if (!vNode.isVNode(element)) throw new Error("渲染元素类型有误");

  // 设置父节点
  element.$parentNode = parentNode;
  let parentDom = parentNode.getDom();
  let dom = element.getDom();
  // 判断是否为自定义组件
  if (element.$isComponent) {
    for (let child of element.$children[0].$children) renderDomTree(child, element.$children[0]);
  } else {
    for (let child of element.$children) renderDomTree(child, element);
  }
  // 绑定到父元素
  if (oldDom) {
    parentDom.replaceChild(dom, oldDom)
  } else {
    parentDom.appendChild(dom);
  }
}

// 渲染方法
export function render(element, parentDom) {
  $root.$dom = parentDom;
  $root.$children = [element];
  renderDomTree(element, $root);
}

// 创建元素
export function h(type, props, ...children) {
  if (type.prototype instanceof Component) {
    return new vCompoentNode(type, props, children);
  } else {
    return new vNode(type, props, children);
  }
}