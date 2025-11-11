'use server';
/**
 * @fileOverview MongoDB service for handling ingredient data.
 *
 * - searchIngredients - A function that searches for ingredients by name.
 * - getIngredientSchema - A function that returns the Ingredient schema.
 * - IngredientSchema - The schema for an ingredient.
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import { z } from 'zod';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const client = new MongoClient(uri, {
  // Explicitly enable TLS for Atlas to avoid platform SSL handshake issues
  tls: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

// Define the Ingredient schema
export async function getIngredientSchema() {
  return z.object({
    name: z.string().describe('The name of the ingredient.'),
    aname: z.string().optional().describe('The alternate name of the ingredient.'),
    description: z.string().optional().describe('A description of the ingredient.'),
    healthBenefits: z.string().optional().describe('Known health benefits of the ingredient.'),
  });
}

export type Ingredient = z.infer<Awaited<ReturnType<typeof getIngredientSchema>>>;

async function ensureConnection() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(e) {
    console.error(e);
    // Ensures that the client will close when you finish/error
    await client.close();
    throw e;
  }
}

const dbName = process.env.MONGODB_DB;
if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

const collectionName = 'Ingredients';

const feedbackCollectionName = 'Feedback';

/**
 * Searches for ingredients in MongoDB by name.
 * @param query The search query.
 * @returns A list of ingredient names that match the query.
 */
export async function searchIngredients(query: string): Promise<string[]> {
    await ensureConnection();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create a text index on the 'name' and 'aname' fields if it doesn't exist
    const indexExists = await collection.indexExists('name_text_aname_text');
    if (!indexExists) {
        await collection.createIndex(
            { name: 'text', aname: 'text' }
        );
    }

    const results = await collection
        .find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { aname: { $regex: query, $options: 'i' } }
            ]
        })
        .limit(10)
        .toArray();

    return results.map(result => (result as any).name);
}

export type FeedbackDocument = {
  message: string;
  rating?: number;
  email?: string;
  page?: string;
  userAgent?: string;
  createdAt: Date;
};

/**
 * Saves a feedback document to MongoDB.
 * @param feedback The feedback payload to persist.
 */
export async function saveFeedback(feedback: Omit<FeedbackDocument, 'createdAt'>): Promise<void> {
  await ensureConnection();
  const db = client.db(dbName);
  const collection = db.collection<FeedbackDocument>(feedbackCollectionName);
  await collection.insertOne({
    ...feedback,
    createdAt: new Date(),
  });
}
