import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { TasksProvider } from "../../services";
import { TASK_NAMES } from "../../constants";
import {
  configureCollection,
  isCollectionIndexed,
  searchInCollection,
} from "../../libs/qdrant/Qdrant";
import { getNewsletterResources } from "./utils";

const COLLECTION_NAME = "newsletter_links";
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

(async () => {
  const { question } = await TasksProvider.getTask(TASK_NAMES.search);
  const queryEmbedding = await embeddings.embedQuery(question!);

  const isCollectionExists = await isCollectionIndexed(COLLECTION_NAME);
  if (!isCollectionExists) {
    const resources = await getNewsletterResources(
      "https://unknow.news/archiwum.json"
    );
    const optimizedResources = Array.from(
      { length: 300 },
      (_, i) => resources[i]
    );
    await configureCollection(COLLECTION_NAME, optimizedResources);
  }

  const [result] = await searchInCollection(COLLECTION_NAME, queryEmbedding);
  const answerBody = result.payload!.content as { url: string };
  const answer = answerBody.url;

  console.log(question, answer);
  const answerResponse = await TasksProvider.sendAnswer(answer);
  console.log(answerResponse);
})();
