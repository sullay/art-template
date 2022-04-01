class Test extends art.Component {
  constructor(node) {
    super(node);
  }

  render() {
    return (
      <div>
        <div>计数{this.props.count}</div>
      </div>
    )
  }
}
export default Test;