import { connectToMongoDB, airDNDUsers, dbName } from '@/app/lib/airdndClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const db = await connectToMongoDB(dbName)
    const repo = new airDNDUsers(db)
    const users = await repo.find({})
    return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    try {
        const db = await connectToMongoDB(dbName)
        const repo = new airDNDUsers(db)
        const existingUser = await repo.findByEmail(data.email)
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            )
        }
        const newUser = await repo.create(data)
        return NextResponse.json(newUser, { status: 201 })
    } catch (e: any) {
        return NextResponse.json(
            { error: `Error creating user: ${e.message}` },
            { status: 500 }
        )
    }
}
