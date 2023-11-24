import { TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";


(async () => {
  const API_URL = "https://miketest.bieda.it/ask";
  const taskInit = await TasksProvider.getTask(TASK_NAMES.ownapi);
  if (!taskInit) throw new Error("Task init problem");

  const answerResponse = await TasksProvider.sendAnswer(API_URL);

  console.log(answerResponse);
})();
