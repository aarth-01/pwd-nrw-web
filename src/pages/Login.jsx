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
import bg from "../assets/backg-water.jpg";

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
        justifyContent: "flex-start",
        pl: { xs: 3, md: 10 },

        /* Background with professional dark overlay */
        backgroundImage: `
          linear-gradient(
            rgba(0,60,90,0.75),
            rgba(0,60,90,0.75)
          ),
          url(${bg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* LOGIN CARD */}
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,

          /* Glassmorphism professional look */
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
      >
        {/* Header */}
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

        {/* Professional Button (full width) */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            mt: 4,
            height: 48,
            borderRadius: 2,
            fontWeight: "bold",
            fontSize: "15px",
            textTransform: "none",
            bgcolor: "#0b5ed7",
            "&:hover": {
              bgcolor: "#084298"
            }
          }}
        >
          Secure Login
        </Button>

        {/* Footer text */}
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 3, textAlign: "center", color: "gray" }}
        >
          Authorized personnel only
        </Typography>
      </Paper>
    </Box>
  );
}
