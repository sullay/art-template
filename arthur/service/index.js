import { vNode, vTextNode, vCompoentNode } from '../modal/VNode'
import { Component } from '../modal/Component'
import $root from '../modal/Root'

// 渲染domTree
export function renderDomTree(node, parentNode, oldDom) {
  // 如果传入的是字符串则改为文字类型元素
  if (node.constructor === String) node = new vTextNode(node);
  if (!vNode.isVNode(node)) throw new Error("渲染元素类型有误");

  // 设置父节点
  node.$parentNode = parentNode;
  let parentDom = parentNode.getDom();
  let dom = node.getDom();
  // 判断是否为自定义组件
  if (node.$isComponent) {
    node.$children[0].$parentNode = node;
    for (let child of node.$children[0].$children) renderDomTree(child, node.$children[0]);
  } else {
    for (let child of node.$children) renderDomTree(child, node);
  }
  // 绑定到父元素
  if (oldDom) {
    parentDom.replaceChild(dom, oldDom)
  } else {
    parentDom.appendChild(dom);
  }
}

// 渲染方法
export function render(node, parentDom) {
  $root.$dom = parentDom;
  $root.$children = [node];
  renderDomTree(node, $root);
}

// 创建元素
export function h(type, props, ...children) {
  if (type.prototype instanceof Component) {
    return new vCompoentNode(type, props, children);
  } else {
    return new vNode(type, props, children);
  }
}