import { connectToMongoDB, airDNDEvents, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json(
            { error: 'Event ID is required' },
            { status: 400 }
        );
    }

    const data = await req.json();
    try {
        const db = await connectToMongoDB(dbName);
        const repo = new airDNDEvents(db);
        // return updated event data...
        const updatedEvent = await repo.update(id, data);
        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: `Error updating event: ${error.message}` },
            { status: 500 }
        );
    }
}
