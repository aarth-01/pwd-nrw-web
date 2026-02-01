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
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { mockLeakages } from "../../data/mockLeakages";

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

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Helper functions
const getMonth = (dateStr) => new Date(dateStr).getMonth();
const activeMonth = Math.max(
  ...mockLeakages.map((item) => getMonth(item.date))
);


export default function Summary() {
  /* ---------------- CURRENT MONTH DATA ---------------- */
  const monthlyData = mockLeakages.filter(
    (item) => getMonth(item.date) === activeMonth
  );

  const totalMonthlyLoss = monthlyData.reduce(
    (sum, item) => sum + item.waterLoss,
    0
  );

  /* ---------------- CONSTITUENCY AGGREGATION ---------------- */
  const constituencySummary = {};

  monthlyData.forEach((item) => {
    if (!constituencySummary[item.constituency]) {
      constituencySummary[item.constituency] = {
        count: 0,
        loss: 0,
      };
    }
    constituencySummary[item.constituency].count += 1;
    constituencySummary[item.constituency].loss += item.waterLoss;
  });

  /* ---------------- BAR CHART DATA ---------------- */
  const barChartData = {
    labels: Object.keys(constituencySummary),
    datasets: [
      {
        label: "Water Loss (litres)",
        data: Object.values(constituencySummary).map(
          (item) => item.loss
        ),
        backgroundColor: "#1976d2",
      },
    ],
  };

  /* ---------------- LINE CHART DATA ---------------- */
  const sortedByDate = [...monthlyData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const lineChartData = {
    labels: sortedByDate.map((item) => item.date),
    datasets: [
      {
        label: "Daily Water Loss (litres)",
        data: sortedByDate.map((item) => item.waterLoss),
        borderColor: "#0d47a1",
        backgroundColor: "#0d47a1",
        fill: false,
      },
    ],
  };

  return (
    <>
      <Navbar role="admin" />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Weekly / Monthly NRW Summary
        </Typography>

        {/* KPI CARDS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  Total Water Loss (This Month)
                </Typography>
                <Typography variant="h6">
                  {totalMonthlyLoss} litres
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  Total Leakages
                </Typography>
                <Typography variant="h6">
                  {monthlyData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CONSTITUENCY TABLE */}
        <Typography variant="h6" gutterBottom>
          Constituency-wise Summary (Current Month)
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Constituency</TableCell>
              <TableCell>No. of Leakages</TableCell>
              <TableCell>Total Water Lost (litres)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(constituencySummary).map((key) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{constituencySummary[key].count}</TableCell>
                <TableCell>{constituencySummary[key].loss}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* CHARTS */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Constituency-wise Water Loss
            </Typography>
            <Bar data={barChartData} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Water Loss Trend (This Month)
            </Typography>
            <Line data={lineChartData} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
