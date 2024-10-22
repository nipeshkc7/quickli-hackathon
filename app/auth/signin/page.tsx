'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Box, Typography } from '@mui/material'
import { useEffect, Suspense } from 'react'
import Image from 'next/image'

const SignInContent = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    useEffect(() => {
        if (session) {
            router.replace(callbackUrl)
        }
    }, [session, router, callbackUrl])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: 4,
                backgroundColor: '#f5f5f5', // Non-black background
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#333' }}
            ></Typography>
            <Button
                variant="contained"
                onClick={() => signIn('google')}
                sx={{
                    marginTop: 2,
                    backgroundColor: '#fff',
                    color: '#000',
                    textTransform: 'none',
                    fontSize: '16px',
                    padding: '10px 24px',
                    borderRadius: 2,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Image
                    src="/google-logo.svg"
                    alt="Google Logo"
                    width={40}
                    height={40}
                    style={{ marginRight: '8px' }}
                />
                Sign in with Google
            </Button>
        </Box>
    )
}

const SignInPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInContent />
        </Suspense>
    )
}

export default SignInPage
