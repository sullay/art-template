import "../index.css";
import Hello from "./hello"

class App extends art.Component {
  constructor(node) {
    super(node);
    this.data = {
      hasTitle: true
    }
  }
  render() {
    return (
      <div className="app">
        <Hello hasTitle={this.data.hasTitle} />
        <button onclick={() => this.setData({ hasTitle: !this.data.hasTitle })}>确认</button>
      </div>
    )
  }
}
export default App;