import { TEXT_ELEMENT } from '../constants'
import { isEvent, getEventName } from '../util'
import { Component } from './Component'

// 普通元素
export class vNode {
  constructor(type = '', allProps = {}, children = []) {
    this.isComponent = (type.prototype instanceof Component);
    this.type = type;
    this.props = {};
    this.events = {};
    for (let prop in allProps) {
      if (isEvent(prop)) {
        // 从props中过滤出事件监听
        this.events[getEventName(prop)] = allProps[prop];
      } else {
        this.props[prop] = allProps[prop];
      }
    }
    // 处理子元素中的文字类元素
    this.children = children.map(child => {
      return vNode.isVNode(child) ? child : new vTextNode(child);
    });
  }
  // 判断是否属于虚拟Dom元素
  static isVNode(element) {
    return element instanceof this;
  }
}

// 文字元素
export class vTextNode extends vNode {
  constructor(text) {
    super(TEXT_ELEMENT, { nodeValue: text })
  }
}