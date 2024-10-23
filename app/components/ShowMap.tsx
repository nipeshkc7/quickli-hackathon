'use client'

import React from 'react'
import { Fab } from '@mui/material'
import MapIcon from '@mui/icons-material/Map' // MUI map icon

const FloatingButton = () => {
    return (
        <Fab
            variant="extended"
            color="primary"
            sx={{
                position: 'fixed',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)', // Center horizontally
                zIndex: 1000,
                textTransform: 'capitalize',
                background: '#afa200',
            }}
        >
            <MapIcon sx={{ mr: 1 }} />
            Show Maps
        </Fab>
    )
}

export default FloatingButton
