import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Button,
    Chip,
    Container,
    Paper,
    Modal,
} from "@mui/material";
import Swal from "sweetalert2";

const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flights, searchDetails, passengerSummary } = location.state || {};
    console.log(location.state);
    const [open, setOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);

    // Function to calculate price for each passenger
    const calculatePassengerPrice = (flight, passenger, selectedClass) => {
        const distance = flight?.trajet.distance || 1000;
        const pricePerKm = selectedClass?.prixKm;

        // Base price calculation
        const basePrice = distance * pricePerKm / 10;

        // Calculate price for this passenger after applying reduction
        const passengerPrice = basePrice * (1 - passenger?.reduction); // Apply the reduction

        return passengerPrice.toFixed(2); // Return with two decimal places
    };

    const handleValidation = (flight) => {
        setOpen(false)
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Voulez-vous vraiment réserver ce vol ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, réserver",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                handleSelectVol(flight);
            }
        });
    };

    // Function to handle flight selection and navigate to booking page
    const handleSelectVol = (flight) => {
        navigate(`/booking/${flight.id}`, { state: { flight, passengerSummary, updatedPassengerSummary, searchDetails, totalPrice } });
    };

    const handleOpen = (flight) => {
        setSelectedFlight(flight);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Calculate total price and update passengerSummary
    const updatedPassengerSummary = passengerSummary?.map((passenger) => {
        const passengerPrice = calculatePassengerPrice(flights[0], passenger, searchDetails.selectedClass);
        return {
            ...passenger,
            passengerPrice: parseFloat(passengerPrice), // Add individual price to passenger
        };
    });

    const totalPrice = updatedPassengerSummary?.reduce((total, passenger) => {
        return total + passenger.passengerPrice; // Sum all individual prices
    }, 0).toFixed(2);

    if (!flights || flights.length === 0) {
        return (
            <Typography variant="h6" color="error" align="center">
                Aucun vol trouvé.
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ my: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
                Available Flights
            </Typography>
            <Grid container spacing={3}>
                {flights.map((flight) => {
                    return (
                        <Grid item xs={12} key={flight.id}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6">{flight?.villeDepart || 'N/A'} → {flight?.villeArrivee || 'N/A'}</Typography>
                                        <Typography color="text.secondary">{flight?.avion?.nom || 'N/A'}</Typography>
                                        <Button size="small" color="primary" sx={{ mt: 1 }} onClick={() => handleOpen(flight)}>
                                            Airplane Info
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography>{flight.dateDepart} → {flight.dateArrivee}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Typography variant="h6" color="primary">
                                            {totalPrice} €
                                        </Typography>
                                        {flight.ce_dispo < 5 && (
                                            <Chip label={`Low Availability: ${flight.ce_dispo} left`} color="error" size="small" />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleValidation(flight)}
                                        >
                                            Book
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Modal for Flight Details */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                        maxWidth: 500,
                        width: "90%",
                    }}
                >
                    {selectedFlight && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Flight Details
                            </Typography>
                            <Typography>
                                <strong>Flight ID:</strong> {selectedFlight.id}
                            </Typography>
                            <Typography>
                                <strong>Route:</strong> {selectedFlight.trajet.villeDepart} → {selectedFlight.trajet.villeArrivee}
                            </Typography>
                            <Typography>
                                <strong>Airline:</strong> {selectedFlight?.avion?.nom || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>Departure:</strong> {selectedFlight?.dateDepart || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>Arrival:</strong> {selectedFlight?.dateArrivee || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>Available Seats:</strong>
                            </Typography>
                            <Typography>Economy: {selectedFlight.ce_dispo}</Typography>
                            <Typography>Business: {selectedFlight.ca_dispo}</Typography>
                            <Typography>First Class: {selectedFlight.cp_dispo}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                fullWidth
                                onClick={() => handleValidation(selectedFlight)}
                            >
                                Book Now
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default FlightResults;
