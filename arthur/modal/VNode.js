import { TEXT_ELEMENT } from '../constants'
import { isEvent, getEventName } from '../util'
import { Component } from './Component'

// 普通元素
export class vNode {
  constructor(type = '', allProps = {}, children = []) {
    // this.$isComponent = (type.prototype instanceof Component);
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
  getDom() {
    if (!this.$dom) this.createDom();
    return this.$dom;
  }
  createDom() {
    this.$dom = document.createElement(this.$type);
    // 设置属性
    for (let key in this.$props) this.$dom[key] = this.$props[key];
    // 监听事件
    for (let event in this.$events) this.$dom.addEventListener(event, this.$events[event]);
  }
  static updateDom(newNode, preNode) {
    let dom = preNode.$dom;
    for (let key in preNode.$props) dom[key] = null;
    for (let event in preNode.$events) dom.removeEventListener(event, preNode.$events[event]);
    // 设置属性
    for (let key in newNode.$props) dom[key] = newNode[key];
    // 监听事件
    for (let event in newNode$events) dom.addEventListener(event, newNode.$events[event]);
    newNode.$dom = dom;
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

export class vCompoentNode extends vNode {
  constructor(type = '', allProps = {}, slots = []) {
    super(type, allProps);
    this.$isComponent = true;
    this.$slots = slots;
    this.$element = new type(this.$props, this.$events, slots);
    this.$element.$vNode = this;
  }
  createDom() {
    let child = this.$element.render();
    // let preChild = this.$element.$children[0];
    // if (preChild && preChild.$dom && preChild.type === child.type) {
    //   vNode.updateDom(child, preChild);
    // }
    this.$children = [child];
    this.$dom = child.getDom();
  }
}