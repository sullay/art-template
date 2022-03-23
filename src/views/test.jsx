class Test extends art.Component {
  constructor(node) {
    super(node);
    this.id = this.props.id;
    this.data = { num: 1 }
    this.addNum = this.addNum.bind(this);
  }
  addNum() {
    for (let i = 0; i < 100; i++) {
      this.setData({ num: this.data.num + 1 })
    }
  }
  clickEvent = () => {
    console.log('test', this.data)
    this.events['test']('hello world')
  }
  render() {
    return (
      <div className="test">
        {this.props.hasTitle ? (<h1>{this.props.id}</h1>) : (<h2>没有title</h2>)}
        <p style="color: red;" onclick={this.clickEvent}>hello world</p>
        <p>计数{this.data.num}</p>
        <button onclick={this.addNum}>+1</button>
      </div>
    )
  }
}
export default Test;