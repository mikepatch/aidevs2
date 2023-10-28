import { BLOG_POST_CREATOR_CONTEXT } from "../constants";
import { OpenaiProvider } from "../services";
import { CompletionMessage } from "../services/types";

export const createBlogPost = async (inputData: string[]) => {
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
};
