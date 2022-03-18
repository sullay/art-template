import { TEXT_ELEMENT } from '../constants'
import { isEvent, getEventName } from '../util'

// 普通元素
export class vNode {
  constructor(type = '', allProps = {}, children = []) {
    this.$type = type;
    this.$props = {};
    this.$events = {};
    for (let prop in allProps) {
      if (isEvent(prop)) {
        // 从props中过滤出事件监听
        this.$events[getEventName(prop)] = allProps[prop];
      } else {
        this.$props[prop] = allProps[prop];
      }
    }
    // 处理子元素中的文字类元素
    this.$children = children.map(child => {
      return vNode.isVNode(child) ? child : new vTextNode(child);
    });
  }
  // 判断是否属于虚拟Dom元素
  static isVNode(element) {
    return element instanceof this;
  }
  // 获取node的dom
  getDom() {
    if (!this.$dom) this.createDom();
    return this.$dom;
  }
  // 创建dom
  createDom() {
    this.$dom = document.createElement(this.$type);
    // 设置属性
    for (let key in this.$props) this.$dom[key] = this.$props[key];
    // 监听事件
    for (let event in this.$events) this.$dom.addEventListener(event, this.$events[event]);
  }
  // 旧的node中的dom根据新node重新赋值
  static updateDom(newNode, preNode) {
    let dom = preNode.$dom;
    for (let key in preNode.$props) dom[key] = null;
    for (let event in preNode.$events) dom.removeEventListener(event, preNode.$events[event]);
    // 去掉子节点，调用renderDomTree方法时再组织dom结构
    dom.innerHTML = null;
    // 设置属性
    for (let key in newNode.$props) dom[key] = newNode.$props[key];
    // 监听事件
    for (let event in newNode.$events) dom.addEventListener(event, newNode.$events[event]);
    newNode.$dom = dom;
  }

  // 新旧节点对比，尽可能复用已有dom或者自定义组件
  static diffDom(newNodes = [], preNodes = []) {
    if (!newNodes.length || !preNodes.length) return;
    // 所有旧node
    let preMap = new Map();
    for (const node of preNodes) {
      if (!preMap.has(node.$type)) preMap.set(node.$type, []);
      if (node.$dom) preMap.get(node.$type).push(node);
    }
    // 遍历新node，查找是否存在可以复用的node
    for (const node of newNodes) {
      if (preMap.has(node.$type) && preMap.get(node.$type).length) {
        let preNode = preMap.get(node.$type).shift();
        if (vComponentNode.isVNode(node)) {
          let preChildren = preNode.$children;
          // 自定义组件，复用旧的组件实例
          node.$element = preNode.$element;
          // 组件实例$vNode指向新的node
          node.$element.$vNode = node;
          // 更新自定义组件虚拟dom树
          let child = node.$element.render();
          node.$children = [child];
          vNode.diffDom(node.$children, preChildren);
          // 自定义组件$dom指向子组件的$dom
          node.$dom = child.$dom;
        } else {
          // 普通node节点，更新后继续diff子组件
          vNode.updateDom(node, preNode);
          vNode.diffDom(node.$children, preNode.$children);
        }
      }
    }
  }
}

// 文字元素
export class vTextNode extends vNode {
  constructor(text) {
    super(TEXT_ELEMENT, { nodeValue: text })
  }
  createDom() {
    this.$dom = document.createTextNode('');
    // 设置属性
    for (let key in this.$props) this.$dom[key] = this.$props[key];
  }
}

export class vComponentNode extends vNode {
  constructor(type = '', allProps = {}, slots = []) {
    super(type, allProps);
    // 标识自定义组件
    this.$isComponent = true;
    // 插槽
    this.$slots = slots;
    // 创建组件实例
    this.$element = new type(this);
  }
  createDom() {
    let preChildren = this.$children;
    let child = this.$element.render();
    this.$children = [child];
    // 每次创建时通过diff复用之前的dom或者子组件
    vNode.diffDom(this.$children, preChildren);
    this.$dom = child.getDom();
  }
}