import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
    useMediaQuery,
    Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import PassengerDialog from "./PassengerDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ onFlightSelect }) => {
    const navigate = useNavigate();
    const categories = [
        { label: "Adulte", reduction: 0 },
        { label: "Jeune (12-17 ans)", reduction: 0.1 },
        { label: "Enfant (2-11 ans)", reduction: 0.2 },
        { label: "Bébé (moins de 2 ans)", reduction: 0.5 },
    ];
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [date, setDate] = useState("");
    const [passengerSummary, setPassengerSummary] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [cities, setCities] = useState([]);
    const [classes, setClasses] = useState([]);

    const mockCities = [
        { id: 1, nom: "CASA" },
        { id: 2, nom: "PARIS" },
        { id: 3, nom: "New York" },
        { id: 4, nom: "Tokyo" },
        { id: 5, nom: "Berlin" },
        { id: 6, nom: "RABAT" },
        { id: 7, nom: "MADRID" },
    ];

    const mockClasses = ["Économique", "Affaire", "Première"];

    // Fetch cities and classes from the backend or use mock data in case of error
    useEffect(() => {
        const fetchCitiesAndClasses = async () => {
            try {
                const cityResponse = await axios.get("http://localhost:8080/villes");
                setCities(cityResponse.data);
            } catch (error) {
                console.error("Error fetching cities:", error);
                setCities(mockCities);  // Set mock data in case of error

            }

            try {
                const classResponse = await axios.get("http://localhost:8080/classes");
                setClasses(classResponse.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
                setClasses(mockClasses);  // Set mock data in case of error

            }
        };

        fetchCitiesAndClasses();
    }, []);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSearch = async () => {
        if (!departure || !selectedClass || !arrival || !date || !passengerSummary.length) {
            Swal.fire({
                icon: "warning",
                title: "Champ(s) manquant(s)",
                text: "Veuillez remplir tous les champs avant de lancer la recherche.",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/find", {
                params: {
                    dateDepart: date,
                    villeDepart: departure,
                    villeArrivee: arrival,
                },
            });
            // const response = await axios.get("http://localhost:8080/vols/search", {
            //     params: {
            //         dateDepart: date,
            //         villeDepart: departure,
            //         villeArrivee: arrival,
            //     },
            // });
            console.log(response)
            if (response.data.length === 0) {
                Swal.fire({
                    icon: "info",
                    title: "Aucun vol trouvé",
                    text: "Désolé, aucun vol ne correspond à votre recherche.",
                    confirmButtonText: "OK",
                });
            } else {

                navigate("/flights", {
                    state: { flights: response.data, passengerSummary: passengerSummary, searchDetails: { departure, arrival, date, selectedClass } },
                });
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Impossible de récupérer les vols disponibles.",
                confirmButtonText: "OK",
            });
        }
    };


    return (
        <Box p={isMobile ? 2 : 3}>
            {/* <h1 style={{ fontSize: isMobile ? "1.5rem" : "2rem", textAlign: "center" }}>Rechercher un vol</h1> */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Ville de départ</InputLabel>
                        <Select
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                            label="Ville de départ"
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.nom} value={city.nom}>
                                    {city.nom}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Ville d'arrivée</InputLabel>
                        <Select
                            value={arrival}
                            onChange={(e) => setArrival(e.target.value)}
                            label="Ville d'arrivée"
                        >
                            {cities
                                .filter((city) => city !== departure)
                                .map((city) => (
                                    <MenuItem key={city.nom} value={city.nom}>
                                        <b>{city.nom}</b>
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Date de départ"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Passagers"
                        value={passengerSummary.length ? `${passengerSummary.length} passagers` : ""}
                        onClick={handleOpenDialog}
                        fullWidth
                        margin="dense"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Classe de passager</InputLabel>
                        <Select
                            value={selectedClass ? selectedClass.name : ""}
                            onChange={(e) => {
                                const selected = classes.find(
                                    (classOption) => classOption.name === e.target.value
                                );
                                setSelectedClass(selected);
                            }}
                            label="Classe de passager"
                        >
                            {classes.map((classOption) => (
                                <MenuItem key={classOption.name} value={classOption.name}>
                                    {classOption.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
                size={isMobile ? "medium" : "large"}
                sx={{
                    fontSize: isMobile ? "0.875rem" : "1rem",
                }}
            >
                Rechercher
            </Button>
            <PassengerDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onPassengerUpdate={(summary) => setPassengerSummary(summary)}
                categories={categories}
            />
        </Box>
    );
};

export default LandingPage;
