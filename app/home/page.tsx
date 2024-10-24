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

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import LoadingScreen from '../components/Loading'

import { useAuth } from '../hooks/useAuth'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MenuItem } from '@mui/material'

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

// 1. Remove duplicate type definition - keep only one
type RegisteredUser = {
    email: string
    name: string
    joinedAt: string
}

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
    const [showMap, setShowMap] = useState<boolean>(true)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const geocoderContainerRef = useRef<HTMLDivElement | null>(null)
    const geocoderRef = useRef<MapboxGeocoder | null>(null)
    const markersRef = useRef<mapboxgl.Marker[]>([])

    const [isLoading, setIsLoading] = useState(true)
    // Add these new state variables inside the HomePage component
    const [createEventModalOpen, setCreateEventModalOpen] = useState(false)
    const [newEventCoordinates, setNewEventCoordinates] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [confirmCreateOpen, setConfirmCreateOpen] = useState(false)
    const [tempPin, setTempPin] = useState<{ lat: number; lng: number } | null>(
        null
    )

    // Add event form states
    const [eventName, setEventName] = useState('')
    const [locationName, setLocationName] = useState('')
    const [date, setDate] = useState<Date | null>(null)
    const [participants, setParticipants] = useState<number | ''>('')
    const [description, setDescription] = useState('')
    const [gameType, setGameType] = useState('')
    const [creating, setCreating] = useState(false)

    // Add authentication hook
    const { session, isAuthenticated } = useAuth()

    // 2. Remove duplicate state declarations - keep only one
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [selectedEventDetails, setSelectedEventDetails] =
        useState<Event | null>(null)
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
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
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
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
                        : [151.2093, -33.8688],
                    zoom: 8,
                })

                // Add navigation controls
                mapRef.current.addControl(new mapboxgl.NavigationControl())

                // Add click handler for creating new events
                mapRef.current.on('click', (e) => {
                    if (!isAuthenticated) {
                        alert('Please sign in to create events')
                        return
                    }
                    const coordinates = {
                        lat: e.lngLat.lat,
                        lng: e.lngLat.lng,
                    }
                    setNewEventCoordinates(coordinates)
                    setTempPin(coordinates)
                    setConfirmCreateOpen(true)
                })

                // Add markers to the map
                addMarkers()
            }

            setTimeout(() => {
                initializeMap()
            }, 300)
        }
    }, [showMap, currentLocation, isAuthenticated])

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
            el.style.cursor = 'pointer'

            const marker = new mapboxgl.Marker(el)
                .setLngLat(event.coordinates)
                .addTo(mapRef.current!)

            // Add click handler to marker element
            el.addEventListener('click', (e) => {
                e.stopPropagation() // Prevent map click
                setSelectedEventId(event._id)

                // Scroll the event into view in the list
                const eventElement = document.getElementById(
                    `event-${event._id}`
                )
                if (eventElement) {
                    eventElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    })
                }
            })

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

    const getStockImgSrc = (id: number) => {
        const stockImages = [
            './stock-7.png',
            './stock-1.jpg',
            './stock-2.jpg',
            './stock-3.jpg',
            './stock-4.jpg',
            './stock-5.jpg',
            './stock-6.jpg',
        ]
        return stockImages[id % stockImages.length]
    }

    // Add this function to handle event creation
    const handleCreateEvent = async () => {
        if (
            !newEventCoordinates ||
            !eventName ||
            !locationName ||
            !date ||
            !gameType
        ) {
            alert('Please fill in all required fields.')
            return
        }

        setCreating(true)
        try {
            const payload = {
                name: eventName,
                location: locationName,
                coordinates: [newEventCoordinates.lng, newEventCoordinates.lat],
                date: date.toISOString(),
                participants: participants ? Number(participants) : undefined,
                image: 'placeholder-image-url',
                description,
                gameType,
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) throw new Error(`Error: ${response.statusText}`)

            // Refresh events list
            const updatedEvents = await fetch('/api/events').then((res) =>
                res.json()
            )
            setEvents(updatedEvents)
            setFilteredEvents(updatedEvents)

            // Reset form and clear temp pin
            setEventName('')
            setLocationName('')
            setDate(null)
            setParticipants('')
            setDescription('')
            setGameType('')
            setCreateEventModalOpen(false)
            setTempPin(null) // Ensure temp pin is cleared after successful creation

            alert('Event created successfully!')
        } catch (error) {
            console.error('Failed to create event:', error)
            alert('Failed to create event. Please try again.')
        } finally {
            setCreating(false)
        }
    }

    // First, modify the useEffect for temporary pins to include cleanup
    useEffect(() => {
        let tempMarker: mapboxgl.Marker | null = null

        if (tempPin && mapRef.current) {
            tempMarker = new mapboxgl.Marker()
                .setLngLat([tempPin.lng, tempPin.lat])
                .addTo(mapRef.current)
        }

        // Cleanup function to remove the temporary marker
        return () => {
            if (tempMarker) {
                tempMarker.remove()
            }
        }
    }, [tempPin])

    // Add some CSS to style the popup
    // You can add this to your styles.css file or create a new style block in your component
    useEffect(() => {
        // Add custom styles for mapboxgl popups
        const style = document.createElement('style')
        style.textContent = `
            .mapboxgl-popup-content {
                background-color: transparent !important;
                padding: 0 !important;
                border-radius: 4px !important;
            }
            .mapboxgl-popup-close-button {
                color: #fff !important;
                font-size: 16px !important;
                padding: 4px 8px !important;
                right: 4px !important;
                top: 4px !important;
            }
            .mapboxgl-popup-tip {
                border-top-color: #1e1e1e !important;
            }
        `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    // Add a cleanup for selectedEventId when map is clicked
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.on('click', () => {
                setSelectedEventId(null)
            })
        }
    }, [mapRef.current])

    // Update the banner CSS in the useEffect
    useEffect(() => {
        const style = document.createElement('style')
        style.textContent = `
                @keyframes floatUpDown {
                    50% { transform: translate(-50%, -10px); }
                    100%, 0% { transform: translate(-50%, 0); }
                }
                .floating-banner {
                    animation: floatUpDown 2s ease-in-out infinite;
                    background-color: rgba(30, 30, 30, 0.9);
                    border: 2px solid #8B4513;
                    border-radius: 0 0 16px 16px;
                    padding: 16px 32px;
                    position: absolute;
                    top: 0.5%;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: opacity 0.3s ease;
                    width: 80%;
                    text-align: center;
                }
                .floating-banner:hover {
                    opacity: 0.9;
                }
            `
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    // Add this function with the other handlers
    const handleOpenDetails = async (event: Event) => {
        setSelectedEventDetails(event)
        setDetailsModalOpen(true)

        try {
            const response = await fetch(`/api/events/${event._id}/users`)
            if (response.ok) {
                const users = await response.json()
                setRegisteredUsers(users)
            } else {
                console.error('Failed to fetch registered users')
                setRegisteredUsers([])
            }
        } catch (error) {
            console.error('Error fetching registered users:', error)
            setRegisteredUsers([])
        }
    }

    return (
        <>
            {isLoading && <LoadingScreen />}
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
                            marginRight: showMap
                                ? { xs: '100%', sm: '40%' }
                                : 0,
                            padding: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '300px',
                                backgroundImage: "url('./header.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 20%',
                                backgroundRepeat: 'no-repeat',
                                scale: 0.6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                overflow: 'hidden',
                                marginRight: showMap
                                    ? { xs: '100%', sm: '40%' }
                                    : 0, // Add this line
                                transition: 'margin-right 0.3s', // Add this line
                            }}
                        />
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
                                            fontFamily:
                                                'Press Start 2P, cursive',
                                        }}
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        {/* Gallery Grid */}
                        <Box
                            sx={{
                                marginTop: '20px',
                                paddingX: { xs: 0, sm: 2 },
                            }}
                        >
                            <Grid container spacing={2}>
                                {filteredEvents.map((event, id) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        key={event._id}
                                        id={`event-${event._id}`}
                                    >
                                        <Card
                                            sx={{
                                                maxWidth: 345,
                                                backgroundColor:
                                                    selectedEventId ===
                                                    event._id
                                                        ? '#2e2e2e'
                                                        : '#1e1e1e',
                                                color: '#fff',
                                                margin: 'auto',
                                                transition:
                                                    'background-color 0.3s ease',
                                                border:
                                                    selectedEventId ===
                                                    event._id
                                                        ? '2px solid #8B4513'
                                                        : 'none',
                                                '&:hover': {
                                                    backgroundColor: '#2e2e2e',
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={getStockImgSrc(id)}
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
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
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
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleOpenDetails(
                                                                event
                                                            )
                                                        }
                                                        sx={{
                                                            flex: 1,
                                                            borderColor:
                                                                '#8B4513',
                                                            color: '#fff',
                                                            '&:hover': {
                                                                borderColor:
                                                                    '#A0522D',
                                                                backgroundColor:
                                                                    'rgba(139, 69, 19, 0.1)',
                                                            },
                                                            fontFamily:
                                                                'Press Start 2P, cursive',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => {
                                                            setSelectedEvent(
                                                                event
                                                            )
                                                            handleOpenEmailModal()
                                                        }}
                                                        sx={{
                                                            flex: 1,
                                                            backgroundColor:
                                                                '#8B4513',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#A0522D',
                                                            },
                                                            fontFamily:
                                                                'Press Start 2P, cursive',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        Join
                                                    </Button>
                                                </Box>
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
                            {/* Floating Banner */}
                            {isAuthenticated && (
                                <div className="floating-banner">
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#fff',
                                            fontFamily:
                                                'Press Start 2P, cursive',
                                            fontSize: '1.2rem',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            letterSpacing: '0.1em',
                                            textShadow:
                                                '2px 2px 4px rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        Click anywhere to start an event!
                                    </Typography>
                                </div>
                            )}

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

                {/* Confirm Create Modal */}
                <Modal
                    open={confirmCreateOpen}
                    onClose={() => {
                        setConfirmCreateOpen(false)
                        setTempPin(null)
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: '#1e1e1e',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            color: '#fff',
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Create a new event here?
                        </Typography>
                        <Button
                            onClick={() => {
                                setConfirmCreateOpen(false)
                                setCreateEventModalOpen(true)
                            }}
                            variant="contained"
                            sx={{ mt: 2, mr: 2 }}
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={() => {
                                setConfirmCreateOpen(false)
                                setTempPin(null)
                            }}
                            variant="outlined"
                            sx={{ mt: 2 }}
                        >
                            No
                        </Button>
                    </Box>
                </Modal>

                {/* Create Event Modal */}
                <Modal
                    open={createEventModalOpen}
                    onClose={() => {
                        setCreateEventModalOpen(false)
                        setTempPin(null)
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: '#1e1e1e',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            maxHeight: '90vh',
                            overflow: 'auto',
                            color: '#fff',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Create New Event
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            label="Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                style: { color: '#fff' },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Location Name"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                style: { color: '#fff' },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        />
                        <TextField
                            required
                            select
                            fullWidth
                            label="Type of Game"
                            value={gameType}
                            onChange={(e) => setGameType(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                style: { color: '#fff' },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        >
                            {gameTypes
                                .filter((type) => type !== 'All')
                                .map((game) => (
                                    <MenuItem key={game} value={game}>
                                        {game}
                                    </MenuItem>
                                ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Event Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                style: { color: '#fff' },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                        />
                        <DatePicker
                            label="Event Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            sx={{
                                mb: 2,
                                width: '100%',
                                '& .MuiInputBase-root': {
                                    color: '#fff',
                                    backgroundColor: '#1e1e1e',
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#fff',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#fff',
                                },
                            }}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Number of Participants"
                            type="number"
                            value={participants}
                            onChange={(e) =>
                                setParticipants(Number(e.target.value))
                            }
                            InputProps={{
                                inputProps: { min: 1 },
                                style: { color: '#fff' },
                            }}
                            InputLabelProps={{
                                style: { color: '#fff' },
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateEvent}
                            disabled={creating}
                            fullWidth
                            sx={{
                                backgroundColor: '#8B4513',
                                '&:hover': { backgroundColor: '#A0522D' },
                            }}
                        >
                            {creating ? 'Creating...' : 'Create Event'}
                        </Button>
                    </Box>
                </Modal>

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
                                '&[disabled]': {
                                    color: '#e1e1e1',
                                    backgroundColor: '#71706f', // Cool blue for disabled state
                                },
                            }}
                        >
                            {joining ? 'Joining...' : 'Join'}
                        </Button>
                    </Box>
                </Modal>

                {/* Event Details Modal */}
                <Modal
                    open={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    aria-labelledby="event-details-modal"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 600 },
                            maxHeight: '90vh',
                            bgcolor: '#1e1e1e',
                            border: '2px solid #8B4513',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            overflow: 'auto',
                            color: '#fff',
                        }}
                    >
                        {selectedEventDetails && (
                            <>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    sx={{
                                        mb: 3,
                                        fontFamily: 'Press Start 2P, cursive',
                                        fontSize: {
                                            xs: '1.2rem',
                                            sm: '1.5rem',
                                        },
                                        color: '#8B4513',
                                    }}
                                >
                                    {selectedEventDetails.name}
                                </Typography>

                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Box
                                        component="img"
                                        src={getImgSrc(
                                            selectedEventDetails.gameType
                                        )}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'contain',
                                            mr: 3,
                                            borderRadius: 1,
                                        }}
                                    />
                                    <Box>
                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontFamily:
                                                    'Roboto, sans-serif',
                                                color: '#ccc',
                                            }}
                                        >
                                            <strong>Game Type:</strong>{' '}
                                            {selectedEventDetails.gameType}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontFamily:
                                                    'Roboto, sans-serif',
                                                color: '#ccc',
                                            }}
                                        >
                                            <strong>Location:</strong>{' '}
                                            {selectedEventDetails.location}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontFamily:
                                                    'Roboto, sans-serif',
                                                color: '#ccc',
                                            }}
                                        >
                                            <strong>Date:</strong>{' '}
                                            {new Date(
                                                selectedEventDetails.date
                                            ).toLocaleDateString()}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontFamily:
                                                    'Roboto, sans-serif',
                                                color: '#ccc',
                                            }}
                                        >
                                            <strong>Max Participants:</strong>{' '}
                                            {selectedEventDetails.participants}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontFamily: 'Press Start 2P, cursive',
                                        fontSize: '1rem',
                                        color: '#8B4513',
                                    }}
                                >
                                    Description
                                </Typography>
                                <Typography
                                    sx={{
                                        mb: 3,
                                        fontFamily: 'Roboto, sans-serif',
                                        color: '#ccc',
                                    }}
                                >
                                    {selectedEventDetails.description ||
                                        'No description available.'}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontFamily: 'Press Start 2P, cursive',
                                        fontSize: '1rem',
                                        color: '#8B4513',
                                    }}
                                >
                                    Registered Users ({registeredUsers.length})
                                </Typography>
                                <Box
                                    sx={{
                                        bgcolor: '#2e2e2e',
                                        borderRadius: 1,
                                        p: 2,
                                        maxHeight: 200,
                                        overflow: 'auto',
                                    }}
                                >
                                    {registeredUsers.length > 0 ? (
                                        registeredUsers.map((user, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    borderBottom:
                                                        index <
                                                        registeredUsers.length -
                                                            1
                                                            ? '1px solid #444'
                                                            : 'none',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: '#8B4513',
                                                        mr: 2,
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontFamily:
                                                            'Roboto, sans-serif',
                                                        color: '#ccc',
                                                    }}
                                                >
                                                    {user.name} ({user.email})
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography
                                            sx={{
                                                fontFamily:
                                                    'Roboto, sans-serif',
                                                color: '#888',
                                                textAlign: 'center',
                                            }}
                                        >
                                            No users registered yet
                                        </Typography>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Modal>
            </Box>
        </>
    )
}

export default HomePage
