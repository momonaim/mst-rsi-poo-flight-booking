
import { BarChart } from '@mui/x-charts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const ChartCard = ({ chartType, startDate, endDate }) => {

    const [reservations, setReservations] = useState([]);
    const [billets, setBillets] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);


    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                axios.get(`http://localhost:8080/reservations`).then((response) => {
                    setReservations(response.data);
                    setFilteredReservations(response.data);
                }),
                axios.get(`http://localhost:8080/billets`).then((response) => {
                    setBillets(response.data);
                }),
            ]).catch((error) => {
                console.error('There was an error fetching the data!', error);
            });

        };
        loadData();

    }, []);


    const doughnutData1 = {
        labels: ['Completed', 'Pending', 'Cancelled'],
        datasets: [
            {
                data: [
                    filteredReservations.filter((r) => !r.statut).length,
                    filteredReservations.filter((r) => r.statut).length,
                    filteredReservations.filter((r) => r.canceled).length,
                ],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            },
        ],
    };
    const barData = {
        xAxis: [
            { scaleType: "band", data: ['Economy', 'Business', 'First'] },
        ],
        series: [
            {
                data: [
                    billets.filter((r) => r.classType === 'Economy').length,
                    billets.filter((r) => r.classType === 'Business').length,
                    billets.filter((r) => r.classType === 'First').length,
                ], label: "Class Bookings",

            },
        ],
    };



    return (
        <div>
            {chartType === 'bar' && (
                <BarChart
                    xAxis={barData.xAxis}
                    series={barData.series}
                    width={450}
                    height={300}
                />
            )}
            {chartType === 'doughnut' && <Doughnut data={doughnutData1} />}
        </div>
    );
};

export default ChartCard;
