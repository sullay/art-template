import { vNode, vTextNode, vComponentNode } from '../modal/VNode'
import { Component } from '../modal/Component'
import $root from '../modal/Root'
// 渲染domTree
// oldDom用于在无法复用dom，或者复用的dom不是原dom时，进行替换防止位置变化，如果不传入则向后追加。
export function renderDomTree(node, parentNode) {
  let x = performance.now();
  let time;
  if (!vNode.isVNode(node)) throw new Error("渲染元素类型有误");
  // 设置父节点
  node.$parentNode = parentNode;
  let parentDom = parentNode.getDom();
  let dom = node.getDom();
  if(!dom.parentNode){
    if(node.$beforeNode==='head'&& parentDom.firstChild){
      let x = performance.now();
      let time;
      parentDom.firstChild.before(dom)
      time = performance.now() - x;
      if(time>0.5) console.log('before',node,time)
    }else if (node.$beforeNode&&node.$beforeNode!=='head'){
      let x = performance.now();
      let time;
      node.$beforeNode.$dom.after(dom);
      time = performance.now() - x;
      if(time>0.5) console.log('after',node,time)
    }else{
      let x = performance.now();
      let time;
      parentDom.appendChild(dom);
      time = performance.now() - x;
      if(time>0.5) console.log('appendChild',node,time)
    }
  }

  // 判断是否为自定义组件
  if (node.$isComponent) {
    if(!node.$children[0].$parentNode){
      node.$children[0].$parentNode = node;
      for (let child of node.$children[0].$children) renderDomTree(child, node.$children[0]);
    }
  } else {
    for (let child of node.$children) renderDomTree(child, node);
  }
  time = performance.now() - x;
  if(time>0.5) console.log(node,time)
}

// 渲染方法
export function render(node, parentDom) {
  $root.$dom = parentDom;
  $root.$children = [node];
  renderDomTree(node, $root);
}

// 创建元素
export function h(type, props, ...children) {
  children = children.flat();
  if (type.prototype instanceof Component) {
    return new vComponentNode(type, props, children);
  } else {
    return new vNode(type, props, children);
  }
}