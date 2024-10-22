import { connectToMongoDB, airDNDEvents, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json(
            { error: 'Event ID is required' },
            { status: 400 }
        );
    }
    try {
        const db = await connectToMongoDB(dbName);
        const repo = new airDNDEvents(db);
        // just wait for it to be deleted, it should catch if theres an error
        await repo.delete(id);
        return NextResponse.json('Event succesfully deleted!', { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error deleting event: ${e.message}` },
            { status: 500 }
        );
    }
}
