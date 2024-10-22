import { connectToMongoDB, airDNDEvents, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const db = await connectToMongoDB(dbName);
    const repo = new airDNDEvents(db);
    const events = await repo.find({});
    return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        const db = await connectToMongoDB(dbName);
        const repo = new airDNDEvents(db);
        const newEvent = await repo.create(data);
        return NextResponse.json(newEvent, { status: 201 });
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error creating event: ${e.message}` },
            { status: 500 }
        );
    }
}
