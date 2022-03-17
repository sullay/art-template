import { renderDomTree } from '../../arthur/service'
class Test extends atr.Component {
  constructor(props, events, slots) {
    super(props);
    this.id = props.id;
    this.data = { num: 1 }
    this.addNum = this.addNum.bind(this);
  }
  addNum() {
    this.setData(({ num }) => ({ num: num + 1 }))
  }
  render() {
    return (
      <div>
        <h1>{this.id}</h1>
        <p style="color: red;">11111111111111111111</p>
        <p>计数{this.data.num}</p>
        <button onclick={this.addNum}>+1</button>
      </div>
    )
  }
}
export default Test;