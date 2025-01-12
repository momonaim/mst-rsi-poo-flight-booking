import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Divider, Paper, Grid } from "@mui/material";
import { useValue } from "../../context/ContextProvider";
import Swal from "sweetalert2";
import axios from "axios";

const Validation = () => {
    const {
        state: { currentUser },
        dispatch,
    } = useValue();
    const location = useLocation();
    const navigate = useNavigate();

    const { flight, passengers, totalPrice, selectedClass } = location.state || {};
    console.log(location.state)
    const [loading, setLoading] = useState(false);

    if (!flight || !passengers) {
        return (
            <Typography variant="h6" color="error" align="center">
                Aucune donnée à afficher. Veuillez revenir en arrière.
            </Typography>
        );
    }

    const handleValidation = async () => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Confirmez-vous les détails de la réservation ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, confirmer",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirm();
            }
        });
    };


    const handleConfirm = async () => {
        console.log("Détails confirmés :", { flight, passengers, totalPrice, selectedClass });

        // Check if the user is logged in
        if (!currentUser) {
            Swal.fire({
                icon: "warning",
                title: "Non connecté",
                text: "Vous devez être connecté pour effectuer un paiement.",
                confirmButtonText: "Se connecter",
            }).then(() => {
                dispatch({ type: "OPEN_LOGIN" });
            });
            return;
        }

        try {
            setLoading(true);
            // Step 1: Create reservation data
            const reservationData = {
                volId: flight.id,
                userId: currentUser.id,
                nbrBeneficier: passengers.length || 0,
                prixTotal: totalPrice || 100,
                statut: false,
                canceled: false,
                selectedClass: selectedClass,
            };

            // Send reservation data to the backend
            const reservationResponse = await axios.post("http://localhost:8080/reservations/create", null, {
                params: reservationData,
            });

            const reservation = await reservationResponse.data;
            console.log("Réservation créée :", reservation);
            const reservationId = reservationResponse.data.id;
            // Step 2: Create billets for each passenger
            const billetPromises = passengers.map(async (passenger) => {
                const billetData = {
                    firstName: passenger.firstName,
                    lastName: passenger.lastName,
                    passport: passenger.passport,
                    category: passenger.category || "Adulte",
                    classType: passenger.class || "Economy",
                    prix: passenger.passengerPrice || 100,
                };

                try {
                    // Send billet data to the backend
                    const billetResponse = await axios.post("http://localhost:8080/billets", billetData, {
                        params: { reservationId }
                    });
                    console.log("Billet créé :", billetResponse.data);
                } catch (billetError) {
                    console.error("Erreur lors de la création du billet :", billetError);
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Il y a eu un problème lors de la création du billet pour un passager. Veuillez réessayer.",
                    });
                }
            });

            // Wait for all billet creations to finish
            await Promise.all(billetPromises);
            // After successful reservation creation, navigate to the payment page
            navigate(`/pay/${reservation.id}`, { state: { flight, passengers } });

        } catch (error) {
            console.error("Erreur lors de la création de la réservation:", error);
            if (error.response) {
                // Server responded with a status other than 2xx
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: error.response.data || "Il y a eu un problème lors de la réservation. Veuillez réessayer.",
                });
            } else {
                // No response from the server
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Erreur de communication avec le serveur.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Validation de la réservation
            </Typography>

            {/* Flight Details */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Flight Details
                        </Typography>
                        <Typography>
                            <strong>Flight ID:</strong> {flight.id}
                        </Typography>
                        <Typography>
                            <strong>Route:</strong> {flight.villeDepart || ''} → {flight.villeArrivee || ''}
                        </Typography>
                        <Typography>
                            <strong>Airline:</strong> {flight?.avion?.nom}
                        </Typography>
                        <Typography>
                            <strong>Departure:</strong> {flight?.dateDepart}
                        </Typography>
                        <Typography>
                            <strong>Arrival:</strong> {flight?.dateArrivee}
                        </Typography>
                        {/* <Typography>
                            <strong>Available Seats:</strong>
                        </Typography>
                        <Typography>Economy: {flight.ce_dispo}</Typography>
                        <Typography>Business: {flight.ca_dispo}</Typography>
                        <Typography>First Class: {flight.cp_dispo}</Typography> */}
                        <Typography variant="body1">
                            <strong>Classe : </strong>{selectedClass || "Standard"}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Passengers Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Détails des passagers
                        </Typography>
                        {passengers.map((passenger, index) => (
                            <Box
                                key={index}
                                sx={{
                                    padding: 2,
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    marginBottom: 2,
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <Typography variant="body1">
                                    Passager {index + 1} : {passenger.firstName} {passenger.lastName}
                                </Typography>
                                <Typography variant="body2">
                                    Numéro de passeport : {passenger.passport}
                                </Typography>
                                <Typography variant="body2">
                                    Catégorie : {passenger.category || "Economy"}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>

            {/* Total Price Section */}
            <Box sx={{ marginY: 3 }}>
                <Divider />
                <Typography variant="h6" align="center" sx={{ marginY: 2 }}>
                    Prix total : {totalPrice} €
                </Typography>
            </Box>

            {/* Action Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ paddingY: 1.5 }}
                onClick={handleValidation}
            >
                {loading ? "Validation en cours..." : "Valider la réservation"}
            </Button>
        </Box>
    );
};

export default Validation;
