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
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function RecentLeakages() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "leakages"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leakages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(leakages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ height: "100vh", width: "100%", background: "#f4f6f9" }}>
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
            Recent Leakages Report
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
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Estimated Loss</b></TableCell>
                <TableCell><b>Latitude</b></TableCell>
                <TableCell><b>Longitude</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {row.date?.toDate
                      ? row.date.toDate().toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{row.constituency}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.waterLost}</TableCell>
                  <TableCell>{row.lat}</TableCell>
                  <TableCell>{row.lng}</TableCell>
                  <TableCell sx={{ color: "green", fontWeight: "bold" }}>
                    {row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}