// /app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'
import { airDNDUsers, connectToMongoDB } from '@/app/lib/airdndClient'

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
                const db = await connectToMongoDB('airDND')
                const repo = new airDNDUsers(db)
                if (await repo.findByEmail(session?.user?.email)) {
                    console.log('user found in db, not creating new user')
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
                console.log('insertedId', insertedId)
            } catch (e: any) {
                console.error(e)
                throw new Error('Error creating user', e.message)
            }

            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
