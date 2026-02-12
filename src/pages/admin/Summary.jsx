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

export default function Summary() {
  const [leakages, setLeakages] = useState([]);

  useEffect(() => {
    const fetchLeakages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leakages"));

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeakages(data);
      } catch (error) {
        console.log(error);
      }
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

  const constituencySummary = {};

  monthlyData.forEach(item => {
    if (!constituencySummary[item.constituency]) {
      constituencySummary[item.constituency] = {
        count: 0,
        loss: 0,
      };
    }

    constituencySummary[item.constituency].count += 1;
    constituencySummary[item.constituency].loss += item.waterLoss || 0;
  });

  const barChartData = {
    labels: Object.keys(constituencySummary),
    datasets: [
      {
        label: "Water Loss (litres)",
        data: Object.values(constituencySummary).map(i => i.loss),
        backgroundColor: "#1976d2",
      },
    ],
  };

  const sortedByDate = [...monthlyData].sort(
    (a, b) =>
      a.timestamp.toDate() - b.timestamp.toDate()
  );

  const lineChartData = {
    labels: sortedByDate.map(i =>
      i.timestamp.toDate().toLocaleDateString()
    ),
    datasets: [
      {
        label: "Daily Water Loss",
        data: sortedByDate.map(i => i.waterLoss),
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
          width: "100%",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight="bold">
            Weekly / Monthly NRW Summary
          </Typography>

          <Grid container spacing={4}>
            {/* LEFT SIDE */}
            <Grid item xs={12} md={5}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography>Total Water Loss</Typography>
                      <Typography variant="h5">
                        {totalMonthlyLoss} litres
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
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

              <Table sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Constituency</b></TableCell>
                    <TableCell><b>No. of Leakages</b></TableCell>
                    <TableCell><b>Total Water Lost</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(constituencySummary).map(key => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{constituencySummary[key].count}</TableCell>
                      <TableCell>{constituencySummary[key].loss}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} md={7}>
              <Box sx={{ bgcolor: "white", p: 3, borderRadius: 3, mb: 3 }}>
                <Typography>Constituency-wise Loss</Typography>
                <Bar data={barChartData} />
              </Box>

              <Box sx={{ bgcolor: "white", p: 3, borderRadius: 3 }}>
                <Typography>Water Loss Trend</Typography>
                <Line data={lineChartData} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
