import "../index.css";
import Test from "./test"

class App extends art.Component {
  constructor(node) {
    super(node);
    this.data = {
      hasTitle: true
    }
  }
  test = (name) => {
    console.log(this.data)
    alert(name)
  }
  render() {
    return (
      <div className="app">
        <Test id="test" hasTitle={this.data.hasTitle} onTest={this.test} />
        <button onclick={() => this.setData({ hasTitle: !this.data.hasTitle })}>确认</button>
      </div>
    )
  }
}
export default App;