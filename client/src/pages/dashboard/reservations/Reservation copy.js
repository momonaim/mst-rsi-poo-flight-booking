import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import axios from 'axios';
import ReservationDialog from "./ReservationDialog";

const Reservation = ({ setSelectedLink, link }) => {
  const [reservations, setReservations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  useEffect(() => {
    setSelectedLink(link);
    fetchReservations();
  }, [link, setSelectedLink]);

  const fetchReservations = () => {
    axios.get("http://localhost:8080/reservations")
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        console.error("Error fetching reservations", error);
      });
  };

  const handleDialogOpen = (reservation) => {
    setCurrentReservation(reservation);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentReservation(null);
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
          await axios.delete(`http://localhost:8080/reservations/${id}`);
          setReservations(reservations.filter(reservation => reservation.id !== id));
          Swal.fire("Deleted!", "The reservation has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting reservation", error);
          Swal.fire("Error!", "Failed to delete the reservation.", "error");
        }
      }
    });
  };

  const updateReservations = (newReservation) => {
    setReservations((prevReservations) => {
      const index = prevReservations.findIndex(reservation => reservation.id === newReservation.id);
      if (index !== -1) {
        const updatedReservations = [...prevReservations];
        updatedReservations[index] = newReservation;
        return updatedReservations;
      }
      return [...prevReservations, newReservation];
    });
  };

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'nbrBeneficier', label: 'nbrBeneficier' },
    {
      name: 'vol', label: 'VolID', options: {
        customBodyRender: (value) => value ? value.id : 'N/A',
      }
    },
    {
      name: 'user', label: 'UserID', options: {
        customBodyRender: (value) => value ? value.username : 'N/A',
      }
    },
    { name: 'prixTotal', label: 'Prix Total' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const reservation = reservations[rowIndex];
          return (
            <Box>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleDialogOpen(reservation)}
                sx={{ mr: 1 }}
              >
                <ModeEdit />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(reservation.id)}
                sx={{ mr: 1 }}
              >
                <GridDeleteIcon />
              </IconButton>
              <IconButton
                color="default"
                size="small"
                onClick={() => console.log("Viewing reservation:", reservation)}
              >
                <Visibility />
              </IconButton>
            </Box>
          );
        },
        filter: false,
        sort: false,
      }
    }
  ];

  const options = {
    filterType: 'dropdown',
    selectableRows: 'none',
    responsive: 'standard',
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    download: true,
    print: true,
    search: true
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: 'center', mb: 3 }}
      >
        Manage Reservations
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen(null)}
        >
          Add Reservation
        </Button>
      </Box>
      <MUIDataTable
        title="List of Reservations"
        data={reservations}
        columns={columns}
        options={options}
      />
      <ReservationDialog
        open={openDialog}
        onClose={handleDialogClose}
        reservation={currentReservation}
        updateReservations={updateReservations}
      />
    </Box>
  );
};

export default Reservation;