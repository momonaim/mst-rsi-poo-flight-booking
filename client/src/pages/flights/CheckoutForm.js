import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Grid,
} from "@mui/material";
import { useValue } from "../../context/ContextProvider";
import Swal from "sweetalert2";

const CheckoutForm = () => {
    const {
        state: { currentUser },
        dispatch,
    } = useValue();
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { flight, passengers } = location.state || {};

    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState("");
    const [reservation, setReservation] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [disablePayment, setDisablePayment] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/reservation/${reservationId}`) // Adjusted URL without /api
            .then((response) => {
                if (response.data && response.data.statut) {
                    setMessage("Réservation déjà payée");
                    setDisablePayment(true);
                }
                setReservation(response.data);
                console.log('reservation: ', response.data);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des informations de la réservation :",
                    error.response ? error.response.data : error.message
                );
            });


    }, [currentUser, dispatch, reservationId]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe has not loaded yet.");
            return;
        }
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
        } else {
            setIsProcessing(true);

            try {
                const { data } = await axios.post(
                    "http://localhost:8080/api/payment/create-payment-intent",
                    {
                        reservationId,
                    }
                );

                const clientSecret = data.clientSecret;

                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    clientSecret,
                    {
                        payment_method: {
                            card: elements.getElement(CardElement),
                        },
                    }
                );

                if (error) {
                    console.error("Payment failed:", error.message);
                    setMessage(`Payment failed: ${error.message}`);
                } else if (paymentIntent.status === "succeeded") {
                    await axios.post(
                        "http://localhost:8080/api/payment/confirm-payment",
                        {
                            reservationId,
                            paymentIntentId: paymentIntent.id,
                        }
                    );
                    console.log("Payment successful:", paymentIntent);
                    setMessage("Payment successful!");
                    Swal.fire({
                        icon: "success",
                        title: "Paiement réussi",
                        text: "Votre paiement a été effectué avec succès.",
                        confirmButtonText: "OK",
                    }).then(() => {
                        // navigate(`/thankyou`, { state: { reservation } });
                        navigate(`/thankyou`, { state: { reservation, flight, passengers } });

                    });;
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage("An error occurred during payment.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 3,
                width: "100%",
                maxWidth: 600,
                margin: "2rem auto",
                borderRadius: 2,
                boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                sx={{ marginBottom: 3 }}
            >
                Paiement
            </Typography>
            {/* Montant total à payer */}
            {reservation && (
                <Box
                    sx={{
                        marginBottom: 3,
                        padding: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                    }}
                >
                    <Typography variant="h6" align="center">
                        Montant total à payer :
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                        {reservation.prixTotal.toLocaleString()} €
                    </Typography>
                </Box>
            )}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                padding: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <CardElement />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!stripe || isProcessing || disablePayment}
                            fullWidth
                            sx={{
                                padding: "0.75rem",
                                textTransform: "none", // Keep the button text readable
                            }}
                        >
                            {isProcessing ? <CircularProgress size={24} /> : "Payer"}
                        </Button>
                    </Grid>
                    {message && (
                        <Grid item xs={12}>
                            <Typography
                                variant="body2"
                                color={disablePayment ? "primary" : "error"}
                                align="center"
                                sx={{ marginTop: 2 }}
                            >
                                {message}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Paper>
    );
};

export default CheckoutForm;
