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
} from "@mui/material";

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

export default function RecentLeakages() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (!user) {
        console.log("No user logged in yet");
        return;
        }

        console.log("Current UID:", user.uid);

        const q = query(
        collection(db, "leakages"),
        where("engineerId", "==", user.uid),
        orderBy("timestamp", "desc")
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        console.log("Documents found:", snapshot.size);

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
        <Box
          sx={{
            background: "linear-gradient(90deg,#1e3c72,#2a5298)",
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            My Recent Leakages
          </Typography>
          <Typography>
            Department of Drinking Water — Real Loss Monitoring System
          </Typography>
        </Box>

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
                      {row.timestamp?.toDate
                        ? row.timestamp.toDate().toLocaleDateString()
                        : ""}
                    </TableCell>

                    <TableCell>{row.constituency}</TableCell>

                    <TableCell>
                      {row.location?.address || "N/A"}
                    </TableCell>

                    <TableCell>
                      {row.waterLoss || 0}
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