import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import logoUrl from "../../logo2.png";

const ThankYou = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservation } = location.state || {};

    const [barcodeImage, setBarcodeImage] = useState(null);

    // Générer le barcode

    useEffect(() => {
        const generateBarcode = () => {
            const canvas = document.createElement("canvas");
            if (reservation) {
                JsBarcode(canvas, reservation.id, {
                    format: "CODE128",
                    width: 2,
                    height: 40,
                    displayValue: true,
                });
                setBarcodeImage(canvas.toDataURL("image/png"));
            }
        };
        generateBarcode();
        console.log("res", reservation);
    }, [reservation]);

    const handleGenerateFacture = () => {
        if (!reservation) return;

        const doc = new jsPDF();
        const reservationDate = reservation.vol.dateDepart;
        const formattedDate = new Date(reservationDate).toISOString().split("T")[0];
        const fileName = `facture_reservation_${reservation.id}_${formattedDate}.pdf`;

        // Ajouter le logo
        if (logoUrl) {
            doc.addImage(logoUrl, "PNG", 85, 10, 40, 20);
        }

        // Ajouter un titre
        doc.setFontSize(20);
        doc.text("Facture et Billet", 105, 40, null, null, "center");

        // Ajouter des informations de réservation
        doc.setFontSize(12);
        let yPosition = 50;
        const lineSpacing = 10;

        doc.text(`Numéro de réservation : ${reservation.id}`, 20, (yPosition += lineSpacing));
        doc.text(`Nom du client : ${reservation.user.firstname} ${reservation.user.lastname}`, 20, (yPosition += lineSpacing));
        doc.text(`Téléphone : ${reservation.user.phone}`, 20, (yPosition += lineSpacing));
        doc.text(`Montant payé : ${reservation.prixTotal} €`, 20, (yPosition += lineSpacing));
        doc.text(`Vol : ${reservation.vol.trajet.villeDepart} --> ${reservation.vol.trajet.villeArrivee}`, 20, (yPosition += lineSpacing));
        doc.text(`Date de départ : ${reservation.vol.dateDepart}`, 20, (yPosition += lineSpacing));
        doc.text(`Date d'arrivée : ${reservation.vol.dateArrivee}`, 20, (yPosition += lineSpacing));

        // Ajouter le barcode
        if (barcodeImage) {
            yPosition += 10;
            doc.addImage(barcodeImage, "PNG", 20, yPosition, 100, 30);
            yPosition += 40;
        }

        // Ajouter des informations des passagers
        if (reservation.billet && reservation.billet.length > 0) {
            reservation.billet.forEach((passenger, index) => {
                doc.text(`Passager ${index + 1} : ${passenger.firstName} ${passenger.lastName}`, 20, (yPosition += lineSpacing));
                doc.text(`Catégorie : ${passenger.category}`, 20, (yPosition += lineSpacing));
                doc.text(`Classe : ${passenger.classType}`, 20, (yPosition += lineSpacing));
                doc.text(`Numéro de passeport : ${passenger.passport}`, 20, (yPosition += lineSpacing));
            });
        }

        // Ajouter un pied de page
        doc.setFontSize(10);
        doc.text("Merci pour votre réservation avec notre compagnie !", 105, 280, null, null, "center");

        // Télécharger le PDF
        doc.save(fileName);
    };

    // Print ticket function for a specific passenger
    const handlePrintTicket = (passenger) => {
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
            <p><strong>Classe :</strong> ${passenger.classType}</p>
            <p><strong>Numéro de passeport :</strong> ${passenger.passport}</p>
            <p><strong>Prix :</strong> ${passenger.prix} €</p>
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                minHeight: "100vh",
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
                Merci pour votre réservation !
            </Typography>

            {reservation && (
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        width: "100%",
                        maxWidth: 600,
                        marginBottom: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Détails de la réservation
                    </Typography>
                    <Typography>
                        <strong>Numéro de réservation :</strong> {reservation.id}
                    </Typography>
                    <Typography>
                        <strong>Montant payé :</strong> {reservation.prixTotal.toLocaleString()} €
                    </Typography>
                    <Typography>
                        <strong>Status :</strong> Confirmé
                    </Typography>

                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 2,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Billet électronique
                        </Typography>
                        <img
                            src={logoUrl}
                            alt="Company Logo"
                            style={{
                                display: "block",
                                margin: "0 auto 10px auto",
                                width: "100px",
                                height: "auto",
                            }}
                        />
                        <Typography>
                            <strong>Vol :</strong> {reservation.vol.villeDepart} →{" "}
                            {reservation.vol.villeArrivee}
                        </Typography>
                        <Typography>
                            <strong>Date de départ :</strong> {reservation.vol.dateDepart}
                        </Typography>
                        <Typography>
                            <strong>Date d'arrivée :</strong> {reservation.vol.dateArrivee}
                        </Typography>

                        {barcodeImage && (
                            <img
                                src={barcodeImage}
                                alt="Barcode"
                                style={{ display: "block", margin: "20px auto" }}
                            />
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ marginTop: 3 }}
                        onClick={handleGenerateFacture}
                    >
                        Télécharger la facture
                    </Button>

                    {/* Create a button for each passenger */}
                    {reservation.billet &&
                        reservation.billet.map((passenger, index) => (
                            <Button
                                key={index}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                onClick={() => handlePrintTicket(passenger)}
                            >
                                Télécharger Billet Passager {index + 1}
                            </Button>
                        ))}
                </Paper>
            )}

            <Button
                variant="outlined"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={() => navigate("/")}
            >
                Retour à l'accueil
            </Button>
        </Box>
    );
};

export default ThankYou;
