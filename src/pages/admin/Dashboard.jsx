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
} from "@mui/material";

import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [leakages, setLeakages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filters, setFilters] = useState({
    date: "",
    constituency: "",
    leakageType: "",
    pipelineType: "",
    durationMinutes: "",
    waterLoss: "",
    pressure: "",
    location: "", // ✅ NEW FILTER
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
    return leakages.filter((item) => {
      const date = item.timestamp?.toDate?.();
      const formattedDate = date ? date.toLocaleDateString() : "";

      const waterLossMLD = item.waterLoss
        ? (item.waterLoss / 1000000).toFixed(3)
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
        waterLossMLD.includes(filters.waterLoss) &&
        String(item.pressure || "").includes(filters.pressure) &&
        locationString.includes(filters.location) // ✅ LOCATION FILTER
      );
    });
  }, [leakages, filters]);

  /* ---------------- PAGINATION ---------------- */
  const paginatedData = filteredTableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        WaterLoss_MLD: item.waterLoss
          ? (item.waterLoss / 1000000).toFixed(3)
          : "0.000",
        Pressure: item.pressure,
        ExactLocation:
          item.latitude && item.longitude
            ? `${item.latitude}, ${item.longitude}`
            : "N/A", // ✅ ADDED TO EXPORT
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
        }}
      >
        <Container maxWidth="lg">

          {/* HEADER + EXPORT BUTTON */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold">
              Welcome Back Admin!
            </Typography>

            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Constituency</b></TableCell>
                  <TableCell><b>Leakage Type</b></TableCell>
                  <TableCell><b>Pipeline</b></TableCell>
                  <TableCell><b>Duration</b></TableCell>
                  <TableCell><b>Water Loss (MLD)</b></TableCell>
                  <TableCell><b>Pressure</b></TableCell>
                  <TableCell><b>Exact Location</b></TableCell> {/* ✅ NEW COLUMN */}
                </TableRow>

                {/* FILTER ROW */}
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
                  const waterLossMLD = item.waterLoss
                    ? (item.waterLoss / 1000000).toFixed(3)
                    : "0.000";

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {date ? date.toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>{item.constituency}</TableCell>
                      <TableCell>{item.leakageType}</TableCell>
                      <TableCell>{item.pipelineType}</TableCell>
                      <TableCell>{item.durationMinutes}</TableCell>
                      <TableCell>{waterLossMLD}</TableCell>
                      <TableCell>{item.pressure}</TableCell>

                      {/* ✅ EXACT LOCATION COLUMN */}
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
        </Container>
      </Box>
    </>
  );
}