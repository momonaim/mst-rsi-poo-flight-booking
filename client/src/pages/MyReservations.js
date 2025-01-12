import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import JsBarcode from 'jsbarcode';
import logoUrl from "../logo2.png";
import { useValue } from '../context/ContextProvider';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [barcodeImage, setBarcodeImage] = useState(null);
    const {
        state: { currentUser },
    } = useValue();



    const fetchReservations = useCallback(() => {
        if (!currentUser) return;

        setLoading(true);
        const userId = currentUser.id || 26;
        console.log(currentUser);
        console.log(userId);

        axios
            .get(`http://localhost:8080/reservations/user/${userId}`)
            .then((response) => {
                setReservations(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('There was an error fetching the reservations!', error);
                setLoading(false);
            });
    }, [currentUser]); // Dependencies: only re-create when `currentUser` changes

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const generateBarcode = (reservation) => {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, reservation.id, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
        });
        setBarcodeImage(canvas.toDataURL("image/png"));
    };

    const handleViewReservation = (reservation) => {
        setSelectedReservation(reservation);
        generateBarcode(reservation);
        setOpenDialog(true);
    };

    const cancelReservation = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Once canceled, you cannot recover this reservation!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8080/reservation/cancel/${id}`)
                    .then(response => {
                        fetchReservations();
                        Swal.fire(
                            'Canceled!',
                            'Your reservation has been canceled.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error("There was an error canceling the reservation!", error);
                        Swal.fire(
                            'Error!',
                            'There was an error canceling the reservation.',
                            'error'
                        );
                    });
            }
        });
    };

    // Print ticket function with passenger details
    const handlePrintInvoice = (reservation) => {
        const printWindow = window.open("", "", "width=800,height=600");
        let content = `
            <html>
            <head>
                <title>Reservation Ticket</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        text-align: center;
                    }
                    .ticket {
                        width: 500px;
                        padding: 20px;
                        margin: 20px auto;
                        border: 2px solid #ccc;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    .ticket-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .ticket-header img {
                        width: 100px;
                        height: auto;
                        margin-bottom: 10px;
                    }
                    .ticket-info {
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    .ticket-info p {
                        margin: 5px 0;
                    }
                    .ticket-info strong {
                        color: #333;
                    }
                    .barcode {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .ticket-footer {
                        font-size: 12px;
                        color: #555;
                        margin-top: 20px;
                    }
                    .passenger-list {
                        margin-top: 20px;
                        text-align: left;
                    }
                    .passenger-list p {
                        margin: 3px 0;
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="ticket-header">
                        <img src="${logoUrl}" alt="Company Logo" />
                        <h1>Reservation #${reservation.id}</h1>
                    </div>
                    <div class="ticket-info">
                    <p><strong>Flight:</strong> ${reservation?.vol?.villeDepart || 'N/A'} → ${reservation?.vol?.villeArrivee || 'N/A'}</p>
                    <p><strong>Departure:</strong> ${reservation?.vol?.dateDepart || 'N/A'}</p>
                    <p><strong>Arrival:</strong> ${reservation?.vol?.dateArrivee || 'N/A'}</p>
                    <p><strong>Price:</strong> ${reservation?.prixTotal || 'N/A'} €</p>
                    </div>
                    <div class="barcode">
                        <img src="${barcodeImage}" alt="Barcode" />
                    </div>
                    <div class="passenger-list">
                        <h3>Passenger Details:</h3>
                        ${reservation.billet.map((passenger, index) => `
                            <p><strong>Passenger ${index + 1}:</strong> ${passenger.firstName} ${passenger.lastName}</p>
                        `).join('')}
                    </div>
                    <div class="ticket-footer">
                        <p>Thank you for booking with us!</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    const handlePrintTicket = (passenger, reservation) => {
        const printWindow = window.open("", "", "width=800,height=600");

        let content = `
            <html>
                <head>
                    <title>Billet de Réservation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f5f5f5;
                            text-align: center;
                        }
                        .ticket {
                            width: 500px;
                            padding: 20px;
                            margin: 20px auto;
                            border: 2px solid #ccc;
                            border-radius: 10px;
                            background-color: #fff;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        }
                        .ticket-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .ticket-header img {
                            width: 100px;
                            height: auto;
                            margin-bottom: 10px;
                        }
                        .ticket-header h1 {
                            font-size: 24px;
                            margin: 0;
                        }
                        .ticket-info {
                            margin-bottom: 20px;
                            font-size: 14px;
                        }
                        .ticket-info p {
                            margin: 5px 0;
                        }
                        .ticket-info strong {
                            color: #333;
                        }
                        .barcode {
                            text-align: center;
                            margin: 20px 0;
                        }
                        .ticket-footer {
                            font-size: 12px;
                            color: #555;
                            margin-top: 20px;
                        }
                        .ticket-footer p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <h1>Billet de Réservation</h1>
            `;

        content += `
            <div class="ticket">
                <div class="ticket-header">
                    <img src="${logoUrl}" alt="Company Logo" />
                    <h1>Réservation #${reservation.id}</h1>
                </div>
                <div class="ticket-info">
                    <p><strong>Montant payé :</strong> ${reservation.prixTotal} €</p>
                    <p><strong>Vol :</strong> ${reservation.vol.trajet.villeDepart} → ${reservation.vol.trajet.villeArrivee}</p>
                    <p><strong>Date de départ :</strong> ${reservation.vol.dateDepart}</p>
                    <p><strong>Date d'arrivée :</strong> ${reservation.vol.dateArrivee}</p>
                </div>
                <div class="barcode">
                    <img src="${barcodeImage}" alt="Barcode" />
                </div>
            `;

        content += `
            <div class="ticket-info">
                <h3>Passager : ${passenger.firstName} ${passenger.lastName}</h3>
                <p><strong>Catégorie :</strong> ${passenger.category}</p>
                <p><strong>Classe :</strong> ${passenger.class}</p>
                <p><strong>Numéro de passeport :</strong> ${passenger.passport}</p>
            </div>
            `;

        content += `
                <div class="ticket-footer">
                    <p>Merci pour votre réservation avec notre compagnie !</p>
                </div>
            </div>
            </body>
            </html>
            `;

        // const reservationDate = new Date(reservation.vol.dateDepart);
        // const formattedDate = reservationDate.toISOString().split("T")[0];
        // const fileName = `billet_${passenger.firstName}_${passenger.lastName}_${formattedDate}.pdf`;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
                My Reservations
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <CircularProgress size={60} color="secondary" />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Reservation ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Flight</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Departure</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Arrival</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((reservation) => (
                                <TableRow key={reservation.id} hover>
                                    <TableCell>{reservation?.id || 'N/A'}</TableCell>
                                    <TableCell>{reservation?.vol?.villeDepart || 'N/A'} → {reservation?.vol?.villeArrivee || 'N/A'}</TableCell>
                                    <TableCell>{reservation?.vol?.dateDepart || 'N/A'}</TableCell>
                                    <TableCell>{reservation?.vol?.dateArrivee || 'N/A'}</TableCell>
                                    <TableCell>{reservation?.prixTotal || 'N/A'} €</TableCell>
                                    <TableCell>
                                        {!reservation.canceled ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ marginRight: 2 }}
                                                    onClick={() => handleViewReservation(reservation)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => cancelReservation(reservation.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Typography color="textSecondary">Canceled</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog for View Reservation */}
            <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Reservation Details</DialogTitle>
                <DialogContent>
                    {selectedReservation && (
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h6">Reservation ID: {selectedReservation?.id || 'N/A'}</Typography>
                            <Typography>Flight: {selectedReservation?.vol?.villeDepart || 'N/A'} → {selectedReservation?.vol?.villeArrivee || 'N/A'}</Typography>
                            <Typography>Departure: {selectedReservation?.vol?.dateDepart || 'N/A'}</Typography>
                            <Typography>Arrival: {selectedReservation?.vol?.dateArrivee || 'N/A'}</Typography>
                            <Typography>Price: {selectedReservation?.prixTotal || 'N/A'} €</Typography>
                            {selectedReservation.billet && (
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        Passengers:
                                    </Typography>
                                    <Table sx={{ boxShadow: 3, width: '100%' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Passenger</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedReservation.billet.map((passenger, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {passenger.firstName} {passenger.lastName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handlePrintTicket(passenger, selectedReservation)}
                                                            aria-label={`Print ticket for ${passenger.firstName} ${passenger.lastName}`}
                                                            title="Print ticket"
                                                        >
                                                            <AirplaneTicketIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            )}

                            {barcodeImage && (
                                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                                    <img src={barcodeImage} alt="Barcode" />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                    </Button>
                    <Button variant='contained' onClick={() => handlePrintInvoice(selectedReservation)} color="secondary">
                        Print Invoice
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyReservations;
