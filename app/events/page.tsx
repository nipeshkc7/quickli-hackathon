import { Box, Container, CssBaseline } from '@mui/material'
import OptionsTab from '../components/OptionsTab'

import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import EventCardGrid from '../components/EventCard'
import FloatingButton from '../components/ShowMap'

const EventsPage: React.FC = () => {
    return (
        <>
            <AppBar
                position="static"
                color="default"
                sx={{ backgroundColor: 'white' }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        AIRDND
                    </Typography>
                    <Box>
                        <Link href="/" passHref>
                            <Button color="inherit">Home</Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
            <OptionsTab />
            <EventCardGrid />
            <FloatingButton />
        </>

        // <Box>
        //     <CssBaseline />
        //     <OptionsTab />
        //     <Container maxWidth="xl" sx={{ mb: 3 }}>

        //         <Box
        //             sx={{
        //                 display: { xs: 'flex', md: 'none' },
        //             }}
        //         ></Box>
        //     </Container>
        // </Box>
    )
}

export default EventsPage
