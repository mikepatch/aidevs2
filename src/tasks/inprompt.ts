import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { TasksProvider } from "../services";

(async () => {
  const { input: inputs, question } = (await TasksProvider.getTask(
    "inprompt"
  )) as { input: string[]; question: string };

  const chat = new ChatOpenAI({ maxConcurrency: 5 });
  const { content: name } = await chat.call([
    new SystemMessage(
      `Find the name of the person inside the provided text and return only that name and nothing else`
    ),
    new HumanMessage(`Text: ###${question}###`),
  ]);

  const systemContext = inputs.filter((input) => input.includes(name));
  const { content: answer } = await chat.call([
    new SystemMessage(
      `Answer questions as truthfully using the context below and nothing more. If you don't know the answer, say "don't know".
        context###${systemContext}###
        `
    ),
    new HumanMessage(question),
  ]);

  const answerResponse = await TasksProvider.sendAnswer(answer);
  console.log(answerResponse);
})();
