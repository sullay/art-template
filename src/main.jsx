import "./index.css";

render(
  <div>
    <p style="color: red;">111</p>
    <p>222</p>
    <div onclick={()=>{alert("123")}}>333</div>
  </div>,
  document.getElementById('root')
)