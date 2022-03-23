
import { renderDomTree } from '../src/render'
import { taskList } from '../src/scheduler'

// 自定义组件类
export class Component {
  constructor(node) {
    // 绑定对应node节点
    this.$vNode = node;
    this.data = {}
  }
  // 所有属性都去node上面拿，复用原组件时不需要初始化可以更新数据与事件。（解决react props不更新问题）
  get props() {
    return this.$vNode.$props;
  }
  get events() {
    return this.$vNode.$events;
  }
  get slots() {
    return this.$vNode.$slots;
  }
  // 更新响应式数据
  setData(data, ...callbackList) {
    for (const key in data) {
      this.data[key] = data[key];
    }
    taskList.put(this.$vNode, {
      val: () => {
        let oldDom = this.$vNode.$dom;
        // 自定义组件node的$dom指向子节点的$dom，此处赋值为null是为了触发createDom
        this.$vNode.$dom = null;
        renderDomTree(this.$vNode, this.$vNode.$parentNode, oldDom);
      }, callbackList
    });
  }
}