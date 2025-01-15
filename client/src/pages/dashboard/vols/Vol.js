import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ModeEdit from '@mui/icons-material/Edit';
import GridDeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
import VolDialog from "./VolDialog";

const Vol = ({ setSelectedLink, link }) => {
  const [vols, setVols] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVol, setCurrentVol] = useState(null);

  useEffect(() => {
    setSelectedLink(link);
    axios.get("http://localhost:8080/vols")
      .then(response => {
        setVols(response.data);
      })
      .catch(error => {
        console.error("Error fetching vols", error);
      });
  }, [link, setSelectedLink]);

  const handleDialogOpen = (vol) => {
    setCurrentVol(vol);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentVol(null);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/vol/${id}`);
          setVols(vols.filter(vol => vol.id !== id));
          Swal.fire("Supprimé!", "Le vol a été supprimé.", "success");
        } catch (error) {
          console.error("Erreur lors de la suppression du vol", error);
          Swal.fire("Erreur!", "Échec de la suppression du vol.", "error");
        }
      }
    });
  };

  const updateVols = (newVol) => {
    setVols((prevVols) => {
      const index = prevVols.findIndex(vol => vol.id === newVol.id);
      if (index !== -1) {
        const updatedVols = [...prevVols];
        updatedVols[index] = newVol;
        return updatedVols;
      }
      return [...prevVols, newVol];
    });
  };

  const columns = [
    { name: 'id', label: 'ID' },
    { name: 'dateDepart', label: 'Départ' },
    { name: 'dateArrivee', label: 'Arrivée' },
    { name: 'ca_dispo', label: 'CA' },
    { name: 'ce_dispo', label: 'CE' },
    { name: 'cp_dispo', label: 'CP' },
    //{ name: 'avion.nom', label: 'Avion' },



    {
      name: 'avion',
      label: 'Avion',
      options: {
        customBodyRender: (value) => value ? value.nom : 'N/A',
      }
    },


    {
      name: 'trajet', label: 'Trajet',
      options: {
        customBodyRender: (value) => `${value?.villeDepart || 'N/A'} - ${value?.villeArrivee || 'N/A'}`
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const vol = vols[rowIndex];
          return (
            <Box>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleDialogOpen(vol)}
                sx={{ mr: 1 }}
              >
                <ModeEdit />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(vol.id)}
                sx={{ mr: 1 }}
              >
                <GridDeleteIcon />
              </IconButton>
              {/* <IconButton
                color="default"
                size="small"
                onClick={() => handleViewOpen(vol)}
              >
                <Visibility />
              </IconButton> */}
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
        Gestion des Vols
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen(null)}
        >
          Ajouter un Vol
        </Button>
      </Box>
      <MUIDataTable
        title="Liste des Vols"
        data={vols}
        columns={columns}
        options={options}
      />
      <VolDialog
        open={openDialog}
        onClose={handleDialogClose}
        vol={currentVol}
        updateVols={updateVols}
      />
    </Box>
  );
};

export default Vol;
