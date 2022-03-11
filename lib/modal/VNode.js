import { TEXT_ELEMENT } from '../constants'
import { isEvent, getEventName } from '../util'

// 普通元素
export class vNode {
  constructor(type = '', allProps = {}, children = []) {
    this.type = type;
    this.props = {};
    this.events = {};
    for (let prop in allProps) {
      if (isEvent(prop)) {
        this.events[getEventName(prop)] = allProps[prop];
      } else {
        this.props[prop] = allProps[prop];
      }
    }
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