import { TasksProvider } from "../services";
import { createBlogPost } from "../utils";

(async () => {
  const { blog } = await TasksProvider.getTask("blogger");
  if (!blog) throw new Error("blog not found");

  const answers = await createBlogPost(blog);

  const answerResponse = await TasksProvider.sendAnswer(answers);
  console.log(answerResponse);
})();
