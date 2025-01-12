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

const ClasseDialog = ({ open, onClose, classe, updateClasses }) => {
  const [formData, setFormData] = useState({
    name: "",
    prixKm: "",
    capaciteMax: "",
    description: "",
  });

  useEffect(() => {
    if (classe) {
      setFormData({
        name: classe.name || "",
        prixKm: classe.prixKm || "",
        capaciteMax: classe.capaciteMax || "",
        description: classe.description || "",
      });
    } else {
      setFormData({
        name: "",
        prixKm: "",
        capaciteMax: "",
        description: "",
      });
    }
  }, [classe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = classe
      ? `http://localhost:8080/classes/${classe.id}`
      : "http://localhost:8080/classes";
    const method = classe ? "put" : "post";

    try {
      const response = await axios[method](url, formData);
      updateClasses(response.data);
      Swal.fire({
        title: "Success!",
        text: classe
          ? "Class updated successfully!"
          : "Class added successfully!",
        icon: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving class", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving the class.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{classe ? "Edit Class" : "Add Class"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Price per Km (€)"
            name="prixKm"
            value={formData.prixKm}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            label="Max Capacity"
            name="capaciteMax"
            value={formData.capaciteMax}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
          {classe ? "Save Changes" : "Add Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClasseDialog;
