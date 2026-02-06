import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/backg-water.jpg";     // ✅ background
import sideImage from "../assets/front-image.jpg"; // ✅ RHS image

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

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
        p: 2,

        /* ✅ water background with dark overlay */
        backgroundImage: `
          linear-gradient(rgba(0,60,90,0.65), rgba(0,60,90,0.65)),
          url(${bg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* MAIN CONTAINER */}
      <Box
        sx={{
          display: "flex",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",

          /* responsive: stack on mobile */
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* ================= LEFT : LOGIN ================= */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: 320, md: 420 },
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "rgba(255,255,255,0.95)"
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Public Works Department
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Government of Goa • NRW Monitoring System
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Official Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPass ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)}>
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              mt: 4,
              height: 48,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "#0b5ed7",
              "&:hover": {
                bgcolor: "#084298"
              }
            }}
          >
            Secure Login
          </Button>

          <Typography
            variant="caption"
            sx={{ mt: 3, textAlign: "center", color: "gray" }}
          >
            Authorized personnel only
          </Typography>
        </Paper>

        {/* ================= RIGHT : IMAGE ================= */}
        <Box
          sx={{
            width: { xs: 320, md: 420 },
            minHeight: 520,
            backgroundImage: `url(${sideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.95)"
          }}
        />
      </Box>
    </Box>
  );
}
