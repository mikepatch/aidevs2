import { TasksProvider } from "../../services";
import { TASK_NAMES } from "../../constants";
import { getAnswer, getPersonInfoFromDB, getPersonName } from "./utils";

(async () => {
  const { question } = await TasksProvider.getTask(TASK_NAMES.people);
  if (!question) throw new Error("Question not found");

  const personName = await getPersonName(question);
  const personInfo = await getPersonInfoFromDB(personName);
  const answer = await getAnswer(personInfo, question);

  console.log({ question, answer });

  const answerResponse = await TasksProvider.sendAnswer(answer);
  console.log(answerResponse);
})();
