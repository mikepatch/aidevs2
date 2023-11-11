import { ChatOpenAI } from "langchain/chat_models/openai";
import { TASK_NAMES } from "../constants";
import { TasksProvider } from "../services";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { TaskResponse } from "../services/types";

const chat = new ChatOpenAI();
(async () => {
  const initHint = await getHint();
  const conversation = [
    new SystemMessage(
      `Let's play guess who is the person game! I will give you a hint and you will try to guess the person I mean. But one #IMPORTANT thing: if you're not sure in 100% just return 'NO' and anything else and I give you another hint. You must take in the context the whole conversation. If you're sure then you can return the name of the person.`
    ),
  ];
  let answer;

  async function guessPerson(message: string) {
    conversation.push(new HumanMessage(message));
    const { content } = await chat.call(conversation);

    if (content === "NO") {
      const hint = await getHint();

      await guessPerson(hint);
    } else {
      answer = content;
    }
  }

  await guessPerson(initHint);

  if (answer) {
    const answerResponse = await TasksProvider.sendAnswer(answer);
    console.log(answerResponse);
  }
})();

async function getHint() {
  const { hint } = (await TasksProvider.getTask(
    TASK_NAMES.whoami
  )) as TaskResponse & { hint: string };

  console.log("getHint(): ", hint);
  return hint;
}
