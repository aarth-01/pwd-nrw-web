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

// Helper functions
const getMonth = (dateStr) => new Date(dateStr).getMonth();
const currentMonth = new Date().getMonth();

export default function Summary() {
  // Current month data
  const monthlyData = mockLeakages.filter(
    (item) => getMonth(item.date) === currentMonth
  );

  const totalMonthlyLoss = monthlyData.reduce(
    (sum, item) => sum + item.waterLoss,
    0
  );

  // Constituency-wise aggregation
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
      </Container>
    </>
  );
}
