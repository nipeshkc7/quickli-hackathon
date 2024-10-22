import { connectToMongoDB, airDNDEvents, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json(
            { error: 'Event ID is required' },
            { status: 400 }
        );
    }

    const db = await connectToMongoDB(dbName);
    const repo = new airDNDEvents(db);
    const events = await repo.findById(id);
    return NextResponse.json(events);
}
