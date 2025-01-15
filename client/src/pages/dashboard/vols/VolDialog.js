import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const VolDialog = ({ open, onClose, vol, updateVols, isEdit }) => {
  const [avions, setAvions] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const [volState, setVolState] = useState({
    dateDepart: '',
    dateArrivee: '',
    CA_dispo: 0,
    CE_dispo: 0,
    CP_dispo: 0,
    avionId: '',
    trajetId: ''
  });

  // Fetch avions and trajets when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/avions')
      .then(response => setAvions(response.data))
      .catch(error => console.error('Error fetching avions:', error));

    axios.get('http://localhost:8080/trajets')
      .then(response => setTrajets(response.data))
      .catch(error => console.error('Error fetching trajets:', error));
  }, []);

  // Populate the dialog form with the existing vol data when in edit mode
  useEffect(() => {
    if (vol) {
      setVolState({
        dateDepart: vol.dateDepart || '',
        dateArrivee: vol.dateArrivee || '',
        CA_dispo: vol.ca_dispo || 0,
        CE_dispo: vol.ce_dispo || 0,
        CP_dispo: vol.cp_dispo || 0,
        avionId: vol.avion?.id || '',
        trajetId: vol.trajet?.id_trajet || '',
      });
    } else {
      setVolState({
        dateDepart: '',
        dateArrivee: '',
        CA_dispo: 0,
        CE_dispo: 0,
        CP_dispo: 0,
        avionId: '',
        trajetId: '',
      });
    }
  }, [vol]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVolState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const avion = { id: volState.avionId };
    const trajet = { id_trajet: volState.trajetId };
    const volData = {
      ca_dispo: volState.CA_dispo,
      ce_dispo: volState.CE_dispo,
      cp_dispo: volState.CP_dispo,
      avion,
      trajet,
      dateDepart: volState.dateDepart,
      dateArrivee: volState.dateArrivee,
    };

    const apiEndpoint = vol
      ? `http://localhost:8080/vol/${vol.id}`
      : 'http://localhost:8080/vols/ajoutsi';

    const apiMethod = vol?.id ? axios.put : axios.post;

    apiMethod(apiEndpoint, volData)
      .then((response) => {
        console.log('Vol saved successfully:', response.data);
        Swal.fire("Saved!", "Vol saved successfully.", "success");
        updateVols(response.data); // Update the list of vols
        onClose(); // Close the dialog
      })
      .catch((error) => {
        console.error('Error saving vol:', error);
        alert('Failed to save vol. Please try again.');
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Modifier un Vol' : 'Ajouter un Vol'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Date de départ"
          type="datetime-local"
          fullWidth
          value={volState.dateDepart}
          onChange={handleChange}
          name="dateDepart"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          label="Date d'arrivée"
          type="datetime-local"
          fullWidth
          value={volState.dateArrivee}
          onChange={handleChange}
          name="dateArrivee"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        {/* <TextField
          label="CA Disponible"
          type="number"
          fullWidth
          value={volState.CA_dispo}
          onChange={handleChange}
          name="CA_dispo"
          margin="normal"
        />
        <TextField
          label="CE Disponible"
          type="number"
          fullWidth
          value={volState.CE_dispo}
          onChange={handleChange}
          name="CE_dispo"
          margin="normal"
        />
        <TextField
          label="CP Disponible"
          type="number"
          fullWidth
          value={volState.CP_dispo}
          onChange={handleChange}
          name="CP_dispo"
          margin="normal"
        /> */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Avion</InputLabel>
          <Select
            value={volState.avionId}
            onChange={handleChange}
            name="avionId"
            label="Avion"
          >
            {avions.map((avion) => (
              <MenuItem key={avion.id} value={avion.id}>
                {avion.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Trajet</InputLabel>
          <Select
            value={volState.trajetId}
            onChange={handleChange}
            name="trajetId"
            label="Trajet"
          >
            {trajets.map((trajet) => (
              <MenuItem key={trajet.id_trajet} value={trajet.id_trajet}>
                {trajet.villeDepart} - {trajet.villeArrivee}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {vol ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VolDialog;
