import "../index.css";
import Test from "./test"

class App extends art.Component {
  constructor(node) {
    super(node);
    this.data = {
      count: 1
    }
    this.start;
  }
  addNum = () => {
    if (this.data.count === 1) this.start = performance.now();
    if (this.data.count >= 50000) {
      console.log(performance.now() - this.start);
      console.log('完成');
      return;
    }
    this.setData({ count: this.data.count + 1 }, () => {
      this.addNum();
    })
  }

  render() {
    return (
      <div>
        {this.props.hasTitle ? (<h1>test</h1>) : (<h2>没有title</h2>)}
        <Test count={this.data.count}/>
        <button onclick={this.addNum}>+1</button>
      </div>
    )
  }
}
export default App;