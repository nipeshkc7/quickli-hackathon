'use client'

import React, { useEffect, useState, useRef } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles.css' // Import your CSS for animations and dark theme popups
import { Box, Typography, IconButton, CircularProgress } from '@mui/material'
import {
    Search as SearchIcon,
    MyLocation as LocationIcon,
} from '@mui/icons-material'
import { Button } from '@mui/material'
import { Modal } from '@mui/material'
import { TextField } from '@mui/material'
import { useAuth } from './hooks/useAuth'
import { MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'

import { EventType } from '@/app/lib/types/airdnd'
import { generateRandomName } from '@/app/lib/utilities'

const HomePage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [filteredEvents, setFilteredEvents] = useState<EventType[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
    const [activeMarker, setActiveMarker] = useState<number | null>(null)
    const [email, setEmail] = useState<string>('')
    const [joining, setJoining] = useState(false)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [events, setEvents] = useState<EventType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [createEventModalOpen, setCreateEventModalOpen] = useState(false)
    const [newEventCoordinates, setNewEventCoordinates] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [confirmCreateOpen, setConfirmCreateOpen] = useState(false)
    const [eventName, setEventName] = useState('')
    const [locationName, setLocationName] = useState('')
    const [date, setDate] = useState<Date | null>(null)
    const [participants, setParticipants] = useState<number | ''>('')
    const [description, setDescription] = useState('')
    const [gameType, setGameType] = useState('')
    const [creating, setCreating] = useState(false)
    const [tempPin, setTempPin] = useState<{ lat: number; lng: number } | null>(
        null
    )

    // Add authentication hook
    const { session, isAuthenticated } = useAuth()

    // Handle search filtering
    const handleSearch = (searchValue: string) => {
        setSearch(searchValue)
        if (searchValue.trim() === '') {
            setFilteredEvents(events) // Reset to show all events when search is cleared
        } else {
            const filtered = events.filter((event) =>
                event.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            setFilteredEvents(filtered)
        }
    }

    // Handle fetching user's current location
    const handleLocationSearch = () => {
        setLoading(true)
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                    setLoading(false)
                },
                (error) => {
                    console.error('Error fetching location:', error)
                    setLoading(false)
                }
            )
        } else {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events')
                if (!response.ok) {
                    throw new Error('Failed to fetch events')
                }
                const data = await response.json()
                setEvents(data)
                setFilteredEvents(data) // Initialize filtered events with all events
            } catch (error) {
                console.error('Error fetching events:', error)
                // Optionally, you can set an error state here to show an error message to the user
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [])

    // Focus the hidden input when the search bar is clicked
    const focusInput = () => {
        inputRef.current?.focus()
    }

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
                    name: generateRandomName(),
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
        }
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
                coordinates: newEventCoordinates,
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

            // Reset form
            setEventName('')
            setLocationName('')
            setDate(null)
            setParticipants('')
            setDescription('')
            setGameType('')
            setCreateEventModalOpen(false)
            setTempPin(null) // Clear temp pin after successful creation

            alert('Event created successfully!')
        } catch (error) {
            console.error('Failed to create event:', error)
            alert('Failed to create event. Please try again.')
        } finally {
            setCreating(false)
        }
    }

    return (
        <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
            {/* Map Component */}
            <Map
                initialViewState={{
                    longitude: currentLocation?.lng || 151.2093,
                    latitude: currentLocation?.lat || -33.8688,
                    zoom: 8,
                }}
                style={{ width: '100%', height: '100vh' }}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                onClick={(e) => {
                    if (!isAuthenticated) {
                        alert('Please sign in to create events')
                        return
                    }
                    setSelectedEvent(null)
                    const coordinates = {
                        lat: e.lngLat.lat,
                        lng: e.lngLat.lng,
                    }
                    setNewEventCoordinates(coordinates)
                    setTempPin(coordinates) // Set temporary pin
                    setConfirmCreateOpen(true)
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    filteredEvents.map((event, index) => (
                        <Marker
                            key={index}
                            longitude={event.coordinates.lng}
                            latitude={event.coordinates.lat}
                            anchor="bottom"
                            onClick={(e) => {
                                // Prevent the map's onClick from triggering
                                e.originalEvent.stopPropagation()
                                setSelectedEvent(event)
                                setActiveMarker(index) // Set the active marker ID for animation, set by order in index, will need to check how we sort the filtered events
                            }}
                        >
                            <img
                                src={getImgSrc(event.gameType)}
                                alt={event.gameType}
                                className={
                                    activeMarker === index ? 'bounce-once' : ''
                                }
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    cursor: 'pointer',
                                    transform: 'translate(-50%, -100%)',
                                    objectFit: 'cover',
                                }}
                                onAnimationEnd={() => setActiveMarker(null)} // Clear animation state after animation completes
                            />
                        </Marker>
                    ))
                )}

                {/* Show user's current location */}
                {currentLocation && (
                    <Marker
                        longitude={currentLocation.lng}
                        latitude={currentLocation.lat}
                        anchor="bottom"
                    >
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#4682b4',
                                borderRadius: '50%',
                                border: '2px solid #fff',
                            }}
                        />
                    </Marker>
                )}

                {/* Display popup for selected event */}
                {selectedEvent && (
                    <Popup
                        longitude={selectedEvent.coordinates.lng}
                        latitude={selectedEvent.coordinates.lat}
                        anchor="top"
                        onClose={() => setSelectedEvent(null)}
                        closeOnClick={false}
                        className="mapbox-popup-content"
                    >
                        <Box color="black">
                            <Typography variant="h6">
                                {selectedEvent.name}
                            </Typography>
                            <Typography variant="body2">
                                Location: {selectedEvent.location}
                            </Typography>
                            <Typography variant="body2">
                                Date: {selectedEvent.date}
                            </Typography>
                            <Typography variant="body2">
                                Participants: {selectedEvent.participants}
                            </Typography>

                            {/* Join button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenEmailModal}
                                sx={{
                                    marginTop: 2,
                                    backgroundColor: '#8B4513', // Board game themed color
                                    '&:hover': { backgroundColor: '#A0522D' },
                                }}
                            >
                                Join Event
                            </Button>
                        </Box>
                    </Popup>
                )}

                {/* Add this new Marker for temporary pin */}
                {tempPin && (
                    <Marker
                        longitude={tempPin.lng}
                        latitude={tempPin.lat}
                        anchor="bottom"
                    >
                        <div style={{ fontSize: '24px' }}>📍</div>
                    </Marker>
                )}
            </Map>

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
                        bgcolor: 'background.paper',
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
                        color="black"
                    >
                        Enter your email to join the event
                    </Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginTop: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleJoinEvent}
                        disabled={!email || joining}
                        sx={{
                            marginTop: 2,
                            backgroundColor: '#8B4513', // Board game themed color
                            '&:hover': { backgroundColor: '#A0522D' },
                        }}
                    >
                        {joining ? 'Joining...' : 'Join'}
                    </Button>
                </Box>
            </Modal>

            {/* Scrabble-inspired Search Bar as overlay */}
            <Box
                className="scrabble-search-bar"
                sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 999,
                    cursor: 'text',
                    backgroundColor: 'transparent', // Light beige background for board game feel
                }}
                onClick={focusInput}
            >
                {/* Hidden input field */}
                <input
                    type="text"
                    ref={inputRef}
                    className="hidden-input"
                    style={{
                        textTransform: 'uppercase',
                    }}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)} // Update to call handleSearch directly
                    onKeyPress={(e) =>
                        e.key === 'Enter' && handleSearch(search)
                    } // Optional: keep this for Enter key functionality
                    autoFocus
                />

                {/* Display characters as Scrabble tiles */}
                <Box
                    className="scrabble-search-characters"
                    onClick={focusInput}
                    sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1 }}
                >
                    {search.length === 0 && (
                        <Typography
                            variant="body1"
                            sx={{ color: '#666', marginLeft: 1 }}
                        >
                            Search for events
                        </Typography>
                    )}
                    {search.split('').map((char, index) => (
                        <Box key={index} className="scrabble-tile">
                            {char.toUpperCase()}
                        </Box>
                    ))}
                </Box>
                {/* Search and location icons */}
                <IconButton onClick={() => handleSearch(search)}>
                    <SearchIcon className="scrabble-search-icon" />
                </IconButton>
                <IconButton onClick={handleLocationSearch}>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <LocationIcon className="scrabble-search-icon" />
                    )}
                </IconButton>
            </Box>

            {/* Confirm Create Modal */}
            <Modal
                open={confirmCreateOpen}
                onClose={() => {
                    setConfirmCreateOpen(false)
                    setTempPin(null) // Clear temp pin when closing
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ color: 'black' }}
                    >
                        Create a new event here?
                    </Typography>
                    <Button
                        onClick={() => {
                            setConfirmCreateOpen(false)
                            setCreateEventModalOpen(true)
                            // Don't clear temp pin here as we're moving to create modal
                        }}
                        variant="contained"
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Yes
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmCreateOpen(false)
                            setTempPin(null) // Clear temp pin when clicking No
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
                    setTempPin(null) // Clear temp pin when closing create modal
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: 'black' }}
                    >
                        Create New Event
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        label="Event Name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Location Name"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        select
                        fullWidth
                        label="Type of Game"
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        {[
                            'Scrabble',
                            'Chess',
                            'Battleship',
                            'Settlers of Catan',
                            'Monopoly',
                        ].map((game) => (
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
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Event Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            sx={{ mb: 2, width: '100%' }}
                        />
                    </LocalizationProvider>
                    <TextField
                        required
                        fullWidth
                        label="Number of Participants"
                        type="number"
                        value={participants}
                        onChange={(e) =>
                            setParticipants(Number(e.target.value))
                        }
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreateEvent}
                        disabled={creating}
                        fullWidth
                    >
                        {creating ? 'Creating...' : 'Create Event'}
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}

export default HomePage
