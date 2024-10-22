"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const CreateEventPage: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [participants, setParticipants] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [gameType, setGameType] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = (e: any) => {
    setCoordinates({ lat: e.lngLat.lat, lng: e.lngLat.lng });
  };

  const { session, isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    // Authentication status is being determined or redirection is in progress
    return null; // Or a loading indicator if you prefer
  }

  if (!isAuthenticated) {
    // User is not authenticated and has been redirected
    return null;
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!eventName || !locationName || !date || !coordinates || !gameType) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create data payload based on the EventInput format
    const payload = {
      name: eventName,
      location: locationName,
      coordinates: [coordinates.lng, coordinates.lat], // Converting to array
      date: date.toISOString(), // Converting Date to ISO string
      participants: participants ? Number(participants) : undefined,
      image: "placeholder-image-url", // Placeholder for now
      description: description,
      gameType,
    };

    try {
      setLoading(true);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Event created:", await response.json());
      alert("Event created successfully!");

      // Reset form
      setEventName("");
      setLocationName("");
      setDate(null);
      setParticipants("");
      setDescription("");
      setGameType("");
      setCoordinates(null);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        maxWidth: 700,
        margin: "auto",
        backgroundColor: "#f5f5f5",
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
      >
        Create a New Board Game Event
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {
            marginBottom: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          },
          maxWidth: 600,
          mx: "auto",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          fullWidth
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <TextField
          required
          fullWidth
          label="Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <TextField
          required
          select
          fullWidth
          label="Type of Game"
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          {[
            "Scrabble",
            "Chess",
            "Battleship",
            "Settlers of Catan",
            "Monopoly",
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
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Event Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ marginBottom: 3 }}
          />
        </LocalizationProvider>
        <TextField
          required
          fullWidth
          label="Number of Participants"
          type="number"
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          InputProps={{ inputProps: { min: 1 } }}
        />
        <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
          Select the event location on the map:
        </Typography>
        <Box
          sx={{
            height: { xs: 300, md: 400 },
            marginBottom: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Map
            initialViewState={{
              longitude: coordinates?.lng || 151.2093,
              latitude: coordinates?.lat || -33.8688,
              zoom: 5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            onClick={handleMapClick}
          >
            {coordinates && (
              <Marker
                longitude={coordinates.lng}
                latitude={coordinates.lat}
                anchor="bottom"
              >
                <div style={{ fontSize: "24px" }}>📍</div>
              </Marker>
            )}
          </Map>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            width: "100%",
            padding: 1.5,
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateEventPage;