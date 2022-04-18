class Test extends art.Component {
  constructor(node) {
    super(node);
  }
  shouldComponentUpdate(nextProps){
    return this.props.count!== nextProps.count
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