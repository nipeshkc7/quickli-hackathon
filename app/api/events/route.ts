import Repo, { connectToMongoDB } from '@/app/lib/repo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const db = await connectToMongoDB('events');
    const repo = new Repo(db);
    const events = await repo.find({});
    return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    try {
        const db = await connectToMongoDB('events');
        const repo = new Repo(db);
        const newEvent = await repo.create(data);
        return NextResponse.json(newEvent, { status: 201 });
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error creating event: ${e.message}` },
            { status: 500 }
        );
    }
}

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
        const db = await connectToMongoDB('events');
        const repo = new Repo(db);
        const deletedEvent = await repo.delete(id);
        if (!deletedEvent) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(deletedEvent);
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error deleting event: ${e.message}` },
            { status: 500 }
        );
    }
}
