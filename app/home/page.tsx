'use client'

import React, { useEffect, useState } from 'react'
import '../../styles.css' // Import your CSS for styles
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Modal,
    TextField,
    Tabs,
    Tab,
    IconButton,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

type Event = {
    id: number
    name: string
    location: string
    coordinates: {
        lat: number
        lng: number
    }
    date: string
    participants: number
    gameType: string
}

// Sample event data
const boardGameEvents: Event[] = [
    {
        id: 1,
        name: 'Catan Night',
        location: 'City Library, Sydney',
        coordinates: { lat: -33.8688, lng: 151.2093 },
        date: 'Oct 25, 2024',
        participants: 10,
        gameType: 'Catan',
    },
    {
        id: 2,
        name: 'Ticket to Ride Tournament',
        location: 'Community Hall, Newcastle',
        coordinates: { lat: -32.9283, lng: 151.7817 },
        date: 'Nov 1, 2024',
        participants: 20,
        gameType: 'Chess',
    },
    {
        id: 3,
        name: 'Pandemic Game Night',
        location: 'Board Game Café, Wollongong',
        coordinates: { lat: -34.4278, lng: 150.8931 },
        date: 'Nov 3, 2024',
        participants: 12,
        gameType: 'Battleship',
    },
    {
        id: 4,
        name: 'Carcassonne Championship',
        location: 'Civic Center, Dubbo',
        coordinates: { lat: -32.2569, lng: 148.601 },
        date: 'Nov 8, 2024',
        participants: 15,
        gameType: 'Monopoly',
    },
    {
        id: 5,
        name: 'Root: The Board Game Meetup',
        location: 'Gaming Hub, Albury',
        coordinates: { lat: -36.0737, lng: 146.9135 },
        date: 'Nov 10, 2024',
        participants: 18,
        gameType: 'Scrabble',
    },
    {
        id: 6,
        name: 'Ultimate DnD Campaign',
        location: 'Gaming Hub, Albury',
        coordinates: { lat: -36.0737, lng: 146.9135 },
        date: 'Nov 10, 2024',
        participants: 18,
        gameType: 'Dungeons and Dragons',
    },
]

const gameTypes = [
    'All',
    'Catan',
    'Scrabble',
    'Battleship',
    'Monopoly',
    'Chess',
    'Dungeons and Dragons',
]

const HomePage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [filteredEvents, setFilteredEvents] =
        useState<Event[]>(boardGameEvents)
    const [searchTerm, setSearchTerm] = useState('')
    const [location, setLocation] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [email, setEmail] = useState<string>('')
    const [joining, setJoining] = useState(false)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [selectedGameType, setSelectedGameType] = useState<string>('All')

    // Handle search filtering
    const handleSearch = () => {
        let filtered = boardGameEvents.filter((event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (location) {
            filtered = filtered.filter((event) =>
                event.location.toLowerCase().includes(location.toLowerCase())
            )
        }

        if (selectedGameType !== 'All') {
            filtered = filtered.filter(
                (event) => event.gameType === selectedGameType
            )
        }

        setFilteredEvents(filtered)
    }

    // Update filtered events when search input changes
    useEffect(() => {
        handleSearch()
    }, [searchTerm, location, selectedGameType])

    // Fetch user location on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            })
        }
    }, [])

    // Open modal to ask for email
    const handleOpenEmailModal = () => {
        setEmailModalOpen(true)
    }

    // Close modal and reset email state
    const handleCloseEmailModal = () => {
        setEmail('')
        setEmailModalOpen(false)
    }

    const handleJoinEvent = async () => {
        if (!selectedEvent) return
        setJoining(true)
        try {
            const response = await fetch('/api/events/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: 'John Doe', // Replace with dynamic user name
                    eventName: selectedEvent.name,
                    eventDate: selectedEvent.date,
                    eventTime: '18:00', // Example time, replace as needed
                    eventLocation: selectedEvent.location,
                }),
            })
            if (response.ok) {
                alert('You have successfully joined the event!')
                handleCloseEmailModal()
            } else {
                alert('Error joining the event. Please try again.')
            }
        } catch (error) {
            console.error('Error sending join request:', error)
            alert('Error joining the event. Please try again.')
        } finally {
            setJoining(false)
        }
    }

    const getImgSrc = (gameType: string) => {
        switch (gameType) {
            case 'Catan':
                return './catan.png'
            case 'Scrabble':
                return './scrabble.png'
            case 'Battleship':
                return './battleship.png'
            case 'Monopoly':
                return './monopoly.png'
            case 'Chess':
                return './chess.png'
            case 'Dungeons and Dragons':
                return './dungeon.png'
            default:
                return './boardgame.png'
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                position: 'relative',
                backgroundColor: '#121212',
                color: '#FFFFFF',
                padding: { xs: 2, sm: 3, md: 4 },
                fontFamily: 'Playfair Display, serif',
            }}
        >
            {/* Search Bar */}
            <Box
                sx={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <TextField
                    label="Search Events"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        style: { color: '#fff', backgroundColor: '#1e1e1e' },
                    }}
                    InputLabelProps={{
                        style: { color: '#fff' },
                    }}
                    sx={{
                        width: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#8B4513',
                            },
                            '&:hover fieldset': {
                                borderColor: '#A0522D',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#A0522D',
                            },
                        },
                    }}
                />
                <TextField
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    InputProps={{
                        style: { color: '#fff', backgroundColor: '#1e1e1e' },
                    }}
                    InputLabelProps={{
                        style: { color: '#fff' },
                    }}
                    sx={{
                        width: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#8B4513',
                            },
                            '&:hover fieldset': {
                                borderColor: '#A0522D',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#A0522D',
                            },
                        },
                    }}
                />
                <IconButton onClick={handleSearch} sx={{ color: '#fff' }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Subcategories Tab */}
            <Box
                sx={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Tabs
                    value={selectedGameType}
                    onChange={(e, newValue) => setSelectedGameType(newValue)}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        maxWidth: '80%',
                        margin: '0 auto',
                        '& .MuiTabs-flexContainer': {
                            justifyContent: 'center',
                        },
                    }}
                >
                    {gameTypes.map((type) => (
                        <Tab
                            key={type}
                            value={type}
                            label={type}
                            icon={
                                <img
                                    src={getImgSrc(type)}
                                    alt={type}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        marginBottom: '4px',
                                    }}
                                />
                            }
                            iconPosition="top"
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                minWidth: '80px',
                                fontFamily: 'Press Start 2P, cursive',
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Gallery Grid */}
            <Box sx={{ marginTop: '20px', paddingX: { xs: 0, sm: 2 } }}>
                <Grid container spacing={2}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    margin: 'auto',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={getImgSrc(event.gameType)}
                                    alt={event.name}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            color: '#fff',
                                            fontFamily:
                                                'Press Start 2P, cursive',
                                        }}
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#ccc',
                                            fontFamily:
                                                'Playfair Display, serif',
                                        }}
                                    >
                                        Location: {event.location}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#ccc',
                                            fontFamily:
                                                'Playfair Display, serif',
                                        }}
                                    >
                                        Date: {event.date}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#ccc',
                                            fontFamily:
                                                'Playfair Display, serif',
                                        }}
                                    >
                                        Participants: {event.participants}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setSelectedEvent(event)
                                            handleOpenEmailModal()
                                        }}
                                        sx={{
                                            marginTop: 2,
                                            backgroundColor: '#8B4513', // Board game themed color
                                            '&:hover': {
                                                backgroundColor: '#A0522D',
                                            },
                                            fontFamily:
                                                'Press Start 2P, cursive',
                                        }}
                                    >
                                        Join Event
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Email Modal */}
            <Modal
                open={emailModalOpen}
                onClose={handleCloseEmailModal}
                aria-labelledby="email-modal-title"
                aria-describedby="email-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#1e1e1e',
                        color: '#fff',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        id="email-modal-title"
                        variant="h6"
                        component="h2"
                        color="white"
                        sx={{ fontFamily: 'Press Start 2P, cursive' }}
                    >
                        Enter your email to join the event
                    </Typography>
                    <TextField
                        label="Email"
                        variant="filled"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            marginTop: 2,
                            input: { color: '#fff' },
                            label: { color: '#fff' },
                            fontFamily: 'Playfair Display, serif',
                        }}
                        InputProps={{
                            style: {
                                backgroundColor: '#333',
                                color: '#fff',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleJoinEvent}
                        disabled={!email || joining}
                        sx={{
                            marginTop: 2,
                            backgroundColor: '#8B4513',
                            '&:hover': {
                                backgroundColor: '#A0522D',
                            },
                            fontFamily: 'Press Start 2P, cursive',
                        }}
                    >
                        {joining ? 'Joining...' : 'Join'}
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}

export default HomePage
