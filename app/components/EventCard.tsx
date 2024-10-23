'use client'

import React from 'react'
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
} from '@mui/material'

// Sample data for board game events
const games = [
    {
        id: 1,
        banner: 'https://via.placeholder.com/300x150', // Replace with game banner URL
        categories: 'Strategy, Card Game',
        date: 'Oct 25, 2024',
        participants: 8,
        prizePool: '₱5,000',
    },
    {
        id: 2,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Sports, Casual Play',
        date: 'Nov 10, 2024',
        participants: 12,
        prizePool: '₱10,000',
    },
    {
        id: 3,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Puzzles, Time-based',
        date: 'Dec 1, 2024',
        participants: 6,
        prizePool: '₱3,000',
    },
    {
        id: 4,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Tournaments, Deck Building',
        date: 'Oct 30, 2024',
        participants: 16,
        prizePool: '₱8,000',
    },
    {
        id: 1,
        banner: 'https://via.placeholder.com/300x150', // Replace with game banner URL
        categories: 'Strategy, Card Game',
        date: 'Oct 25, 2024',
        participants: 8,
        prizePool: '₱5,000',
    },
    {
        id: 2,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Sports, Casual Play',
        date: 'Nov 10, 2024',
        participants: 12,
        prizePool: '₱10,000',
    },
    {
        id: 3,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Puzzles, Time-based',
        date: 'Dec 1, 2024',
        participants: 6,
        prizePool: '₱3,000',
    },
    {
        id: 4,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Tournaments, Deck Building',
        date: 'Oct 30, 2024',
        participants: 16,
        prizePool: '₱8,000',
    },
    {
        id: 1,
        banner: 'https://via.placeholder.com/300x150', // Replace with game banner URL
        categories: 'Strategy, Card Game',
        date: 'Oct 25, 2024',
        participants: 8,
        prizePool: '₱5,000',
    },
    {
        id: 2,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Sports, Casual Play',
        date: 'Nov 10, 2024',
        participants: 12,
        prizePool: '₱10,000',
    },
    {
        id: 3,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Puzzles, Time-based',
        date: 'Dec 1, 2024',
        participants: 6,
        prizePool: '₱3,000',
    },
    {
        id: 4,
        banner: 'https://via.placeholder.com/300x150',
        categories: 'Tournaments, Deck Building',
        date: 'Oct 30, 2024',
        participants: 16,
        prizePool: '₱8,000',
    },
    // Add more game events here
]

const EventCardGrid = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={4}>
                {games.map((game) => (
                    <Grid item xs={12} sm={6} md={3} key={game.id}>
                        <Card sx={{ height: '100%' }}>
                            {/* Game Banner */}
                            <CardMedia
                                component="img"
                                height="150"
                                image={game.banner}
                                alt="Game banner"
                            />
                            {/* Game Details */}
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {game.categories}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Date: {game.date}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Participants: {game.participants}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Prize Pool: {game.prizePool}
                                </Typography>
                                {/* Join Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Join
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default EventCardGrid
