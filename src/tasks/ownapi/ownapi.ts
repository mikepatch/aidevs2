import { TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";

const API_URL = "https://miketest.bieda.it/ask";

(async () => {
  const taskInit = await TasksProvider.getTask(TASK_NAMES.ownapi);
  if (!taskInit) throw new Error("Task init problem");

  const answerResponse = await TasksProvider.sendAnswer(API_URL);

  console.log(answerResponse);
})();
