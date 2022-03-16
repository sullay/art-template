import "../index.css";
import Test from "./test"

class App extends atr.Component {
  render() {
    return (
      <div className="app">
        <Test id="test" onTest={() => { alert("test") }} />
        <button onclick={() => { alert("123") }}>确认</button>
      </div>
    )
  }
}
export default App;