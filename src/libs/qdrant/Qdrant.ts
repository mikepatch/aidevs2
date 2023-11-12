import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from "uuid";

import { CollectionPoint, DocumentType } from "./types";

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

export const isCollectionIndexed = async (collectionName: string) => {
  const { collections } = await qdrant.getCollections();
  const indexed = collections.find(
    (colection) => colection.name === collectionName
  );

  return indexed;
};

export const configureCollection = async (
  COLLECTION_NAME: string,
  resources: {}[]
) => {
  const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
  const isCollectionEmpty = collectionInfo.points_count === 0;

  if (isCollectionEmpty)
    await createCollectionPoints(COLLECTION_NAME, resources);
};

export async function createCollection(collectionName: string) {
  console.log(`
    -----------------------
    /// IN PROGRESS... ///
    -----------------------
    Creating collection: ${collectionName}...
    `);

  await qdrant.createCollection(collectionName, {
    vectors: { size: 1536, distance: "Cosine", on_disk: true },
  });

  console.log(`
    New collection created: ${collectionName}
    -----------------------
    /// DONE ///
    -----------------------
    `);
}

export async function createCollectionPoints(
  collectionName: string,
  resources: {}[]
) {
  console.log(`
      -----------------------
      /// IN PROGRESS... ///
      -----------------------
      Creating collection points for: ${collectionName}...
      `);

  const documents = resources.map((resource) => ({
    pageContent: {
      ...resource,
    },
    metadata: {
      source: collectionName,
      content: { ...resource },
      uuid: uuidv4(),
    },
  }));

  // Generate embeddings
  const points: CollectionPoint[] = await generatePointsWithEmbedding(
    documents
  );

  // Upsert
  await upsertCollection(collectionName, points);

  console.log(`
    Collection points created!
    -----------------------
    /// DONE ///
    -----------------------
    `);
}

export async function generatePointsWithEmbedding(documents: DocumentType[]) {
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

export async function upsertCollection(
  collectionName: string,
  points: CollectionPoint[]
) {
  console.log(`
    -----------------------
    /// IN PROGRESS... ///
    -----------------------
      Upserting the new ${collectionName} collection...
      `);

  await qdrant.upsert(collectionName, {
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

export async function searchInCollection(
  collectionName: string,
  queryEmbedding: number[]
) {
  return await qdrant.search(collectionName, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: collectionName,
          },
        },
      ],
    },
  });
}
