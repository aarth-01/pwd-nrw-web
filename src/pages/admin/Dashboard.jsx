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

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  /* ✅ FETCH DATA */
  useEffect(() => {

    const fetchLeakages = async () => {
      const snapshot = await getDocs(collection(db, "leakages"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLeakages(data);
    };

    fetchLeakages();

  }, []);

  /* ✅ FILTER DATA */
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const filteredTableData = useMemo(() => {

    return leakages
      .filter(item => {

        const date = item.timestamp?.toDate?.();
        const formattedDate = date ? date.toLocaleDateString() : "";

        const waterLossM3 = item.waterLoss
          ? (item.waterLoss / 1000).toFixed(3)
          : "0.000";

        return (
          formattedDate.toLowerCase().includes(filters.date.toLowerCase()) &&
          (item.constituency || "")
            .toLowerCase()
            .includes(filters.constituency.toLowerCase()) &&
          (item.leakageType || "")
            .toLowerCase()
            .includes(filters.leakageType.toLowerCase()) &&
          (item.pipelineType || "")
            .toLowerCase()
            .includes(filters.pipelineType.toLowerCase()) &&
          String(item.durationMinutes || "").includes(filters.durationMinutes) &&
          waterLossM3.includes(filters.waterLoss) &&
          String(item.pressure || "").includes(filters.pressure) &&
          (item.location?.address || "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        );

      })
      .sort((a, b) => {
        const dateA = a.timestamp?.toDate?.() || new Date(0);
        const dateB = b.timestamp?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

  }, [leakages, filters]);

  const paginatedData = filteredTableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ✅ PIE CHART DATA */
  const constituencyData = useMemo(() => {

    const counts = {};

    leakages.forEach(item => {
      if (!item.constituency || item.constituency === "Unknown") return;

      counts[item.constituency] =
        (counts[item.constituency] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key],
    }));

  }, [leakages]);

  const COLORS = ["#0d47a1", "#1e88e5", "#bbdefb"];

  /* ✅ EXPORT EXCEL */
  const exportToExcel = () => {

    const exportData = filteredTableData.map(item => {

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
        Location: item.location?.address || "N/A",
      };

    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leakages");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Leakage_Report.xlsx"
    );
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
          px: isMobile ? 1 : 10,
        }}
      >
        <Container maxWidth="lg">

          <Typography
            textAlign="center"
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            mb={3}
          >
            Welcome Back Admin
          </Typography>

          {/* PIE CHART */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography textAlign="center" mb={2}>
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
                    label
                  >
                    {constituencyData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* TABLE */}
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              overflowX: "auto"
            }}
          >

            <Table
              stickyHeader
              size={isMobile ? "small" : "medium"}
              sx={{ minWidth: 900 }}
            >

              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Constituency</TableCell>
                  <TableCell>Leakage Type</TableCell>
                  <TableCell>Pipeline</TableCell>
                  <TableCell>Duration (minutes)</TableCell>
                  <TableCell>Water Loss (m³)</TableCell>
                  <TableCell>Pressure (kg/cm²)</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {paginatedData.map(item => {

                  const date = item.timestamp?.toDate?.();
                  const waterLossM3 = item.waterLoss
                    ? (item.waterLoss / 1000).toFixed(3)
                    : "0.000";

                  return (
                    <TableRow key={item.id} hover>

                      <TableCell>
                        {date ? date.toLocaleDateString() : "N/A"}
                      </TableCell>

                      <TableCell>{item.constituency}</TableCell>
                      <TableCell>{item.leakageType}</TableCell>
                      <TableCell>{item.pipelineType}</TableCell>
                      <TableCell>{item.durationMinutes}</TableCell>
                      <TableCell>{waterLossM3}</TableCell>
                      <TableCell>{item.pressure}</TableCell>

                      <TableCell>
  {item.location?.address ? (
    <a
      href={`https://www.google.com/maps?q=${encodeURIComponent(
        item.location.address
      )}`}
      target="_blank"
      rel="noreferrer"
      style={{
        color: "#1976d2",
        textDecoration: "none",
        fontWeight: 500,
        whiteSpace: "normal"
      }}
    >
      {item.location.address}
    </a>
  ) : "N/A"}

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
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />

          </TableContainer>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={exportToExcel}
              sx={{
                backgroundColor: "#0D47A1",
                "&:hover": { backgroundColor: "#08306B" },
                fontWeight: "bold"
              }}
            >
              EXPORT TO EXCEL
            </Button>
          </Box>

        </Container>
      </Box>
    </>
  );
}