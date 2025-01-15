import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const TrajetDialog = ({ open, onClose, trajet, updateTrajets }) => {
    const [formData, setFormData] = useState({
        distance: "",
        duree: "",
        villeDepart: "",
        villeArrivee: "",
    });

    const [villes, setVilles] = useState([]); // Liste des villes

    useEffect(() => {
        // Charger les villes au moment de l'ouverture
        if (open) {
            axios
                .get("http://localhost:8080/villes")
                .then((response) => {
                    setVilles(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors du chargement des villes", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to load cities.",
                        icon: "error",
                    });
                });
        }
    }, [open]);

    useEffect(() => {
        if (trajet) {
            setFormData({
                distance: trajet.distance || "",
                duree: trajet.duree || "",
                villeDepart: trajet.villeDepart || "",
                villeArrivee: trajet.villeArrivee || "",
            });
        } else {
            setFormData({
                distance: "",
                duree: "",
                villeDepart: "",
                villeArrivee: "",
            });
        }
    }, [trajet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const url = trajet
            ? `http://localhost:8080/trajet/${trajet.id_trajet}`
            : "http://localhost:8080/trajet";
        const method = trajet ? "put" : "post";

        try {
            const response = await axios[method](url, formData);
            updateTrajets(response.data);
            Swal.fire({
                title: "Success!",
                text: trajet
                    ? "Trajet updated successfully!"
                    : "Trajet added successfully!",
                icon: "success",
            });
            onClose();
        } catch (error) {
            onClose();
            console.error("Error saving trajet", error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while saving the trajet.",
                icon: "error",
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{trajet ? "Edit Trajet" : "Add Trajet"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    {/* <TextField
                        label="Distance (km)"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Duration (hours)"
                        name="duree"
                        value={formData.duree}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    /> */}
                    <TextField
                        select
                        label="Departure City"
                        name="villeDepart"
                        value={formData.villeDepart}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {villes.map((ville) => (
                            <MenuItem key={ville.id} value={ville.nom}>
                                {ville.nom}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Arrival City"
                        name="villeArrivee"
                        value={formData.villeArrivee}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {villes.map((ville) => (
                            <MenuItem key={ville.id} value={ville.nom}>
                                {ville.nom}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    {trajet ? "Save Changes" : "Add Trajet"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrajetDialog;
