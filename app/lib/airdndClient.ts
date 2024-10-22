// src/repo.ts
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { EventType, UserType } from './types/airdnd';

export class airDNDEvents {
    private db: Db;
    private collection: Collection<EventType>;

    constructor(db: Db) {
        this.db = db;
        this.collection = this.db.collection<EventType>('airDNDEvents');
    }

    // Create a new document
    async create(data: Partial<EventType>): Promise<EventType> {
        const result = await this.collection.insertOne({
            ...data,
            createdAt: new Date(),
        } as EventType);
        return {
            _id: result.insertedId,
            ...data,
            createdAt: new Date(),
        } as EventType;
    }

    // Read (find) documents
    async find(query: Partial<EventType>): Promise<EventType[]> {
        return await this.collection.find(query).toArray();
    }

    // Find a document by ID
    async findById(id: string): Promise<EventType | null> {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    // Update a document by ID
    async update(
        id: string,
        data: Partial<EventType>
    ): Promise<EventType | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        );
        return result;
    }

    // Delete a document by ID
    async delete(id: string): Promise<EventType | null> {
        const result = await this.collection.findOneAndDelete({
            _id: new ObjectId(id),
        });
        return result;
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

export const dbName = 'AirDND';
