import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, MessageContent, SystemMessage } from "langchain/schema";

import { TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";
import { getCurrentPopulationSchema, getCurrentRateSchema } from "./schema";
import {
  currentDate,
  getCurrentRate,
  getCurrentPopulation,
  parseFunctionCall,
} from "./helpers";

(async () => {
  const { question } = await TasksProvider.getTask(TASK_NAMES.knowledge);
  if (!question) throw new Error("Question not found!");

  const chat = new ChatOpenAI({ modelName: "gpt-4-1106-preview" }).bind({
    functions: [getCurrentRateSchema, getCurrentPopulationSchema],
  });
  const tools: any = {
    getCurrentRate,
    getCurrentPopulation,
  };

  const conversation = await chat.invoke([
    new SystemMessage(`
          Fact: Today is ${currentDate}`),
    new HumanMessage(question),
  ]);

  const action = parseFunctionCall(conversation);
  let response: MessageContent = "";

  if (action) {
    console.log(`action: ${action.name}`);
    console.log(action.args);
    response = await tools[action.name](action.args);
  } else {
    response = conversation.content;
  }

  const answerResponse = await TasksProvider.sendAnswer(response);

  console.log(question);
  console.log(`AI: ${response}\n`);
  console.log(answerResponse);
})();
