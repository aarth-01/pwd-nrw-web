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
          linear-gradient(rgba(0,90,130,0.35), rgba(0,90,130,0.35)),
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
          width: { xs: "95%", md: 950 },
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 8,
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* ================= LOGIN (same style as your original) ================= */}
        <Container
          sx={{
            flex: 1.2,
            py: 7,
            px: 6,
            textAlign: "center"
          }}
        >
            {/* ✅ LOGO ABOVE TITLE */}
           <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              width: 90,
              mb: 2
            }}
          />

          <Typography variant="h5" fontWeight="bold" color="primary">
            Public Works Department
          </Typography>

          <Typography variant="body2" sx={{ mb: 4 }}>
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
            size="large"
            sx={{ mt: 3, py: 1.3 }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </Container>

        {/* ================= RIGHT IMAGE ================= */}
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 260, md: 520 },
            backgroundImage: `url(${sideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </Box>
    </Box>
  );
}
