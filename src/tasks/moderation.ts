import { TASK_NAMES } from "../constants";
import { OpenaiProvider, TasksProvider } from "../services";
import { ModerateResult } from "../services/types";

(async () => {
  const taskName = TASK_NAMES.moderation;
  const { input } = await TasksProvider.getTask(taskName);
  const { results } = await OpenaiProvider.moderate(input);
  const answer = Array.from(results, (result) => isFlagged(result));

  const answerResponse = await TasksProvider.sendAnswer( answer);
  console.log(answerResponse);
})();

const isFlagged = (item: ModerateResult) => (item.flagged ? 1 : 0);
