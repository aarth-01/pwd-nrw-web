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
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
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

export default function RecentLeakages() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
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

          {/* MODERN BACK BUTTON */}
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

        {/* TABLE */}
        <TableContainer sx={{ flex: 1 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#eef2f7" }}>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Constituency</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>Estimated Loss (Litres)</b></TableCell>
                <TableCell><b>Latitude</b></TableCell>
                <TableCell><b>Longitude</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No leakages reported yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      {row.reportDate?.toDate
                        ? row.reportDate.toDate().toLocaleDateString()
                        : row.timestamp?.toDate
                        ? row.timestamp.toDate().toLocaleDateString()
                        : ""}
                    </TableCell>

                    <TableCell>{row.constituency}</TableCell>

                    <TableCell>
                      {row.location?.address || "N/A"}
                    </TableCell>

                    <TableCell>
                      {row.waterLoss.toFixed(2) || 0}
                    </TableCell>

                    <TableCell>
                      {row.location?.lat || "—"}
                    </TableCell>

                    <TableCell>
                      {row.location?.lng || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}