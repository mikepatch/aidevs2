import { TASK_NAMES } from "../constants";
import { OpenaiProvider, TasksProvider } from "../services";

(async () => {
  const taskName = TASK_NAMES.embedding;
  const taskInfo = await TasksProvider.getTask(taskName);
  console.log(taskInfo);
  const text = "Hawaiian Pizza";

  const response = await OpenaiProvider.getEmbedding(text);
  if (!response) throw new Error("No response!");
  const embedded = response.data[0].embedding;

  console.log(embedded);
  const answerResponse = await TasksProvider.sendAnswer(embedded);
  console.log(answerResponse);
})();
