import React, { useEffect, useState, useRef } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

const LoadingScreen = () => (
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(18, 18, 18, 0.9)',
            zIndex: 9999,
            gap: 2,
        }}
    >
        <CircularProgress
            size={60}
            sx={{
                color: '#8B4513',
            }}
        />
        <Typography
            variant="h6"
            sx={{
                color: '#fff',
                fontFamily: 'Press Start 2P, cursive',
                textAlign: 'center',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                    '0%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.6 },
                },
            }}
        >
            Loading ...
        </Typography>
    </Box>
)

export default LoadingScreen
