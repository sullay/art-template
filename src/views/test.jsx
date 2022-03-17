import { renderDomTree } from '../../arthur/service'
class Test extends atr.Component {
  constructor(node) {
    super(node);
    this.id = this.props.id;
    this.data = { num: 1 }
    this.addNum = this.addNum.bind(this);
  }
  addNum() {
    this.setData(({ num }) => ({ num: num + 1 }))
  }
  render() {
    return (
      <div className="test">
        {this.props.hasTitle ? (<h1>{this.props.id}</h1>) : (<h2>没有title</h2>)}
        <p style="color: red;">11111111111111111111</p>
        <p>计数{this.data.num}</p>
        <button onclick={this.addNum}>+1</button>
      </div>
    )
  }
}
export default Test;