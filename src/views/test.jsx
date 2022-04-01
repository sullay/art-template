class Test extends art.Component {
  constructor(node) {
    super(node);
  }

  render() {
    return (
      <div>
        {this.props.hasTitle ? (<h1>test</h1>) : (<h2>没有title</h2>)}
        <div>计数{this.props.count}</div>
      </div>
    )
  }
}
export default Test;