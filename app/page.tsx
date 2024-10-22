"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  MyLocation as LocationIcon,
  Place as EventIcon,
  PersonPinCircle as UserIcon,
} from "@mui/icons-material";

type Event = {
  id: number;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  participants: number;
};

// Define the bounds for New South Wales, Australia (if needed for zoom adjustments or initial view)
const nswBounds: [number, number][] = [
  [-37.505, 140.999], // Southwest coordinates [lat, lng]
  [-28.157, 153.638], // Northeast coordinates [lat, lng]
];

// Sample event data for different places in New South Wales
const boardGameEvents: Event[] = [
  {
    id: 1,
    name: "Catan Night",
    location: "City Library, Sydney",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    date: "Oct 25, 2024",
    participants: 10,
  },
  {
    id: 2,
    name: "Ticket to Ride Tournament",
    location: "Community Hall, Newcastle",
    coordinates: { lat: -32.9283, lng: 151.7817 },
    date: "Nov 1, 2024",
    participants: 20,
  },
  {
    id: 3,
    name: "Pandemic Game Night",
    location: "Board Game Café, Wollongong",
    coordinates: { lat: -34.4278, lng: 150.8931 },
    date: "Nov 3, 2024",
    participants: 12,
  },
  {
    id: 4,
    name: "Carcassonne Championship",
    location: "Civic Center, Dubbo",
    coordinates: { lat: -32.2569, lng: 148.601 },
    date: "Nov 8, 2024",
    participants: 15,
  },
  {
    id: 5,
    name: "Root: The Board Game Meetup",
    location: "Gaming Hub, Albury",
    coordinates: { lat: -36.0737, lng: 146.9135 },
    date: "Nov 10, 2024",
    participants: 18,
  },
];

const HomePage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredEvents, setFilteredEvents] =
    useState<Event[]>(boardGameEvents);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle search filtering
  const handleSearch = () => {
    const filtered = boardGameEvents.filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  // Handle fetching user's current location
  const handleLocationSearch = () => {
    setLoading(true);
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // Fetch user location on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Map Component */}
      <Map
        initialViewState={{
          longitude: currentLocation?.lng || 151.2093,
          latitude: currentLocation?.lat || -33.8688,
          zoom: 8,
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {/* Display event markers with icons */}
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            longitude={event.coordinates.lng}
            latitude={event.coordinates.lat}
            anchor="bottom"
          >
            <EventIcon style={{ color: "#ff6347", fontSize: "30px" }} />
          </Marker>
        ))}
        {/* Show user's current location with a user icon */}
        {currentLocation && (
          <Marker
            longitude={currentLocation.lng}
            latitude={currentLocation.lat}
            anchor="bottom"
          >
            <UserIcon style={{ color: "#4682b4", fontSize: "30px" }} />
          </Marker>
        )}
      </Map>

      {/* Search bar as overlay */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          backgroundColor: "white",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <SearchIcon sx={{ marginRight: 2 }} />
        <InputBase
          placeholder="Search events or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{ flex: 1 }}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={handleLocationSearch}>
          {loading ? <CircularProgress size={24} /> : <LocationIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default HomePage;
