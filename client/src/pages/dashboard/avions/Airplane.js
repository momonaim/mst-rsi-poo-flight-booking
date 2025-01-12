import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import axios from 'axios';
import AirplaneDialog from "./AirplaneDialog";
import AirplaneViewDialog from './AirplaneViewDialog';

const Airplane = ({ setSelectedLink, link }) => {
    const [airplanes, setAirplanes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAirplane, setCurrentAirplane] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);

    const handleViewOpen = (airplane) => {
        setCurrentAirplane(airplane);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setCurrentAirplane(null);
    };

    useEffect(() => {
        setSelectedLink(link);
        axios.get("http://localhost:8080/avions")
            .then(response => {
                setAirplanes(response.data);
            })
            .catch(error => {
                console.error("Error fetching airplanes", error);
            });
    }, [link, setSelectedLink]);

    const handleDialogOpen = (airplane) => {
        setCurrentAirplane(airplane);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentAirplane(null);
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
                    await axios.delete(`http://localhost:8080/avion/${id}`);
                    setAirplanes(airplanes.filter(airplane => airplane.id !== id));
                    Swal.fire("Deleted!", "The airplane has been deleted.", "success");
                } catch (error) {
                    console.error("Error deleting airplane", error);
                    Swal.fire("Error!", "Failed to delete the airplane.", "error");
                }
            }
        });
    };

    const updateAirplanes = (newAirplane) => {
        setAirplanes((prevAirplanes) => {
            const index = prevAirplanes.findIndex(airplane => airplane.id === newAirplane.id);
            if (index !== -1) {
                const updatedAirplanes = [...prevAirplanes];
                updatedAirplanes[index] = newAirplane;
                return updatedAirplanes;
            }
            return [...prevAirplanes, newAirplane];
        });
    };

    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'nom', label: 'Name' },
        { name: 'vitesse', label: 'Speed (km/h)' },
        { name: 'autonomie', label: 'Autonomy (km)' },
        { name: 'capacite_CA', label: 'Capacity (First Class)' },
        { name: 'capacite_CE', label: 'Capacity (Economy)' },
        { name: 'capacite_CP', label: 'Capacity (Premium)' },
        {
            name: "actions",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex;
                    const airplane = airplanes[rowIndex];
                    return (
                        <Box>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleDialogOpen(airplane)}
                                sx={{ mr: 1 }}
                            >
                                <ModeEdit />
                            </IconButton>
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(airplane.id)}
                                sx={{ mr: 1 }}
                            >
                                <GridDeleteIcon />
                            </IconButton>
                            <IconButton
                                color="default"
                                size="small"
                                onClick={() => handleViewOpen(airplane)}
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
        responsive: 'scroll', // Enable horizontal scrolling
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
        tableBodyMaxHeight: '400px', // Limit table body height for vertical scrolling
        download: true,
        print: true,
        search: true,
    };

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Typography
                variant="h4"
                component="h4"
                sx={{ textAlign: 'center', mb: 3 }}
            >
                Manage Airplanes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDialogOpen(null)}
                >
                    Add Airplane
                </Button>
            </Box>
            <MUIDataTable
                title="List of Airplanes"
                data={airplanes}
                columns={columns}
                options={options}
            />
            <AirplaneDialog
                open={openDialog}
                onClose={handleDialogClose}
                airplane={currentAirplane}
                updateAirplanes={updateAirplanes}
            />
            <AirplaneViewDialog
                open={viewOpen}
                onClose={handleViewClose}
                airplane={currentAirplane}
            />

        </Box>
    );
};

export default Airplane;
