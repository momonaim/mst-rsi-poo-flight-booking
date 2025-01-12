import React, { useEffect, useState } from 'react';
import MUIDataTable, { } from "mui-datatables";
import { Box, Typography, Button, DialogActions, CircularProgress, Dialog, DialogContent } from "@mui/material";
import Swal from 'sweetalert2';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import { DialogTitle } from '@mui/material';

const Reservation = ({ setSelectedLink, link }) => {
  const [reservations, setReservations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [barcodeImage, setBarcodeImage] = useState(null);

  useEffect(() => {
    setSelectedLink(link);
    fetchReservations();
  }, [link, setSelectedLink]);

  const fetchReservations = () => {
    setLoading(true);
    axios.get("http://localhost:8080/reservations")
      .then((response) => {
        setReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations", error);
        setLoading(false);
      });
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
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8080/reservation/cancel/${id}`)
          .then(() => {
            fetchReservations();
            Swal.fire('Canceled!', 'Your reservation has been canceled.', 'success');
          })
          .catch((error) => {
            console.error("Error canceling reservation", error);
            Swal.fire('Error!', 'Failed to cancel the reservation.', 'error');
          });
      }
    });
  };

  const redoReservation = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will reactivate the reservation!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, redo it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8080/reservation/redo/${id}`)
          .then(() => {
            fetchReservations();
            Swal.fire('Redone!', 'The reservation has been reactivated.', 'success');
          })
          .catch((error) => {
            console.error("Error redoing reservation", error);
            Swal.fire('Error!', 'Failed to reactivate the reservation.', 'error');
          });
      }
    });
  };

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

  const columns = [
    {
      name: "id",
      label: "Reservation ID",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "vol",
      label: "Flight",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) =>
          `${value?.villeDepart || "N/A"} → ${value?.villeArrivee || "N/A"}`,
      },
    },
    {
      name: "vol",
      label: "Departure",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => `${value?.dateDepart || "N/A"}`,
      },
    },
    {
      name: "vol",
      label: "Arrival",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => `${value?.dateArrivee || "N/A"}`,
      },
    },
    {
      name: "prixTotal",
      label: "Price (€)",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => `${value || "N/A"} €`,
      },
    },
    {
      name: "statut",
      label: "Payment Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          value ? (
            <Typography color="success.main">Paid</Typography>
          ) : (
            <Typography color="error.main">Not Paid</Typography>
          ),
      },
    },
    {
      name: "canceled",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const reservation = reservations[rowIndex];
          return (
            <Box>

              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 2 }}
                onClick={() => handleViewReservation(reservation)}
              >
                View
              </Button>
              {!value ? (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => cancelReservation(reservation.id)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => redoReservation(reservation.id)}
                >
                  Redo
                </Button>
              )}
            </Box>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    responsive: "standard",
    download: true,
    print: true,
    filter: true,
    search: true,
    viewColumns: true,
    pagination: true,
    textLabels: {
      body: {
        noMatch: loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "50px" }}>
            <CircularProgress size={60} color="secondary" />
          </Box>
        ) : (
          "No Reservations Found"
        ),
      },
    },
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: 'center', mb: 3 }}
      >
        Manage Reservations
      </Typography>

      <MUIDataTable
        title="Reservations"
        data={reservations}
        columns={columns}
        options={options}
      />

      {/* Dialog for View Reservation */}
      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reservation Details</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6">
                Reservation ID: {selectedReservation?.id || "N/A"}
              </Typography>
              <Typography>
                Flight:{" "}
                {selectedReservation?.vol?.villeDepart || "N/A"} →{" "}
                {selectedReservation?.vol?.villeArrivee || "N/A"}
              </Typography>
              <Typography>
                Departure: {selectedReservation?.vol?.dateDepart || "N/A"}
              </Typography>
              <Typography>
                Arrival: {selectedReservation?.vol?.dateArrivee || "N/A"}
              </Typography>
              <Typography>
                Price: {selectedReservation?.prixTotal || "N/A"} €
              </Typography>
              {barcodeImage && (
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reservation;
