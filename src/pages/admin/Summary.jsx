import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
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
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const formatDatePretty = (date) => {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  return `${day}${suffix} ${date.toLocaleString("default", { month: "short" })}`;
};

export default function Summary() {

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

  const monthlyData = leakages.filter(item => {
    const date = item.timestamp?.toDate?.();
    return date && date.getMonth() === currentMonth;
  });

  const totalMonthlyLoss = monthlyData.reduce(
    (sum, item) => sum + (item.waterLoss || 0),
    0
  );

  /* 🔥 Convert litres → cubic meter */
  const totalMonthlyLossM3 = (totalMonthlyLoss / 1000).toFixed(2);

  const constituencySummary = {};

  monthlyData.forEach(item => {
    if (!constituencySummary[item.constituency]) {
      constituencySummary[item.constituency] = { count: 0, loss: 0 };
    }
    constituencySummary[item.constituency].count++;
    constituencySummary[item.constituency].loss += item.waterLoss || 0;
  });

  const barChartData = {
    labels: Object.keys(constituencySummary),
    datasets: [
      {
        label: "Water Loss (m³)",
        data: Object.values(constituencySummary).map(i =>
          (i.loss / 1000).toFixed(2)
        ),
        backgroundColor: "#1976d2",
      },
    ],
  };

  const dailyLoss = {};

  monthlyData.forEach(item => {
    const date = item.timestamp.toDate();
    const key = date.toDateString();
    dailyLoss[key] = (dailyLoss[key] || 0) + (item.waterLoss || 0);
  });

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const labels = [];
  const values = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), i);
    const key = d.toDateString();

    labels.push(formatDatePretty(d));
    values.push(((dailyLoss[key] || 0) / 1000).toFixed(2));
  }

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Daily Water Loss (m³)",
        data: values,
        borderColor: "#0d47a1",
        fill: false,
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
          py: 4,
        }}
      >
        <Container maxWidth="lg">

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Weekly / Monthly NRW Summary
          </Typography>

          {/* KPI */}
          <Grid container spacing={2} sx={{ mb: 3 }}>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography>Total Water Loss</Typography>
                  <Typography variant="h5">
                    {totalMonthlyLossM3} m³
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography>Total Leakages</Typography>
                  <Typography variant="h5">
                    {monthlyData.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>

          <Grid container spacing={4}>

            {/* TABLE */}
            <Grid item xs={12} md={4}>
              <Table sx={{ bgcolor: "rgba(255,255,255,0.9)" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Constituency</TableCell>
                    <TableCell>No. Leakages</TableCell>
                    <TableCell>Water Lost (m³)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(constituencySummary).map(key => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{constituencySummary[key].count}</TableCell>
                      <TableCell>
                        {(constituencySummary[key].loss / 1000).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            {/* CHARTS */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                  <Box sx={{ bgcolor:"white", p:3, borderRadius:3, height:400 }}>
                    <Typography>Constituency-wise Loss (m³)</Typography>
                    <Bar data={barChartData} options={{ maintainAspectRatio:false }} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ bgcolor:"white", p:3, borderRadius:3, height:400 }}>
                    <Typography>Water Loss Trend (m³)</Typography>
                    <Line
                      data={lineChartData}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            ticks: {
                              autoSkip: true,
                              maxTicksLimit: 7,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Grid>

              </Grid>
            </Grid>

          </Grid>

        </Container>
      </Box>
    </>
  );
}