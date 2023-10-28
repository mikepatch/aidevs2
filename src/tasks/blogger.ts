import { OpenaiProvider, TasksProvider } from "../services";
import { CompletionMessage } from "../services/types";

const systemContext = `As a famous food blogger you create a wonderful and excellent content based on provided paragraph title
###
Rules:
1. Write only about the food.
2. Be creative.
3. Write 3-5 sentences about provided paragraph title.
4. Answer only in polish language.
###
`;

(async () => {
  const { blog } = await TasksProvider.getTask("blogger");
  if (!blog) throw new Error("blog not found");

  const answers: string[] = [];
  const blogMessages: CompletionMessage[] = blog.map((message) => ({
    role: "user",
    content: message,
  }));

  for (const key in blogMessages) {
    const messages: CompletionMessage[] = [];

    messages.push({ role: "system", content: systemContext });
    messages.push(blogMessages[key]);

    const completionResponse = await OpenaiProvider.getCompletion(messages);
    if (!completionResponse) throw new Error("completion error");
    
    const { message } = completionResponse.choices[0];

    answers.push(message.content!);
  }

  const answerResponse = await TasksProvider.sendAnswer(answers);

  console.log(answerResponse);
})();
