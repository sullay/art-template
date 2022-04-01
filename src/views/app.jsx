import "../index.css";
import Test from "./test"

class App extends art.Component {
  constructor(node) {
    super(node);
    this.data = {
      hasTitle: true,
      num: 1
    }
    this.start;
  }
  addNum = () => {
    if(this.data.num ===1)  this.start = performance.now();
    if (this.data.num >= 50000) {
      console.log(performance.now() - this.start);
      console.log('完成');
      return;
    }
    this.setDataNow({ num: this.data.num + 1 }, () => {
      this.addNum();
    })
  }
  render() {
    return (
      <div className="app">
        <Test count={this.data.count} hasTitle={this.data.hasTitle}/>
        <button onclick={this.addNum}>+1</button>
        <br/>
        <button onclick={() => this.setData({ hasTitle: !this.data.hasTitle })}>确认</button>
      </div>
    )
  }
}
export default App;