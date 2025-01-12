import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper, Typography, Box, Button, TextField, Grid } from "@mui/material";
import SelectActionCard from "./cardiat";
import MyDoughnutChart from "./dowanat";
import ChartCard from "./ChartCard";

const Main = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tauxOccupation, setTauxOccupation] = useState([]);

    const handleDateChange = (e) => {
        if (e.target.name === "startDate") {
            setStartDate(e.target.value);
        } else if (e.target.name === "endDate") {
            setEndDate(e.target.value);
        }
    };

    const fetchTauxOccupation = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/taux-occupation?dateDebut=${startDate}&dateFin=${endDate}`
            );
            const data = await response.json();
            setTauxOccupation(data);
            console.log("Taux d'occupation récupérés:", data);
        } catch (error) {
            console.error("Erreur lors de la récupération des taux d'occupation:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchTauxOccupation();
    };

    const filteredTaux = tauxOccupation.filter(
        (taux) => taux.tauxCA > 0 || taux.tauxCE > 0 || taux.tauxCP > 0
    );

    return (
        <Box p={2}>
            {/* SelectActionCard */}
            <Box mb={4}>
                <SelectActionCard />
            </Box>

            {/* Date Inputs */}
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <TextField
                    type="date"
                    label="Début"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    label="Fin"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                >
                    Soumettre
                </Button>
            </Paper>

            {/* Chart Grid */}
            <Grid container spacing={4}>
                {/* Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Typography variant="h6" gutterBottom>
                            Taux d'occupation
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <BarChart
                                xAxis={[{ scaleType: "band", data: filteredTaux.map((taux) => taux.nomAvion) }]}
                                series={[
                                    { data: filteredTaux.map((taux) => (taux.tauxCA > 0 ? taux.tauxCA : 0)), label: "CA" },
                                    { data: filteredTaux.map((taux) => (taux.tauxCE > 0 ? taux.tauxCE : 0)), label: "CE" },
                                    { data: filteredTaux.map((taux) => (taux.tauxCP > 0 ? taux.tauxCP : 0)), label: "CP" },
                                ]}
                                width={450}
                                height={300}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Doughnut Chart */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Typography variant="h6" gutterBottom>
                            Statistiques par année
                        </Typography>
                        <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <MyDoughnutChart />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Typography variant="h6" gutterBottom>
                            Reservation Status
                        </Typography>
                        <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ChartCard chartType="doughnut" />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Typography variant="h6" gutterBottom>
                            Class Bookings
                        </Typography>
                        <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ChartCard chartType="bar" startDate={startDate} endDate={endDate} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Main;
