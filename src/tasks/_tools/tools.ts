import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";
import { currentDate } from "./helpers";

(async () => {
  const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const { question } = await TasksProvider.getTask(TASK_NAMES.tools);
  if (!question) throw new Error("Question not found");

  const { content } = await chat.call([
    new SystemMessage(`
    Describe the message as a 'ToDo' or 'Calendar' tool and return a JSON: {"tool":"tool","desc":"short task summary"}. If tool is 'Calendar' return also {"date":"scheduled date in format: YYYY-MM-DD"}
    Before you answer please take a deep breathe and think twice.
  
    facts###
      Today is ${currentDate()}
  
      tool###
      - ToDo
      - Calendar
  
      rules###
      - 'ToDo' — if this is typical task
      - 'Calendar' — if some date is provided (even in realtive format like: Tomorrow)
  
      examples###
      - Przypomnij mi, że muszę zrobić zakupy
      {"tool": "ToDo", "desc": "Zrób zakupy" }
      - Pojutrze mam spotkanie z Michałem
      {"tool": "Calendar", "desc", "Spotkanie z Michałem", "date": "2023-11-17"}`),
    new HumanMessage(question),
  ]);

  console.log(question, content);
  const answerResponse = await TasksProvider.sendAnswer(
    JSON.parse(content as string)
  );
  console.log(answerResponse);
})();
