
import { renderDomTree } from '../service'

export class Component {
  constructor(props) {
    this.data = {}
  }
  setData(callback) {
    this.data = callback(this.data);
    let oldDom = this.$vNode.$dom;
    this.$vNode.$dom = null;
    console.log(this.$vNode.$dom, this.$vNode.$children[0].$dom);
    renderDomTree(this.$vNode, this.$vNode.$parentNode, oldDom);
  }
}