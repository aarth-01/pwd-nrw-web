import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* PIE CHART IMPORT */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [leakages, setLeakages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filters, setFilters] = useState({
    date: "",
    constituency: "",
    leakageType: "",
    pipelineType: "",
    durationMinutes: "",
    waterLoss: "",
    pressure: "",
    location: "",
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchLeakages = async () => {
      const querySnapshot = await getDocs(collection(db, "leakages"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeakages(data);
    };
    fetchLeakages();
  }, []);

  /* RESET PAGE WHEN FILTER CHANGES */
  useEffect(() => {
    setPage(0);
  }, [filters]);

  /* ---------------- COLUMN FILTERS ---------------- */
const filteredTableData = useMemo(() => {
  return leakages
    .filter((item) => {
      const date = item.timestamp?.toDate?.();
      const formattedDate = date ? date.toLocaleDateString() : "";

      const waterLossM3 = item.waterLoss
        ? (item.waterLoss / 1000).toFixed(3)
        : "0.000";

      const locationString =
        item.latitude && item.longitude
          ? `${item.latitude}, ${item.longitude}`
          : "";

      return (
        formattedDate.toLowerCase().includes(filters.date.toLowerCase()) &&
        item.constituency?.toLowerCase().includes(filters.constituency.toLowerCase()) &&
        item.leakageType?.toLowerCase().includes(filters.leakageType.toLowerCase()) &&
        item.pipelineType?.toLowerCase().includes(filters.pipelineType.toLowerCase()) &&
        String(item.durationMinutes || "").includes(filters.durationMinutes) &&
        waterLossM3.includes(filters.waterLoss) &&
        String(item.pressure || "").includes(filters.pressure) &&
        locationString.includes(filters.location)
      );
    })

    /* 🔥 ADD THIS SORTING PART */
    .sort((a, b) => {
      const dateA = a.timestamp?.toDate?.() || new Date(0);
      const dateB = b.timestamp?.toDate?.() || new Date(0);

      return dateB - dateA; // DESCENDING (latest first)
    });

}, [leakages, filters]);

  /* ---------------- PAGINATION ---------------- */
  const paginatedData = filteredTableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ---------------- PIE CHART DATA ---------------- */
  const constituencyData = useMemo(() => {
    const counts = {};

    leakages.forEach((item) => {

      /* REMOVE UNKNOWN FROM PIE CHART */
      if (!item.constituency || item.constituency === "Unknown") return;

      const name = item.constituency;
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [leakages]);

  /* 🔵 LIGHT BLUE SHADES FOR PIE CHART */
  const COLORS = [
    "#0d47a1",
    "#1e88e5",
    "#bbdefb",
  ];

  /* ---------------- EXPORT TO EXCEL ---------------- */
  const exportToExcel = () => {
    const exportData = filteredTableData.map((item) => {
      const date = item.timestamp?.toDate?.();
      return {
        Date: date ? date.toLocaleDateString() : "N/A",
        Constituency: item.constituency,
        LeakageType: item.leakageType,
        PipelineType: item.pipelineType,
        DurationMinutes: item.durationMinutes,
        WaterLoss_m3: item.waterLoss
          ? (item.waterLoss / 1000).toFixed(3)
          : "0.000",
        Pressure: item.pressure,
        ExactLocation:
          item.latitude && item.longitude
            ? `${item.latitude}, ${item.longitude}`
            : "N/A",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leakages");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Leakage_Report.xlsx");
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
          pl: isMobile ? 1 : 10,
          pr: 1,
        }}
      >
        <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2 }}>

          {/* HEADER */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            mb={3}
          >
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              Welcome Back Admin!
            </Typography>
          </Box>

          {/* PIE CHART */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" textAlign="center" mb={2}>
              Leakage Reports by Constituency
            </Typography>

            <Box height={300}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={constituencyData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ value }) => value}
                  >
                    {constituencyData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* TABLE */}
          <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
            <Table stickyHeader size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Constituency</b></TableCell>
                  <TableCell><b>Leakage Type</b></TableCell>
                  <TableCell><b>Pipeline</b></TableCell>
                  <TableCell><b>Duration</b></TableCell>
                  <TableCell><b>Water Loss (m³)</b></TableCell>
                  <TableCell><b>Pressure</b></TableCell>
                  <TableCell><b>Exact Location</b></TableCell>
                </TableRow>

                <TableRow>
                  {Object.keys(filters).map((key) => (
                    <TableCell key={key}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Filter"
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((item) => {
                  const date = item.timestamp?.toDate?.();
                  const waterLossM3 = item.waterLoss
                    ? (item.waterLoss / 1000).toFixed(3)
                    : "0.000";

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{date ? date.toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>{item.constituency}</TableCell>
                      <TableCell>{item.leakageType}</TableCell>
                      <TableCell>{item.pipelineType}</TableCell>
                      <TableCell>{item.durationMinutes}</TableCell>
                      <TableCell>{waterLossM3}</TableCell>
                      <TableCell>{item.pressure}</TableCell>

                      <TableCell>
                        {item.latitude && item.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.latitude}, {item.longitude}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredTableData.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>

          {/* EXPORT BUTTON */}
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
              fullWidth={isMobile}
              sx={{ maxWidth: "300px" }}
            >
              Export to Excel
            </Button>
          </Box>
          
        </Container>
      </Box>
    </>
  );
}