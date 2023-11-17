import { TASK_NAMES } from "../constants";
import { OpenaiProvider, TasksProvider } from "../services";
import { CompletionMessage } from "../services/types";

const blogPostCreatorContext = `As a famous food blogger you create a wonderful and excellent content based on provided paragraph title
###
Rules:
1. Write only about the food.
2. Be creative.
3. Write 3-5 sentences about provided paragraph title.
4. Answer only in polish language.
###
`;

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

    messages.push({ role: "system", content: blogPostCreatorContext });
    messages.push(inputMessages[key]);

    const completionResponse = await OpenaiProvider.getCompletion(messages);
    if (!completionResponse) throw new Error("completion error");

    const { message } = completionResponse.choices[0];

    generatedChapters.push(message.content!);
  }

  return generatedChapters;
}
