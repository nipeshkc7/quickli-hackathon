import { connectToMongoDB, airDNDUsers, dbName } from '@/app/lib/airdndClient';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    const data = await req.json();
    try {
        const db = await connectToMongoDB(dbName);
        const repo = new airDNDUsers(db);
        // return updated user data...
        const updatedUser = await repo.update(id, data);
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: `Error updating user: ${error.message}` },
            { status: 500 }
        );
    }
}
