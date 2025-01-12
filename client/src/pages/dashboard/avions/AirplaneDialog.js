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

const AirplaneDialog = ({ open, onClose, airplane, updateAirplanes }) => {
    const [formData, setFormData] = useState({
        nom: "",
        vitesse: "",
        autonomie: "",
        capacite_CA: "",
        capacite_CE: "",
        capacite_CP: "",
    });

    useEffect(() => {
        if (airplane) {
            setFormData({
                nom: airplane.nom || "",
                vitesse: airplane.vitesse || "",
                autonomie: airplane.autonomie || "",
                capacite_CA: airplane.capacite_CA || "",
                capacite_CE: airplane.capacite_CE || "",
                capacite_CP: airplane.capacite_CP || "",
            });
        } else {
            setFormData({
                nom: "",
                vitesse: "",
                autonomie: "",
                capacite_CA: "",
                capacite_CE: "",
                capacite_CP: "",
            });
        }
    }, [airplane]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const url = airplane
            ? `http://localhost:8080/avion/${airplane.id}`
            : "http://localhost:8080/avion";
        const method = airplane ? "put" : "post";

        try {
            const response = await axios[method](url, formData);
            updateAirplanes(response.data);
            Swal.fire({
                title: "Success!",
                text: airplane
                    ? "Airplane updated successfully!"
                    : "Airplane added successfully!",
                icon: "success",
            });
            onClose();
        } catch (error) {
            console.error("Error saving airplane", error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while saving the airplane.",
                icon: "error",
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{airplane ? "Edit Airplane" : "Add Airplane"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Airplane Name"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Speed (km/h)"
                        name="vitesse"
                        value={formData.vitesse}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Autonomy (km)"
                        name="autonomie"
                        value={formData.autonomie}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Capacity (First Class)"
                        name="capacite_CA"
                        value={formData.capacite_CA}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Capacity (Economy)"
                        name="capacite_CE"
                        value={formData.capacite_CE}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Capacity (Premium)"
                        name="capacite_CP"
                        value={formData.capacite_CP}
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
                    {airplane ? "Save Changes" : "Add Airplane"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AirplaneDialog;
