import OpenAI from "openai";

import { MODEL_NAMES, TASK_NAMES } from "../../constants";
import { TasksProvider } from "../../services";
import { TaskResponse } from "../../services/types";

const chat = new OpenAI();
const prompt = `I will give you a drawing of a gnome with a hat on his head. Tell me what is the color of the hat in POLISH. If any errors occur, return \"ERROR\" as answer. But be careful: it won't always be a drawing of a gnome. 
rules###
- answer concisely as possible
`;

(async () => {
  const { url } = (await TasksProvider.getTask(
    TASK_NAMES.gnome
  )) as TaskResponse & { url?: string };
  if (!url) throw new Error("URL not found");

  const { choices } = await chat.chat.completions.create({
    model: MODEL_NAMES.gpt_4_vision,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
      },
    ],
  });
  const answer = choices[0].message.content;

  const answerResponse = await TasksProvider.sendAnswer(answer!);

  console.log({ url, answer });
  console.log(answerResponse);
})();
