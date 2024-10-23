import React from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from './loading-animation.json'
import { Box } from '@mui/material'

const LoadingScreen = () => {
    return (
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
            <Lottie animationData={loadingAnimation} loop={true} />
        </Box>
    )
}

export default LoadingScreen
