import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

const cards = [
  {
    id: 1,
    title: 'Clients',
    description: 'Total',
    color: '#FFC107', // Jaune
    endpoint: '/countuser', // Endpoint pour récupérer le nombre de clients
  },
  {
    id: 2,
    title: 'Vols',
    description: 'Total',
    color: '#FFA500', // Orange
    endpoint: '/countvol', // Endpoint pour récupérer le nombre de vols
  },
  {
    id: 3,
    title: 'Avions',
    description: 'Total',
    color: '#03A9F4', // Bleu
    endpoint: '/countavion', // Endpoint pour récupérer le nombre d'avions
  },
  {
    id: 4,
    title: 'Réservations',
    description: 'Total',
    color: '#8BC34A', // Vert
    endpoint: '/countreservation', // Endpoint pour récupérer le nombre de réservations
  },
];

function SelectActionCard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Récupérer les statistiques pour chaque carte
    cards.forEach((card) => {
      axios.get(`http://localhost:8080${card.endpoint}`)
        .then((response) => {
          setStats((prevStats) => ({
            ...prevStats,
            [card.title]: response.data, // Stocker le nombre dans l'objet stats
          }));
        })
        .catch((error) => {
          console.error(`Erreur lors de la récupération des données pour ${card.title}`, error);
        });
    });
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
        gap: 2,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          sx={{
            width: 300,
            backgroundColor: card.color, // Applique la couleur ici
            color: 'black', // Couleur du texte pour qu'il soit lisible
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2">
                {stats[card.title] !== undefined
                  ? `${card.description}: ${stats[card.title]}`
                  : 'Chargement...'}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;