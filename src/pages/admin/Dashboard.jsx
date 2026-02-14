import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [leakages, setLeakages] = useState([]);

  useEffect(() => {
    const fetchLeakages = async () => {
      const querySnapshot = await getDocs(collection(db, "leakages"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeakages(data);
    };

    fetchLeakages();
  }, []);

  const currentMonth = new Date().getMonth();
  const today = new Date().toISOString().split("T")[0];

  const monthlyData = leakages.filter(item => {
    const date = item.timestamp?.toDate?.();
    return date && date.getMonth() === currentMonth;
  });

  const todayCount = leakages.filter(item => {
    const date = item.timestamp?.toDate?.();
    return date && date.toISOString().split("T")[0] === today;
  }).length;

  const totalLoss = monthlyData.reduce(
    (sum, item) => sum + (item.waterLoss || 0),
    0
  );

  const avgResponse =
    monthlyData.reduce(
      (sum, item) => sum + (item.durationMinutes || 0),
      0
    ) / (monthlyData.length || 1);

  const constituencyLoss = {};

  monthlyData.forEach(item => {
    if (!constituencyLoss[item.constituency])
      constituencyLoss[item.constituency] = 0;

    constituencyLoss[item.constituency] += item.waterLoss || 0;
  });

  const topConstituency = Object.entries(constituencyLoss).sort(
    (a, b) => b[1] - a[1]
  )[0];

  let status = "Stable";
  if (totalLoss > 15000) status = "Critical";
  else if (totalLoss > 5000) status = "Moderate";

  const chartData = {
    labels: Object.keys(constituencyLoss),
    datasets: [
      {
        label: "Water Loss",
        data: Object.values(constituencyLoss),
        backgroundColor: "#1976d2",
      },
    ],
  };

  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight="bold" mb={3}>
            PWD Admin Dashboard
          </Typography>

          {/* ===== TOP KPI ROW (ALL 6 CARDS) ===== */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Total Water Loss</Typography>
                  <Typography variant="h6">
                    {totalLoss.toFixed(0)} L
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Total Leakages</Typography>
                  <Typography variant="h6">
                    {monthlyData.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Avg Response</Typography>
                  <Typography variant="h6">
                    {monthlyData.length
                      ? (avgResponse / 60).toFixed(1)
                      : "0"} hrs
                  </Typography>

                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Today's Leakages</Typography>
                  <Typography variant="h6">
                    {todayCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Status Indicator</Typography>
                  <Typography variant="h6">
                    {status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={2}>
              <Card>
                <CardContent>
                  <Typography>Highest Loss Area</Typography>
                  <Typography variant="h6">
                    {topConstituency?.[0] || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    {topConstituency?.[1]?.toFixed(0)} L
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ===== SMALLER BAR CHART ===== */}
          <Box
            mt={4}
            bgcolor="white"
            p={3}
            borderRadius={3}
            sx={{
              maxWidth: "900px",
              mx: "auto",
              height: 350,
            }}
          >
            <Typography variant="h6">
              Constituency-wise Water Loss
            </Typography>
            <Bar
              data={chartData}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}
