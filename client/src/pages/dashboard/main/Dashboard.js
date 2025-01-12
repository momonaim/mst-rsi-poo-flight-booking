import React, { useState } from 'react';
import { Box, CircularProgress, Paper, Typography, Grid, Button, Card, CardContent, Divider } from '@mui/material';
import { mockFlights, mockClients, mockTicketCategories } from './mockData';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const Dashboard = () => {
    const [flights, setFlights] = useState(mockFlights);
    const [clients, setClients] = useState(mockClients);
    const [ticketCategories, setTicketCategories] = useState(mockTicketCategories);
    const [occupancyThreshold, setOccupancyThreshold] = useState(0.6); // Seuil d'occupation pour filtrer les vols
    const [filteredFlights, setFilteredFlights] = useState(flights);
    const [filteredClients, setFilteredClients] = useState(clients);
    const [selectedCategory, setSelectedCategory] = useState(null); // Pour filtrer par catégorie tarifaire

    // Filtrer les vols en fonction du taux d'occupation
    const handleFilterFlightsByOccupancy = () => {
        const filtered = flights.filter((flight) => flight.occupancyRate < occupancyThreshold);
        setFilteredFlights(filtered);
    };

    // Obtenir les statistiques des clients par département
    const getClientStatsByDepartment = (department) => {
        const filtered = clients.filter((client) => client.department === department);
        setFilteredClients(filtered);
    };

    // Filtrer les catégories tarifaires
    const handleFilterByCategory = (categoryName) => {
        const filtered = ticketCategories.filter((category) => category.name === categoryName);
        setSelectedCategory(filtered);
    };

    // Données pour les graphiques
    const barData = {
        labels: filteredFlights.map((flight) => `Flight ${flight.flightId}`),
        datasets: [
            {
                label: 'Occupancy Rate',
                data: filteredFlights.map((flight) => flight.occupancyRate * 100),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const doughnutData = {
        labels: ticketCategories.map((category) => category.name),
        datasets: [
            {
                data: ticketCategories.map((category) => category.price),
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#FF9F40'],
            },
        ],
    };

    return (
        <Box sx={{ width: '100%', mt: 3, padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Flight Occupancy and Client Statistics
            </Typography>

            <Grid container spacing={3}>
                {/* Filtrer les vols par taux d'occupation */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Filter Flights by Occupancy
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFilterFlightsByOccupancy}
                            sx={{ marginBottom: 2 }}
                        >
                            Show Flights with Low Occupancy
                        </Button>
                        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                            Threshold: {occupancyThreshold * 100}% occupancy
                        </Typography>
                        <Bar data={barData} />
                    </Paper>
                </Grid>

                {/* Graphique des catégories tarifaires */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Ticket Categories
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleFilterByCategory('Economy')}
                                    sx={{ marginRight: 1 }}
                                >
                                    Economy
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleFilterByCategory('Business')}
                                    sx={{ marginRight: 1 }}
                                >
                                    Business
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleFilterByCategory('First Class')}
                                    sx={{ marginRight: 1 }}
                                >
                                    First Class
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle1" sx={{ marginTop: 2, marginBottom: 2 }}>
                            {selectedCategory ? `Selected Category: ${selectedCategory[0]?.name}` : 'No category selected'}
                        </Typography>
                        <Doughnut data={doughnutData} />
                    </Paper>
                </Grid>

                {/* Clients par département */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Clients by Department
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => getClientStatsByDepartment('Finance')}
                            sx={{ marginBottom: 2 }}
                        >
                            Show Finance Department Clients
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => getClientStatsByDepartment('Marketing')}
                            sx={{ marginBottom: 2 }}
                        >
                            Show Marketing Department Clients
                        </Button>
                        <Typography variant="subtitle1">
                            Clients: {filteredClients.length}
                        </Typography>
                        <ul>
                            {filteredClients.map((client) => (
                                <Card key={client.clientId} sx={{ marginBottom: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1">{client.name}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </ul>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
