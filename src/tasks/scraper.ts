import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { TASK_NAMES } from "../constants";
import { TasksProvider } from "../services";
// import { delayRequest } from "../helpers";

(async () => {
  const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const {
    msg: systemContext,
    input: articleUrl,
    question,
  } = await TasksProvider.getTask(TASK_NAMES.scraper);
  console.log("Task info:", { systemContext, articleUrl, question });

  const articleContent = await getArticle(articleUrl as string);

  const { content: answer } = await chat.call([
    new SystemMessage(`${systemContext}
      ###context
      ${articleContent}
      ###
      `),
    new HumanMessage(question!),
  ]);

  console.log({ question, answer });
  const answerResponse = await TasksProvider.sendAnswer(answer);
  console.log(answerResponse);
})();

async function getArticle(url: string, retries = 3, delay = 3000) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      },
    });

    if (res.ok) {
      return res.text();
    }

    // if (retries > 0) {
    //   // await delayRequest(delay, "Retrying...");
    //
    //   return getArticle(url, retries - 1);
    // }

    throw new Error(`${res.status} ${res.statusText}`);
  } catch (err) {
    throw err;
  }
}
