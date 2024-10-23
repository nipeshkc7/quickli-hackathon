'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {children}
            </LocalizationProvider>
        </SessionProvider>
    )
}
