import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
} from "@mui/material";

import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

export default function AddEngineer() {
  const [showForm, setShowForm] = useState(false);
  const [engineers, setEngineers] = useState([
    { id: 1, name: "Ravi Naik", email: "ravi@gmail.com", constituency: "Margao" },
    { id: 2, name: "Suresh Patil", email: "suresh@gmail.com", constituency: "Fatorda" },
    { id: 3, name: "Anita Dessai", email: "anita@gmail.com", constituency: "Benaulim" },
  ]);

  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = (id) => {
    setEngineers(engineers.filter((eng) => eng.id !== id));
    setSuccessMessage("Engineer deleted successfully!");

    // Hide message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          pt: 12,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow: 5,
            }}
          >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {showForm ? "Add Engineers" : "Engineer Details"}
              </Typography>

              <Button
                variant="contained"
                onClick={() => setShowForm(!showForm)}
                sx={{
                  backgroundColor: "#0D47A1",
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#08306B" },
                }}
              >
                {showForm ? "View Engineers" : "Add Engineer"}
              </Button>
            </Box>

            {/* TABLE */}
            {!showForm && (
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0D47A1" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr No.</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Constituency</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {engineers.map((eng, index) => (
                    <TableRow key={eng.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{eng.name}</TableCell>
                      <TableCell>{eng.email}</TableCell>
                      <TableCell>{eng.constituency}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(eng.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* FORM */}
            {showForm && (
              <Box component="form" sx={{ maxWidth: 500, mx: "auto" }}>
                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Constituency*</Typography>
                <TextField fullWidth select margin="normal" required>
                  <MenuItem value="Margao">Margao</MenuItem>
                  <MenuItem value="Fatorda">Fatorda</MenuItem>
                  <MenuItem value="Benaulim">Benaulim</MenuItem>
                </TextField>

                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Name*</Typography>
                <TextField fullWidth margin="normal" required />

                <Typography sx={{ fontWeight: "bold", mt: 2 }}>Email*</Typography>
                <TextField fullWidth type="email" margin="normal" required />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 4,
                    py: 1.5,
                    fontSize: 16,
                    backgroundColor: "#0D47A1",
                    "&:hover": { backgroundColor: "#08306B" },
                  }}
                >
                  Submit
                </Button>
              </Box>
            )}
          </Paper>
        </Container>

        {/* Success message at bottom */}
        {successMessage && (
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              width: "auto",
              zIndex: 9999,
            }}
          >
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}
      </Box>
    </>
  );
}