"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  useTheme,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  MyLocation as LocationIcon,
} from "@mui/icons-material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Mock event data with images
const boardGameEvents = [
  {
    id: 1,
    name: "Catan Night",
    location: "City Library",
    coordinates: [51.505, -0.09],
    date: "Oct 25, 2024",
    participants: 10,
    image:
      "https://images.pexels.com/photos/1422673/pexels-photo-1422673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Join us for an epic Catan showdown at the City Library!",
  },
  {
    id: 2,
    name: "Ticket to Ride Tournament",
    location: "Community Hall",
    coordinates: [51.515, -0.1],
    date: "Nov 1, 2024",
    participants: 20,
    image:
      "https://images.pexels.com/photos/1422673/pexels-photo-1422673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Compete to become the ultimate Ticket to Ride champion.",
  },
  {
    id: 3,
    name: "Pandemic Game Night",
    location: "Board Game Café",
    coordinates: [51.525, -0.08],
    date: "Nov 3, 2024",
    participants: 12,
    image:
      "https://images.pexels.com/photos/1422673/pexels-photo-1422673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Can you save the world? Join us for Pandemic night!",
  },
];

export default function HomePage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(boardGameEvents);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (search.trim()) {
      const events = boardGameEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEvents(events);
    }
  };

  const handleLocationSearch = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      setLoading(false);
    });
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Map taking full viewport */}
      <MapContainer
        center={currentLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Display event markers */}
        {filteredEvents.map((event) => (
          <Marker key={event.id} position={event.coordinates}>
            <Popup>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={event.image}
                  alt={event.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    borderRadius: theme.shape.borderRadius,
                  }}
                />
                <Typography variant="h6" sx={{ marginTop: theme.spacing(1) }}>
                  {event.name}
                </Typography>
                <Typography variant="body2">{event.description}</Typography>
                <Typography
                  variant="body2"
                  sx={{ marginTop: theme.spacing(1) }}
                >
                  Location: {event.location}
                </Typography>
                <Typography variant="body2">Date: {event.date}</Typography>
                <Typography variant="body2">
                  Participants: {event.participants}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ marginTop: theme.spacing(2) }}
                >
                  Join
                </Button>
              </motion.div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search bar as overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          backgroundColor: theme.palette.common.white,
          padding: theme.spacing(1.5),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3],
          display: "flex",
          alignItems: "center",
          zIndex: 999,
          backdropFilter: "blur(10px)", // Add a blur effect for a sleek look
        }}
      >
        <SearchIcon
          sx={{ marginRight: theme.spacing(2), color: theme.palette.grey[600] }}
        />
        <InputBase
          placeholder="Search events or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{ flex: 1 }}
        />
        <IconButton
          onClick={handleSearch}
          sx={{ marginLeft: theme.spacing(1) }}
        >
          <SearchIcon color="primary" />
        </IconButton>
        <IconButton
          onClick={handleLocationSearch}
          sx={{ marginLeft: theme.spacing(2) }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <LocationIcon color="primary" />
          )}
        </IconButton>
      </motion.div>
    </Box>
  );
}
