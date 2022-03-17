import "../index.css";
import Test from "./test"

class App extends atr.Component {
  constructor(node) {
    super(node);
    this.data = {
      hasTitle: true
    }
  }
  render() {
    return (
      <div className="app">
        <Test id="test" hasTitle={this.data.hasTitle} onTest={() => { alert("test") }} />
        <button onclick={() => this.setData(() => ({ hasTitle: !this.data.hasTitle }))}>确认</button>
      </div>
    )
  }
}
export default App;