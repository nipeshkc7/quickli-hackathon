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
        id: 5,
        name: 'Ultimate DnD Campaign',
        location: 'Gaming Hub, Albury',
        coordinates: { lat: -36.0737, lng: 146.9135 },
        date: 'Nov 10, 2024',
        participants: 18,
        gameType: 'Dungeons and Dragons',
    },
]

const HomePage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<{
        lat: number
        lng: number
    } | null>(null)
    const [filteredEvents, setFilteredEvents] =
        useState<Event[]>(boardGameEvents)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [activeMarker, setActiveMarker] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Handle search filtering
    const handleSearch = () => {
        const filtered = boardGameEvents.filter((event) =>
            event.name.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredEvents(filtered)
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

    // Focus the hidden input when the search bar is clicked
    const focusInput = () => {
        inputRef.current?.focus()
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
                onClick={() => setSelectedEvent(null)} // Deselect event when clicking on the map
            >
                {/* Display event markers with images */}
                {filteredEvents.map((event) => (
                    <Marker
                        key={event.id}
                        longitude={event.coordinates.lng}
                        latitude={event.coordinates.lat}
                        anchor="bottom"
                        onClick={(e) => {
                            // Prevent the map's onClick from triggering
                            e.originalEvent.stopPropagation()
                            setSelectedEvent(event)
                            setActiveMarker(event.id) // Set the active marker ID for animation
                        }}
                    >
                        <img
                            src={getImgSrc(event.gameType)}
                            alt={event.gameType}
                            className={
                                activeMarker === event.id ? 'bounce-once' : ''
                            }
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                                transform: 'translate(-50%, -100%)',
                                borderRadius: '50%', // Make the image circular
                                border: '2px solid #fff', // Add a border
                                objectFit: 'cover',
                            }}
                            onAnimationEnd={() => setActiveMarker(null)} // Clear animation state after animation completes
                        />
                    </Marker>
                ))}

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
                        <Box>
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
                        </Box>
                    </Popup>
                )}
            </Map>

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
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                <IconButton onClick={handleSearch}>
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
        </Box>
    )
}

export default HomePage
