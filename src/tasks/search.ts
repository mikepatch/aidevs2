import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from "uuid";

import { TasksProvider } from "../services";
import { TASK_NAMES } from "../constants";
import { CollectionPoint, NewsLetterLink, NewsletterDocument } from "../types";

const COLLECTION_NAME = "newsletter_links";
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

(async () => {
  const { question } = await TasksProvider.getTask(TASK_NAMES.search);
  const queryEmbedding = await embeddings.embedQuery(question!);

  const isCollectionExists = await isCollectionIndexed();
  if (!isCollectionExists) await createCollection();

  const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
  const isCollectionEmpty = collectionInfo.points_count === 0;
  if (isCollectionEmpty) await createCollectionPoints();

  const [result] = await searchInCollection(queryEmbedding);
  const answerBody = result.payload!.content as { url: string };
  const answer = answerBody.url;

  console.log(question, answer);
  const answerResponse = await TasksProvider.sendAnswer(answer);
  console.log(answerResponse);
})();

async function isCollectionIndexed() {
  const { collections } = await qdrant.getCollections();
  const indexed = collections.find(
    (colection) => colection.name === COLLECTION_NAME
  );

  return indexed;
}

async function createCollection() {
  console.log(`
  -----------------------
  /// IN PROGRESS... ///
  -----------------------
  Creating collection: ${COLLECTION_NAME}...
  `);

  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: "Cosine", on_disk: true },
  });

  console.log(`
  New collection created: ${COLLECTION_NAME}
  -----------------------
  /// DONE ///
  -----------------------
  `);
}

async function createCollectionPoints() {
  console.log(`
    -----------------------
    /// IN PROGRESS... ///
    -----------------------
    Creating collection points for: ${COLLECTION_NAME}...
    `);

  const newsletterResources = (await getNewsletterResources(
    "https://unknow.news/archiwum.json"
  )) as NewsLetterLink[];
  const newsletterResourcesOptimized = Array.from(
    { length: 300 },
    (v, i) => newsletterResources[i]
  );

  const documents: NewsletterDocument[] = newsletterResourcesOptimized.map(
    (newsletterLink) => ({
      pageContent: {
        ...newsletterLink,
      },
      metadata: {
        source: COLLECTION_NAME,
        content: { ...newsletterLink },
        uuid: uuidv4(),
      },
    })
  );

  // Generate embeddings
  const points: CollectionPoint[] = await generatePointsWithEmbedding(
    documents
  );

  // Upsert
  await upsertCollection(points);

  console.log(`
  Collection points created!
  -----------------------
  /// DONE ///
  -----------------------
  `);
}

async function getNewsletterResources(sourceUrl: string) {
  try {
    console.log(`
      -----------------------
      /// IN PROGRESS... ///
      -----------------------
      Downloading Newsletter Links...
      `);

    const res = await fetch(sourceUrl);
    if (res.ok) {
      console.log(`
      Newsletter Links downloaded successfully!
      -----------------------
      /// DONE ///
      -----------------------
      `);
      return res.json();
    }

    throw new Error(
      `There was an error with fetch: ${res.status} ${res.statusText}`
    );
  } catch (err) {
    throw err;
  }
}

async function generatePointsWithEmbedding(documents: NewsletterDocument[]) {
  console.log(`
  -----------------------
  /// IN PROGRESS... ///
  -----------------------
  Generating points with embedding...
  `);

  const points = [];
  for (const document of documents) {
    const [embedding] = await embeddings.embedDocuments([
      document.pageContent.title,
    ]);
    points.push({
      id: document.metadata.uuid,
      payload: document.metadata,
      vector: embedding,
    });
  }

  console.log(`
  -----------------------
  /// DONE ///
  -----------------------
  `);
  return points;
}

async function upsertCollection(points: CollectionPoint[]) {
  console.log(`
  -----------------------
  /// IN PROGRESS... ///
  -----------------------
    Upserting the new ${COLLECTION_NAME} collection...
    `);

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    batch: {
      ids: points.map((point) => point.id),
      vectors: points.map((point) => point.vector),
      payloads: points.map((point) => point.payload),
    },
  });

  console.log(`
  -----------------------
  /// DONE ///
  -----------------------
  `);
}

async function searchInCollection(queryEmbedding: number[]) {
  return await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: COLLECTION_NAME,
          },
        },
      ],
    },
  });
}
