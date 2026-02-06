import {
  Button,
  TextField,
  Container,
  Typography,
  Box
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/backg-water.jpg";
import sideImage from "../assets/front-image.jpg";
import logo from "../assets/logo.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "viraj.patil@pwd.gov.in") {
      navigate("/admin/dashboard");
    } else {
      navigate("/engineer/leakage-form");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        /* water background */
        backgroundImage: `
          linear-gradient(rgba(0,60,90,0.6), rgba(0,60,90,0.6)),
          url(${bg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* simple row layout */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "white",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* ================= LOGIN (same style as your original) ================= */}
        <Container
          maxWidth="sm"
          sx={{
            width: 380,
            py: 6,
            textAlign: "center"
          }}
        >
            {/* ✅ LOGO ABOVE TITLE */}
          <Box sx={{ mb: 2 }}>
            <img
              src={logo}
              alt="VDASS AquaTrack Logo"
              style={{ width: 160 }}
            />
          </Box>

          
          <Typography variant="h5" color="primary" gutterBottom>
            Public Works Department
          </Typography>

          <Typography variant="subtitle2" gutterBottom>
            Drinking Water – NRW Management System
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </Container>

        {/* ================= RIGHT IMAGE ================= */}
        <Box
          sx={{
            width: 380,
            minHeight: 420,
            backgroundImage: `url(${sideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </Box>
    </Box>
  );
}
