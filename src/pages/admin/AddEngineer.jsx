import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

export default function AddEngineer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log(form);
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
          backgroundAttachment: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 4,
              backgroundColor: "rgba(255,255,255,0.97)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 1, color: "#1976d2" }}
            >
              Add Engineer
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
              Register new field engineers into the system
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              select
              label="Constituency"
              name="area"
              value={form.area}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >
              <MenuItem value="Margao">Margao</MenuItem>
              <MenuItem value="Fatorda">Fatorda</MenuItem>
              <MenuItem value="Benaulim">Benaulim</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Engineer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            >
              Add Engineer
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}