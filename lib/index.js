import { TEXT_ELEMENT } from "./constants"

// 普通元素
class vNode {
  constructor(type = '', props = {}, children = []) {
    this.type = type;
    this.props = props;
    this.children = children.map(child => {
      if (child.constructor === vNode) {
        return child
      } else {
        return new TextNode(child);
      }
    });
  }
}

// 文字元素
class TextNode extends vNode {
  constructor(text) {
    super(TEXT_ELEMENT, { nodeValue: text })
  }
}

// 渲染方法
export function render(element, parentDom) {
  const { type, props, children } = element;
  // 根据元素类型创建对应的dom
  const dom = type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(type);
  // 设置属性
  for (let key in props) dom[key] = props[key];
  // 渲染子元素
  for (let child of children) render(child, dom);
  // 绑定到父元素
  parentDom.appendChild(dom);
}

// 创建元素
export function h(type, props, ...children) {
  return new vNode(type, props, children);
}