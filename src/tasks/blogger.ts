import { BLOG_POST_CREATOR_CONTEXT } from "../constants";

import { CompletionMessage } from "../services/types";
import { OpenaiProvider, TasksProvider } from "../services";

(async () => {
  const { blog } = await TasksProvider.getTask("blogger");
  if (!blog) throw new Error("blog not found");

  const answers = await createBlogPost(blog);

  const answerResponse = await TasksProvider.sendAnswer(answers);
  console.log(answerResponse);
})();

async function createBlogPost(inputData: string[]) {
  const generatedChapters: string[] = [];

  const inputMessages: CompletionMessage[] = inputData.map((input) => ({
    role: "user",
    content: input,
  }));

  for (const key in inputMessages) {
    const messages: CompletionMessage[] = [];

    messages.push({ role: "system", content: BLOG_POST_CREATOR_CONTEXT });
    messages.push(inputMessages[key]);

    const completionResponse = await OpenaiProvider.getCompletion(messages);
    if (!completionResponse) throw new Error("completion error");

    const { message } = completionResponse.choices[0];

    generatedChapters.push(message.content!);
  }

  return generatedChapters;
}
