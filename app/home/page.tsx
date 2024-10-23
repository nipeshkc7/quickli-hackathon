'use client'

import React, { useEffect, useState, useRef } from 'react'
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
    Slide,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
<<<<<<< HEAD
import { Image } from 'next/image'
=======
>>>>>>> 6808c6df1fbae5f3eb8d5d83b1c3bf438ed867ba

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type Event = {
    _id: string
    name: string
    location: string
    coordinates: [number, number]
    gameType: string
    date: string
    participants: number
    description: string
    createdAt: string
}

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
    const [events, setEvents] = useState<Event[]>([])
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [email, setEmail] = useState<string>('')
    const [joining, setJoining] = useState(false)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [selectedGameType, setSelectedGameType] = useState<string>('All')
    const [showMap, setShowMap] = useState<boolean>(false)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const geocoderContainerRef = useRef<HTMLDivElement | null>(null)
    const geocoderRef = useRef<MapboxGeocoder | null>(null)
    const markersRef = useRef<mapboxgl.Marker[]>([])

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events')
                if (response.ok) {
                    const data: Event[] = await response.json()
                    setEvents(data)
                    setFilteredEvents(data)
                } else {
                    console.error('Failed to fetch events')
                }
            } catch (error) {
                console.error('Error fetching events:', error)
            }
        }

        fetchEvents()
    }, [])

    // Handle search filtering
    const handleSearch = () => {
        let filtered = events.filter((event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        if (currentLocation) {
            // Optional: Filter events based on proximity to currentLocation
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
    }, [searchTerm, currentLocation, selectedGameType, events])

    // Initialize Mapbox Geocoder
    useEffect(() => {
        if (geocoderContainerRef.current && !geocoderRef.current) {
            geocoderRef.current = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search for location',
                marker: false,
                mapboxgl: mapboxgl as any,
            })
            geocoderRef.current.addTo(geocoderContainerRef.current)

            geocoderRef.current.on('result', (e) => {
                const coords = e.result.center
                setCurrentLocation({ lng: coords[0], lat: coords[1] })
                setShowMap(true)
            })
        }
    }, [])

    // Initialize or update the map when showMap or currentLocation changes
    useEffect(() => {
        if (showMap && mapContainerRef.current) {
            const initializeMap = () => {
                if (mapRef.current) {
                    mapRef.current.remove()
                }

                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current!,
                    style: 'mapbox://styles/mapbox/dark-v10',
                    center: currentLocation
                        ? [currentLocation.lng, currentLocation.lat]
                        : [151.2093, -33.8688], // Default center
                    zoom: 8, // Lower zoom level to show wider area
                })

                // Add navigation controls
                mapRef.current.addControl(new mapboxgl.NavigationControl())

                // Add markers to the map
                addMarkers()
            }

            // Delay map initialization to ensure the container is rendered
            setTimeout(() => {
                initializeMap()
            }, 300)
        }
    }, [showMap, currentLocation])

    // Update markers when filteredEvents change
    useEffect(() => {
        if (mapRef.current) {
            // Remove existing markers
            markersRef.current.forEach((marker) => marker.remove())
            markersRef.current = []

            // Add new markers
            addMarkers()
        }
    }, [filteredEvents])

    // Function to add markers to the map
    const addMarkers = () => {
        if (!mapRef.current) return

        filteredEvents.forEach((event) => {
            const el = document.createElement('div')
            el.className = 'marker'
            el.style.backgroundImage = `url(${getImgSrc(event.gameType)})`
            el.style.width = '32px'
            el.style.height = '32px'
            el.style.backgroundSize = '100%'

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${event.name}</h3><p>${event.location}</p><p>Date: ${event.date}</p>`
            )

            const marker = new mapboxgl.Marker(el)
                .setLngLat(event.coordinates)
                .setPopup(popup)
                .addTo(mapRef.current!)

            markersRef.current.push(marker)
        })
    }

    // Clean up map instance when component unmounts
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
            }
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
                fontFamily: 'Playfair Display, serif',
                overflowX: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex' }}>
                {/* Main Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        transition: 'margin-right 0.3s',
                        marginRight: showMap ? { xs: '100%', sm: '40%' } : 0,
                        padding: { xs: 2, sm: 3, md: 4 },
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
                        {/* Swapped the order of the inputs */}
                        {/* Location Search using Mapbox Geocoder */}
                        <Box
                            ref={geocoderContainerRef}
                            sx={{
                                width: { xs: '100%', sm: '300px' },
                                '& .mapboxgl-ctrl-geocoder': {
                                    width: '100%',
                                    maxWidth: '100%',
                                    backgroundColor: '#1e1e1e',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    border: '1px solid #8B4513',
                                },
                                '& .mapboxgl-ctrl-geocoder--input': {
                                    color: '#fff',
                                },
                            }}
                        />

                        <TextField
                            label="Search Events"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                style: {
                                    color: '#fff',
                                    backgroundColor: '#1e1e1e',
                                },
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
                        <IconButton
                            onClick={handleSearch}
                            sx={{ color: '#fff' }}
                        >
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
                            onChange={(e, newValue) =>
                                setSelectedGameType(newValue)
                            }
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
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    key={event._id}
                                >
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
                                                        'Roboto, sans-serif',
                                                }}
                                            >
                                                Location: {event.location}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#ccc',
                                                    fontFamily:
                                                        'Roboto, sans-serif',
                                                }}
                                            >
                                                Date: {event.date}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#ccc',
                                                    fontFamily:
                                                        'Roboto, sans-serif',
                                                }}
                                            >
                                                Participants:{' '}
                                                {event.participants}
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
                                                    backgroundColor: '#8B4513',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#A0522D',
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
                </Box>

                {/* Map Container */}
                <Slide
                    direction="left"
                    in={showMap}
                    mountOnEnter
                    unmountOnExit
                    onExited={() => {
                        // Clean up the map instance when the slide exits
                        if (mapRef.current) {
                            mapRef.current.remove()
                            mapRef.current = null
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', sm: '40%' },
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            backgroundColor: '#000', // Fallback color
                        }}
                    >
                        <Box
                            ref={mapContainerRef}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Box>
                </Slide>
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
                            fontFamily: 'Roboto, sans-serif',
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
