import "../index.css";
import Test from "./test"

class App extends art.Component {
  constructor(node) {
    super(node);
    this.data = {
      hasTitle: true,
      count: 1
    }
    this.start;
  }
  addNum = () => {
    if(this.data.count ===1)  this.start = performance.now();
    if (this.data.count >= 50000) {
      console.log(performance.now() - this.start);
      console.log('完成');
      return;
    }
    this.setData({ count: this.data.count + 1 }, () => {
      this.addNum();
    })
  }
  xxx = ()=>{
    this.setData({ hasTitle: !this.data.hasTitle })
  }
  render() {
    return (
      <div className="app">
        <Test count={this.data.count} hasTitle={this.data.hasTitle}/>
        <button onclick={this.addNum}>+1</button>
        <br/>
        <button onclick={this.xxx}>确认</button>
      </div>
    )
  }
}
export default App;