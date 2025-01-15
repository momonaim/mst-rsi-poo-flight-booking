import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import axios from 'axios';
import TrajetDialog from "./TrajetDialog";
import TrajetViewDialog from './TrajetViewDialog';

const Trajet = ({ setSelectedLink, link }) => {
    const [trajets, setTrajets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTrajet, setCurrentTrajet] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);

    const handleViewOpen = (trajet) => {
        setCurrentTrajet(trajet);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setCurrentTrajet(null);
    };

    useEffect(() => {
        setSelectedLink(link);
        axios.get("http://localhost:8080/trajets")
            .then(response => {
                setTrajets(response.data);
            })
            .catch(error => {
                console.error("Error fetching trajets", error);
            });
    }, [link, setSelectedLink]);

    const handleDialogOpen = (trajet) => {
        setCurrentTrajet(trajet);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentTrajet(null);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/trajet/${id}`);
                    setTrajets(trajets.filter(trajet => trajet.id_trajet !== id));
                    Swal.fire("Deleted!", "The trajet has been deleted.", "success");
                } catch (error) {
                    console.error("Error deleting trajet", error);
                    Swal.fire("Error!", "Failed to delete the trajet.", "error");
                }
            }
        });
    };

    const updateTrajets = (newTrajet) => {
        setTrajets((prevTrajets) => {
            const index = prevTrajets.findIndex(trajet => trajet.id_trajet === newTrajet.id_trajet);
            if (index !== -1) {
                const updatedTrajets = [...prevTrajets];
                updatedTrajets[index] = newTrajet;
                return updatedTrajets;
            }
            return [...prevTrajets, newTrajet];
        });
    };

    const columns = [
        { name: 'id_trajet', label: 'ID' },
        { name: 'distance', label: 'Distance (km)' },
        { name: 'duree', label: 'Duration (min)' },
        { name: 'villeDepart', label: 'Departure City' },
        { name: 'villeArrivee', label: 'Arrival City' },
        {
            name: "actions",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex;
                    const trajet = trajets[rowIndex];
                    return (
                        <Box>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleDialogOpen(trajet)}
                                sx={{ mr: 1 }}
                            >
                                <ModeEdit />
                            </IconButton>
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(trajet.id_trajet)}
                                sx={{ mr: 1 }}
                            >
                                <GridDeleteIcon />
                            </IconButton>
                            <IconButton
                                color="default"
                                size="small"
                                onClick={() => handleViewOpen(trajet)}
                            >
                                <Visibility />
                            </IconButton>
                        </Box>
                    );
                },
                filter: false,
                sort: false,
            },
        }
    ];

    const options = {
        filterType: 'dropdown',
        selectableRows: 'none',
        responsive: 'standard',
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
        download: true,
        print: false,
        search: true
    };

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Typography
                variant="h4"
                component="h4"
                sx={{ textAlign: 'center', mb: 3 }}
            >
                Manage Trajets
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDialogOpen(null)}
                >
                    Add Trajet
                </Button>
            </Box>
            <MUIDataTable
                title="List of Trajets"
                data={trajets}
                columns={columns}
                options={options}
            />
            <TrajetDialog
                open={openDialog}
                onClose={handleDialogClose}
                trajet={currentTrajet}
                updateTrajets={updateTrajets}
            />
            <TrajetViewDialog
                open={viewOpen}
                onClose={handleViewClose}
                trajet={currentTrajet}
            />
        </Box>
    );
};

export default Trajet;
