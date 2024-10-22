import { connectToMongoDB, airDNDUsers, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }
    try {
        const db = await connectToMongoDB(dbName);
        const repo = new airDNDUsers(db);
        // just wait for it to be deleted, it should catch if theres an error
        await repo.delete(id);
        return NextResponse.json('User succesfully deleted!', { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error deleting user: ${e.message}` },
            { status: 500 }
        );
    }
}
