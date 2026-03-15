import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function getMonthLabel(row) {
  const date = row.reportDate?.toDate
    ? row.reportDate.toDate()
    : row.timestamp?.toDate
    ? row.timestamp.toDate()
    : null;

  if (!date) return "Unknown Month";

  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

function groupByMonth(data) {
  const groups = {};
  const order = [];

  data.forEach((row) => {
    const label = getMonthLabel(row);
    if (!groups[label]) {
      groups[label] = [];
      order.push(label);
    }
    groups[label].push(row);
  });

  return order.map((label) => ({ label, rows: groups[label] }));
}

export default function RecentLeakages() {
  const [data, setData] = useState([]);
  const [authReady, setAuthReady] = useState(false); // ← tracks if Firebase Auth has initialized
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      
      setAuthReady(true); // ← Auth has resolved (user is either logged in or null)

      if (!user) return;

      const q = query(
        collection(db, "leakages"),
        where("engineerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const leakages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(leakages);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const grouped = groupByMonth(data);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", background: "#f4f6f9" }}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 0,
          boxShadow: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: "linear-gradient(90deg,#1e3c72,#2a5298)",
            color: "white",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              My Recent Leakages
            </Typography>
            <Typography>
              Department of Drinking Water — Real Loss Monitoring System
            </Typography>
          </Box>

          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/engineer/leakage-form")}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "white",
                color: "#1e3c72",
                transform: "translateY(-2px)",
              },
            }}
          >
            BACK
          </Button>
        </Box>

        {/* LOADING STATE — shown while Firebase Auth is initializing on refresh */}
        {!authReady && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, color: "#888" }}>Loading your records...</Typography>
          </Box>
        )}

        {/* TABLE — only rendered after auth is confirmed */}
        {authReady && (
          <TableContainer sx={{ flex: 1 }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ backgroundColor: "#eef2f7" }}>
                <TableRow>
                  <TableCell><b>#</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Constituency</b></TableCell>
                  <TableCell sx={{ minWidth: 220 }}><b>Address</b></TableCell>
                  <TableCell><b>Estimated Loss (Litres)</b></TableCell>
                  <TableCell><b>Latitude</b></TableCell>
                  <TableCell><b>Longitude</b></TableCell>
                  <TableCell><b>Plumber Name</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No leakages reported yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  grouped.map(({ label, rows }) => (
                    <React.Fragment key={label}>
                      <TableRow key={label}>
                        <TableCell
                          colSpan={8}
                          sx={{
                            backgroundColor: "#1e3c72",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 14,
                            py: 1,
                            px: 2,
                          }}
                        >
                          {label}
                        </TableCell>
                      </TableRow>

                      {rows.map((row, index) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{index + 1}</TableCell>

                          <TableCell>
                            {row.reportDate?.toDate
                              ? row.reportDate.toDate().toLocaleDateString()
                              : row.timestamp?.toDate
                              ? row.timestamp.toDate().toLocaleDateString()
                              : ""}
                          </TableCell>

                          <TableCell>{row.constituency}</TableCell>

                          <TableCell sx={{ minWidth: 220, whiteSpace: "normal", lineHeight: 1.4 }}>
                            {row.location?.address || "N/A"}
                          </TableCell>

                          <TableCell>
                            {row.waterLoss != null
                              ? row.waterLoss.toFixed(2)
                              : "0.00"}
                          </TableCell>

                          <TableCell>{row.location?.lat || "—"}</TableCell>

                          <TableCell>{row.location?.lng || "—"}</TableCell>

                          <TableCell>{row.plumberName || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}