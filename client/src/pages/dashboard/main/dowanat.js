import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Enregistre les éléments nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const MyDoughnutChart = () => {
  const [vols, setVols] = useState([]);
  const [volsParAnnee, setVolsParAnnee] = useState({});
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get("http://localhost:8080/vols")
      .then(response => {
        setVols(response.data);

        // Affichage de la structure complète des données pour vérification
        console.log("Données complètes des vols:", response.data);

        // Vérification si response.data est un tableau
        if (Array.isArray(response.data)) {
          // Calcul du nombre total de vols
          const totalVols = response.data.length;

          // Créer un objet pour stocker le nombre de vols par année
          const volsParAnnee = response.data.reduce((acc, vol) => {
            const dateArrivee = new Date(vol.dateArrivee);
            const year = dateArrivee.getFullYear(); // Extraire l'année

            // Ajouter ou incrémenter le nombre de vols pour cette année
            acc[year] = (acc[year] || 0) + 1;

            return acc;
          }, {});

          // Calculer les pourcentages
          const pourcentagesParAnnee = Object.entries(volsParAnnee).reduce((acc, [year, count]) => {
            const percentage = ((count / totalVols) * 100).toFixed(2); // Calculer et formater le pourcentage
            acc[year] = percentage;
            return acc;
          }, {});

          // Mettre à jour l'état avec les pourcentages par année
          setVolsParAnnee(pourcentagesParAnnee);

          // Préparer les labels et les données pour le graphique
          const labels = Object.keys(volsParAnnee); // Années extraites
          const data = Object.values(pourcentagesParAnnee); // Pourcentages

          // Créer l'objet chartData
          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Pourcentage de vols par année',
                data: data,
                backgroundColor: [
                  'rgb(255, 99, 132)', // Couleur pour chaque année
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                  'rgb(54, 162, 235)',],
                hoverBackgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(255, 205, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                ],
              },
            ],
          });

          // Affichage des pourcentages par année pour vérification
          console.log("Pourcentages de vols par année:", pourcentagesParAnnee);
        } else {
          console.error("Les données ne sont pas sous forme de tableau");
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des vols:", error);
      });
  }, []);

  return (
    <div>
      <Doughnut data={chartData} />
    </div>
  );
};

export default MyDoughnutChart;
