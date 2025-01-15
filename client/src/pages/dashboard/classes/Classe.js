import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import axios from 'axios';
import ClasseDialog from "./ClasseDialog";
import ClassViewDialog from './ClassViewDialog';

const Classe = ({ setSelectedLink, link }) => {
  const [classes, setClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleViewOpen = (classe) => {
    setCurrentClass(classe);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setCurrentClass(null);
  };


  useEffect(() => {
    setSelectedLink(link);
    axios.get("http://localhost:8080/classes")
      .then(response => {
        setClasses(response.data);
      })
      .catch(error => {
        console.error("Error fetching classes", error);
      });
  }, [link, setSelectedLink]);

  const handleDialogOpen = (classe) => {
    setCurrentClass(classe);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentClass(null);
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
          await axios.delete(`http://localhost:8080/classes/${id}`);
          setClasses(classes.filter(classe => classe.id !== id));
          Swal.fire("Deleted!", "The class has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting class", error);
          Swal.fire("Error!", "Failed to delete the class.", "error");
        }
      }
    });
  };

  const updateClasses = (newClass) => {
    setClasses((prevClasses) => {
      const index = prevClasses.findIndex(classe => classe.id === newClass.id);
      if (index !== -1) {
        const updatedClasses = [...prevClasses];
        updatedClasses[index] = newClass;
        return updatedClasses;
      }
      return [...prevClasses, newClass];
    });
  };

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Name' },
    { name: 'prixKm', label: 'Price per Km (€)' },
    { name: 'capaciteMax', label: 'Max Capacity' },
    { name: 'description', label: 'Description' },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const classe = classes[rowIndex];
          return (
            <Box>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleDialogOpen(classe)}
                sx={{ mr: 1 }}
              >
                <ModeEdit />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(classe.id)}
                sx={{ mr: 1 }}
              >
                <GridDeleteIcon />
              </IconButton>
              <IconButton
                color="default"
                size="small"
                onClick={() => handleViewOpen(classe)}
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
        Manage Classes
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen(null)}
        >
          Add Class
        </Button>
      </Box>
      <MUIDataTable
        title="List of Classes"
        data={classes}
        columns={columns}
        options={options}
      />
      <ClasseDialog
        open={openDialog}
        onClose={handleDialogClose}
        classe={currentClass}
        updateClasses={updateClasses}
      />
      <ClassViewDialog
        open={viewOpen}
        onClose={handleViewClose}
        classe={currentClass}
      />

    </Box>
  );
};

export default Classe;
