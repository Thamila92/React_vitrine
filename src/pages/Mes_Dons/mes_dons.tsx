 import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { NavLink } from 'react-router-dom'; // Importation de NavLink
import { useEffect, useState } from 'react';

// Enregistrement des éléments nécessaires pour chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface Don {
  amount: number;
  date: Date;
  status: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const DonutChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthDonations, setMonthDonations] = useState(0);

  const VITE_URL_API = import.meta.env.VITE_URL_API;

  const userJSON = localStorage.getItem('user');
  let userId: string | undefined;

  if (userJSON) {
    try {
      const user = JSON.parse(userJSON);
      userId = user?.id;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${VITE_URL_API}/users/${userId}/donations`);
          const donationsData: Don[] = response.data.map((don: any) => ({
            amount: don.paiement.amount / 100, // Conversion en euros
            date: new Date(don.date),
            status: don.paiement.status,
          }));

          const total = donationsData.reduce((sum, don) => sum + don.amount, 0);
          const currentMonthDonations = donationsData.filter(don => 
            don.date.getMonth() === new Date().getMonth() && 
            don.date.getFullYear() === new Date().getFullYear()
          ).reduce((sum, don) => sum + don.amount, 0);

          setTotalAmount(total);
          setMonthDonations(currentMonthDonations);

          setChartData({
            labels: ['Total Dons', 'Dons Ce Mois'],
            datasets: [
              {
                data: [total, currentMonthDonations],
                backgroundColor: ['orange', 'blue'],
                hoverBackgroundColor: ['orange', 'blue'],
              },
            ],
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, [userId, VITE_URL_API]);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Total des Dons : €{totalAmount.toFixed(2)}</h2>
      <h3>Dons ce Mois : €{monthDonations.toFixed(2)}</h3>
      {chartData && chartData.datasets.length > 0 && <Doughnut data={chartData} />}
      
      {/* Ajout du bouton de don */}
      <NavLink to="/don">
        <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', backgroundColor: 'orange', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>
          Faire un Don
        </button>
      </NavLink>
    </div>
  );
};

export default DonutChart;
