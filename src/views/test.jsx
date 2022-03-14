import atr from 'atr';

class Test extends atr.Component {
  constructor(props, events, children) {
    super();
    this.id = props.id;
  }
  render() {
    return (
      <div>
        <h1>{this.id}</h1>
        <p style="color: red;">11111111111111111111</p>
        <p>222222222222222222</p>
      </div>
    )
  }
}
export default Test;