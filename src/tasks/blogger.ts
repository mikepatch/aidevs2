import { BLOG_POST_CREATOR_CONTEXT, TASK_NAMES } from "../constants";
import { OpenaiProvider, TasksProvider } from "../services";
import { CompletionMessage } from "../services/types";

(async () => {
  const taskName = TASK_NAMES.blogger;
  const { blog } = await TasksProvider.getTask(taskName);
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
