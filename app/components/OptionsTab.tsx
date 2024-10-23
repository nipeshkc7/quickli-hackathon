'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Tabs, { tabsClasses } from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

// Icons
import {
    SportsEsportsOutlined,
    CasinoOutlined,
    DeckOutlined,
    SportsSoccerOutlined,
    RuleOutlined,
    PeopleAltOutlined,
    HourglassEmptyOutlined,
    EmojiEventsOutlined,
    LocalCafeOutlined,
} from '@mui/icons-material'

// Replace with board game categories
export const boardGameCategories = [
    {
        id: 1,
        label: 'Strategy',
        icon: <SportsEsportsOutlined fontSize="large" />,
    },
    { id: 2, label: 'Card Games', icon: <CasinoOutlined fontSize="large" /> },
    { id: 3, label: 'Deck Building', icon: <DeckOutlined fontSize="large" /> },
    { id: 4, label: 'Sports', icon: <SportsSoccerOutlined fontSize="large" /> },
    { id: 5, label: 'Puzzles', icon: <RuleOutlined fontSize="large" /> },
    {
        id: 6,
        label: 'Party Games',
        icon: <PeopleAltOutlined fontSize="large" />,
    },
    {
        id: 7,
        label: 'Time-based',
        icon: <HourglassEmptyOutlined fontSize="large" />,
    },
    {
        id: 8,
        label: 'Tournaments',
        icon: <EmojiEventsOutlined fontSize="large" />,
    },
    {
        id: 9,
        label: 'Casual Play',
        icon: <LocalCafeOutlined fontSize="large" />,
    },
]

const OptionsTab = () => {
    const [value, setValue] = React.useState(0)

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue)
    }

    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    px: { xs: 0, md: 2 },
                    alignItems: 'center',
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}
                >
                    {boardGameCategories.map((tab) => (
                        <Tab key={tab.id} icon={tab.icon} label={tab.label} />
                    ))}
                </Tabs>
                <Button
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        border: '1px solid #ddd',
                        minWidth: 90,
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        textTransform: 'capitalize',
                        py: 1,
                        color: 'theme.palette.text.primary',
                    }}
                >
                    Filters
                </Button>
            </Box>
        </Container>
    )
}

export default OptionsTab
