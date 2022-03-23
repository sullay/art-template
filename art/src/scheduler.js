import { TaskList } from '../modal/Scheduler';

export const taskList = new TaskList();

// requestIdleCallback的fps为20，所以deadline。timeRemaining()范围为0-50ms。
function workLoop(deadline) {
  // 如果存在闲置时间或者有任务超出最后执行时间,则取出任务执行
  while (deadline.timeRemaining() > 1 || (taskList.getFirstTimeOut() && taskList.getFirstTimeOut() <= Date.now())) {
    let task = taskList.shift();
    if (task) {
      task.val();
      for (const callback of task.callbackList) {
        callback();
      }
    }
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
