import { TasksProvider } from "../services";

(async () => {
  const { cookie } = await TasksProvider.getTask("helloapi");

  if (!cookie) throw new Error("Cookie not found");

  const answerResponse = await TasksProvider.sendAnswer(cookie);
  console.log(answerResponse);
})();
