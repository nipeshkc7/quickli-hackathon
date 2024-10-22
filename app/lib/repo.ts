// src/repo.ts
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// Define the type for your data
type MyModel = any;

class Repo {
    private db: Db;
    private collection: Collection<MyModel>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<MyModel>('myModel');
    }

    // Create a new document
    async create(data: Partial<MyModel>): Promise<MyModel> {
        const result = await this.collection.insertOne({
            ...data,
            createdAt: new Date(),
        } as MyModel);
        return {
            _id: result.insertedId,
            ...data,
            createdAt: new Date(),
        } as MyModel;
    }

    // Read (find) documents
    async find(query: Partial<MyModel>): Promise<MyModel[]> {
        return await this.collection.find(query).toArray();
    }

    // Find a document by ID
    async findById(id: string): Promise<MyModel | null> {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    // Update a document by ID
    async update(id: string, data: Partial<MyModel>): Promise<MyModel | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        );
        return result.value;
    }

    // Delete a document by ID
    async delete(id: string): Promise<MyModel | null> {
        const result = await this.collection.findOneAndDelete({
            _id: new ObjectId(id),
        });
        return result.value;
    }
}

// MongoDB connection setup
export const connectToMongoDB = async (collectionName: string): Promise<Db> => {
    if (process.env.MONGODB_URI === undefined) {
        throw new Error('MONGODB_URI is not defined');
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('MongoDB connected');
    return client.db(collectionName);
};

export default Repo;
