export class Task {
  constructor(key, val = () => { }, callbackList = []) {
    this.key = key;
    this.val = val;
    this.callbackList = callbackList;
    this.next = null;
    this.pre = null;
  }
}

export class TaskList {
  constructor() {
    this.map = new Map();
    this.head = new Task('head');
    this.tail = new Task('tail');
    this.head.next = this.tail;
    this.tail.pre = this.head;
    this.length = 0;
  }

  shift() {
    if (this.length <= 0) return null;
    let task = this.head.next;
    task.pre.next = task.next;
    task.next.pre = task.pre;
    this.map.delete(task.key);
    this.length--;
    return task;
  }
  put(key, val = () => { }, callbackList = []) {
    let task;
    if (this.map.has(key)) {
      task = this.map.get(key);
      task.pre.next = task.next;
      task.next.pre = task.pre;
      task.val = val;
      task.callbackList = task.callbackList.concat(callbackList);
    } else {
      task = new Task(key, val, callbackList);
      this.map.set(key, task);
      this.length++;
    }
    task.pre = this.tail.pre;
    task.next = this.tail;
    this.tail.pre = task;
    task.pre.next = task;
  }
}