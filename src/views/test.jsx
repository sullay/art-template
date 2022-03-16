import { renderDomTree } from '../../arthur/service'
class Test extends atr.Component {
  constructor(props, events, slots) {
    super();
    this.id = props.id;
    this.num = 1;
    this.addNum = this.addNum.bind(this);
  }
  addNum() {
    this.num++;
    let oldDom = this.$vNode.$dom;
    this.$vNode.$dom = null;
    renderDomTree(this.$vNode, this.$vNode.$parentNode, oldDom);
  }
  render() {
    return (
      <div>
        <h1>{this.id}</h1>
        <p style="color: red;">11111111111111111111</p>
        <p>计数{this.num}</p>
        <button onclick={this.addNum}>+1</button>
      </div>
    )
  }
}
export default Test;