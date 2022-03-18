import { vNode } from './VNode'

// const ROOT = Symbol('root');
const ROOT = Symbol.for('root');

class Root extends vNode {
}

if (!window[ROOT]) {
  window[ROOT] = new Root();
}

export default window[ROOT];