import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const ReservationDialog = ({ open, onClose, reservation, updateReservations }) => {
  const [formData, setFormData] = useState({
    nbrBeneficier: "",
    vol: { id: "" },
    user: { id: "" },
    prixTotal: "",
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        nbrBeneficier: reservation.nbrBeneficier || "",
        vol: { id: reservation.vol?.id || "" },
        user: { id: reservation.user?.id || "" },
        prixTotal: reservation.prixTotal || "",
      });
    } else {
      setFormData({
        nbrBeneficier: "",
        vol: { id: "" },
        user: { id: "" },
        prixTotal: "",
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = reservation
      ? `http://localhost:8080/reservations/${reservation.id}`
      : "http://localhost:8080/reservations";
    const method = reservation ? "put" : "post";

    try {
      const response = await axios[method](url, formData);
      updateReservations(response.data);
      Swal.fire({
        title: "Success!",
        text: reservation
          ? "Reservation updated successfully!"
          : "Reservation added successfully!",
        icon: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving reservation", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving the reservation.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{reservation ? "Edit Reservation" : "Add Reservation"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre de Bénéficiaires"
            name="nbrBeneficier"
            value={formData.nbrBeneficier}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            label="Vol ID"
            name="vol.id"
            value={formData.vol.id}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="User ID"
            name="user.id"
            value={formData.user.id}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Prix Total"
            name="prixTotal"
            value={formData.prixTotal}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
        >
          {reservation ? "Save Changes" : "Add Reservation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;