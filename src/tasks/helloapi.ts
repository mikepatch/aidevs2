import { TASK_NAMES } from "../constants";
import { TasksProvider } from "../services";

(async () => {
  const taskName = TASK_NAMES.helloapi;
  const { cookie } = await TasksProvider.getTask(taskName);

  if (!cookie) throw new Error("Cookie not found");

  const answerResponse = await TasksProvider.sendAnswer(cookie);
  console.log(answerResponse);
})();
