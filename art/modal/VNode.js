import {
  isEvent,
  getEventName
} from '../util'
import {
  renderDomTree
} from '../src/render'
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
    this.$children = children;
  }
  // 判断是否属于虚拟Dom元素
  static isVNode(node) {
    return node instanceof this;
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
    for (let key in this.$props) {
      if (key.includes('-')) {
        this.$dom.setAttribute(key, this.$props[key]);
      } else {
        this.$dom[key] = this.$props[key];
      }
    }
    // 监听事件
    for (let event in this.$events) this.$dom.addEventListener(event, this.$events[event]);
  }
  // 旧的node中的dom根据新node重新赋值
  static updateDom(newNode, preNode) {
    let dom = preNode.$dom;
    for (let key in newNode.$props) {
      if (newNode.$props[key] !== preNode.$props[key]) {
        key.includes('-') ? dom.setAttribute(key, newNode.$props[key]) : dom[key] = newNode.$props[key];
      }
    }
    for (let key in preNode.$props) {
      if (!newNode.$props[key]) {
        key.includes('-') ? dom.setAttribute(key, '') : dom[key] = '';
      }
    }
    for (let key in newNode.$events) {
      if (newNode.$events[key] !== preNode.$events[key]) {
        dom.removeEventListener(key, preNode.$events[key]);
        dom.addEventListener(key, newNode.$events[key]);
      }
    }
    for (let key in preNode.$events) {
      if(!newNode.$events[key]) dom.removeEventListener(key, preNode.$events[key]);
    }
    newNode.$dom = dom;
  }

  // 新旧节点对比，尽可能复用已有dom或者自定义组件
  // static diffDom2(newNodes = [], preNodes = []) {
  //   if (!newNodes.length) {
  //     preNodes.forEach(node => node.$dom && node.$dom.remove());
  //     return;
  //   }
  //   // 所有旧node
  //   let preMap = new Map();
  //   for (const node of preNodes) {
  //     if (!preMap.has(node.$type)) preMap.set(node.$type, []);
  //     if (node.$dom) preMap.get(node.$type).push(node);
  //   }
  //   // 遍历新node，查找是否存在可以复用的node
  //   let beforeNode = 'head';
  //   for (const node of newNodes) {
  //     if (preMap.has(node.$type) && preMap.get(node.$type).length) {
  //       let preNode = preMap.get(node.$type).shift();
  //       if (vComponentNode.isVNode(node)) {
  //         let preChildren = preNode.$children;
  //         // 自定义组件，复用旧的组件实例
  //         node.$instance = preNode.$instance;
  //         // 组件实例$vNode指向新的node
  //         node.$instance.$vNode = node;
  //         if (!node.$instance.shouldComponentUpdate || !node.$instance.shouldComponentUpdate(node.$props)) {
  //           node.$children = preNode.$children;
  //           node.$dom = preNode.$dom;
  //           node.$children[0].$parentNode = node;
  //         } else {
  //           node.$instance.props = node.$props;
  //           // 更新自定义组件虚拟dom树
  //           let child = node.$instance.render();
  //           node.$children = [child];
  //           vNode.diffDom(node.$children, preChildren);
  //           // 自定义组件$dom指向子组件的$dom
  //           node.$dom = child.$dom;
  //         }
  //       } else {
  //         vNode.updateDom(node, preNode);
  //         vNode.diffDom(node.$children, preNode.$children);
  //       }
  //     }
  //     node.$beforeNode = beforeNode;
  //     beforeNode = node;
  //   }

  //   preMap.forEach(list => {
  //     if (!list.length) return;
  //     list.forEach(node => node.$dom && node.$dom.remove())
  //   })
  // }
  // static diffDom(_newNodes = [], _preNodes = []) {
  //   let stack = [
  //     [_newNodes, _preNodes]
  //   ];
  //   while (stack.length) {
  //     let [newNodes, preNodes] = stack.pop();
  //     if (!newNodes.length) {
  //       preNodes.forEach(node => node.$dom && node.$dom.remove());
  //       continue;
  //     }
  //     // 所有旧node
  //     let preMap = new Map();
  //     for (const node of preNodes) {
  //       if (!preMap.has(node.$type)) preMap.set(node.$type, []);
  //       if (node.$dom) preMap.get(node.$type).push(node);
  //     }
  //     // 遍历新node，查找是否存在可以复用的node
  //     let beforeNode = 'head';
  //     for (const node of newNodes) {
  //       if (preMap.has(node.$type) && preMap.get(node.$type).length) {
  //         let preNode = preMap.get(node.$type).shift();
  //         if (vComponentNode.isVNode(node)) {
  //           let preChildren = preNode.$children;
  //           // 自定义组件，复用旧的组件实例
  //           node.$instance = preNode.$instance;
  //           // 组件实例$vNode指向新的node
  //           node.$instance.$vNode = node;
  //           if (!node.$instance.shouldComponentUpdate || !node.$instance.shouldComponentUpdate(node.$props)) {
  //             node.$children = preNode.$children;
  //             node.$dom = preNode.$dom;
  //             node.$children[0].$parentNode = node;
  //           } else {
  //             node.$instance.props = node.$props;
  //             // 更新自定义组件虚拟dom树
  //             let child = node.$instance.render();
  //             node.$children = [child];
  //             // vNode.diffDom(node.$children, preChildren);
  //             stack.push([node.$children, preChildren]);
  //             // 自定义组件$dom指向子组件的$dom
  //             node.$dom = child.$dom;
  //           }
  //         } else {
  //           vNode.updateDom(node, preNode);
  //           stack.push([node.$children, preNode.$children]);
  //         }
  //       }
  //       node.$beforeNode = beforeNode;
  //       beforeNode = node;
  //     }
  //     preMap.forEach(list => {
  //       if (!list.length) return;
  //       list.forEach(node => node.$dom && node.$dom.remove())
  //     })
  //   }
  // }
}

// 文字元素
export class vTextNode extends vNode {
  constructor(text) {
    super(vTextNode.type, {
      nodeValue: text
    })
  }
  static type = Symbol('TEXT_ELEMENT');
  createDom() {
    this.$dom = document.createTextNode('');
    // 设置属性
    for (let key in this.$props) this.$dom[key] = this.$props[key];
  }
}

export class vComponentNode extends vNode {
  constructor(type = '', allProps = {}) {
    super(type, allProps);
    // 标识自定义组件
    this.$isComponent = true;
    // 创建组件实例
    this.$instance = new type({
      props: this.$props
    });
    this.$instance.$vNode = this;
  }
  createDom() {
    let child = this.$instance.render();
    this.$children = [child];
    this.$dom = child.getDom();
  }
  updateComponent() {
    // let x = performance.now();
    // let time;
    let preChildren = this.$children;
    let child = this.$instance.render();
    this.$children = [child];
    // time = performance.now() - x;
    // if (time > 0.5) console.log('updateComponent_0', this, time)

    vComponentNode.diffDom(this.$children, preChildren, this);
    this.$dom = child.getDom();

    // time = performance.now() - x;
    // if (time > 0.5) console.log('updateComponent', this, time)
  }

  static diffDom(_newNodes = [], _preNodes = [], _parentNode) {
    let stack = [
      [_newNodes, _preNodes, _parentNode]
    ];
    while (stack.length) {
      let [newNodes, preNodes, parentNode, parentNodeBefore] = stack.pop();
      if (!newNodes.length) {
        preNodes.forEach(node => node.$dom && node.$dom.remove());
        continue;
      }
      // 所有旧node
      let preMap = new Map();
      for (const node of preNodes) {
        if (!preMap.has(node.$type)) preMap.set(node.$type, []);
        if (node.$dom) preMap.get(node.$type).push(node);
      }
      let beforeNode = null;
      for (const node of newNodes) {
        if (preMap.has(node.$type) && preMap.get(node.$type).length) {
          node.$parentNode = parentNode;
          let preNode = preMap.get(node.$type).shift();
          if (vComponentNode.isVNode(node)) {
            // 自定义组件，复用旧的组件实例
            node.$instance = preNode.$instance;
            // 组件实例$vNode指向新的node
            node.$instance.$vNode = node;
            if (!node.$instance.shouldComponentUpdate || !node.$instance.shouldComponentUpdate(node.$props)) {
              node.$children = preNode.$children;
              node.$dom = preNode.$dom;
              node.$children[0].$parentNode = node;
            } else {
              node.$instance.props = node.$props;
              // 更新自定义组件虚拟dom树
              let child = node.$instance.render();
              node.$children = [child];
              // vComponentNode.diffDom(node.$children, preNode.$children, node);
              stack.push([node.$children, preNode.$children, node, beforeNode]);
              // 自定义组件$dom指向子组件的$dom
              // node.$dom = child.getDom();
            }
          } else {
            vNode.updateDom(node, preNode);
            // vComponentNode.diffDom(node.$children, preNode.$children, node);
            stack.push([node.$children, preNode.$children, node]);
          }
        } else if (parentNode.$isComponent) {
          let dom = parentNode.getDom();
          if (parentNodeBefore) {
            parentNodeBefore.$dom.after(dom);
          } else if (parentNode.$parentNode.$dom.firstChild) {
            parentNode.$parentNode.$dom.firstChild.before(dom);
          } else {
            parentNode.$parentNode.$dom.appendChild(dom);
          }
          renderDomTree(parentNode, parentNode.$parentNode);
        } else {
          let dom = node.getDom();
          if (node.$type === 'h1' || node.$type === 'h2')
            if (beforeNode) {
              beforeNode.$dom.after(dom);
            } else if (parentNode.$dom.firstChild) {
            if (node.$type === 'h1' || node.$type === 'h2')
              parentNode.$dom.firstChild.before(dom);
          } else {
            parentNode.$dom.appendChild(dom);
          }
          renderDomTree(node, parentNode);
        }
        beforeNode = node;
      }
      if (parentNode.$isComponent && !parentNode.$dom) parentNode.$dom = newNodes[0].getDom();
      preMap.forEach(list => {
        if (!list.length) return;
        list.forEach(node => node.$dom && node.$dom.remove())
      })
    }
  }
  // 新旧节点对比，尽可能复用已有dom或者自定义组件
  // static diffDom2(newNodes = [], preNodes = [], parentNode) {
  //   let x = performance.now();
  //   let time;
  //   if (!newNodes.length) {
  //     preNodes.forEach(node => node.$dom && node.$dom.remove());
  //     return;
  //   }
  //   // 所有旧node
  //   let preMap = new Map();
  //   for (const node of preNodes) {
  //     if (!preMap.has(node.$type)) preMap.set(node.$type, []);
  //     if (node.$dom) preMap.get(node.$type).push(node);
  //   }
  //   time = performance.now() - x;
  //   if (time > 0.5) console.log('diff_map', parentNode, time)
  //   // 遍历新node，查找是否存在可以复用的node
  //   let beforeNode = null;
  //   for (const node of newNodes) {
  //     if (preMap.has(node.$type) && preMap.get(node.$type).length) {
  //       node.$parentNode = parentNode;
  //       let preNode = preMap.get(node.$type).shift();
  //       if (vComponentNode.isVNode(node)) {
  //         let y = performance.now();
  //         let time1;
  //         // 自定义组件，复用旧的组件实例
  //         node.$instance = preNode.$instance;
  //         // 组件实例$vNode指向新的node
  //         node.$instance.$vNode = node;
  //         if (!node.$instance.shouldComponentUpdate || !node.$instance.shouldComponentUpdate(node.$props)) {
  //           node.$children = preNode.$children;
  //           node.$dom = preNode.$dom;
  //           node.$children[0].$parentNode = node;
  //         } else {
  //           node.$instance.props = node.$props;
  //           // 更新自定义组件虚拟dom树
  //           let child = node.$instance.render();
  //           node.$children = [child];
  //           vComponentNode.diffDom(node.$children, preNode.$children, node);
  //           // 自定义组件$dom指向子组件的$dom
  //           node.$dom = child.getDom();
  //         }
  //         time1 = performance.now() - y;
  //         if (parentNode.$type === 'tbody' && time1 > 0.15) console.log(node.$props.key, node, time1)
  //       } else {
  //         vNode.updateDom(node, preNode);
  //         vComponentNode.diffDom(node.$children, preNode.$children, node);
  //       }
  //     } else {
  //       let dom = node.getDom();
  //       if (beforeNode) {
  //         beforeNode.$dom.after(dom);
  //       } else if (parentNode.$dom.firstChild) {
  //         parentNode.$dom.firstChild.before(dom);
  //       } else {
  //         parentNode.$dom.appendChild(dom);
  //       }
  //       renderDomTree(node, parentNode);
  //     }
  //     beforeNode = node;
  //   }
  //   time = performance.now() - x;
  //   if (time > 0.5) console.log('diff_1', parentNode, time)
  //   preMap.forEach(list => {
  //     if (!list.length) return;
  //     list.forEach(node => node.$dom && node.$dom.remove())
  //   })
  //   time = performance.now() - x;
  //   if (time > 0.5) console.log('diff', parentNode, time)
  // }
  // createDom() {
  //   let preChildren = this.$children;
  //   let child = this.$instance.render();
  //   this.$children = [child];
  //   // 每次创建时通过diff复用之前的dom或者子组件
  //   vNode.diffDom(this.$children, preChildren);
  //   this.$dom = child.getDom();
  // }
}