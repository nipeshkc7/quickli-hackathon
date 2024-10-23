// /app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'
import { airDNDUsers, connectToMongoDB, dbName } from '@/app/lib/airdndClient'

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            // Include user.id on session
            if (session.user && token.sub) {
                session.user.id = token.sub
            }

            if (!session.user.email) {
                return session
            }
            try {
                const db = await connectToMongoDB(dbName)
                const repo = new airDNDUsers(db)
                if (await repo.findByEmail(session?.user?.email)) {
                    return session
                }
                const insertedId = await repo.create({
                    fname: session?.user?.email,
                    lname: '',
                    age: 0,
                    email: session?.user?.email,
                    role: 'user',
                    rating: 0,
                })
            } catch (e: any) {
                console.error(e)
                console.error('Error creating user', e.message)
                return session
            }

            return session
        },
    },
    events: {
        async signIn(message) {
            console.log('User signed in:', message)
        },
        async signOut(message) {
            console.log('User signed out:', message)
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
