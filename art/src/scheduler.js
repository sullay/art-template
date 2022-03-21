import { TaskList } from '../modal/Scheduler';

export const taskList = new TaskList();

function workLoop(deadline) {
  if (deadline.timeRemaining() > 20) {
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
