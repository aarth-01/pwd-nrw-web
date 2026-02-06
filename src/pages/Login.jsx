import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";

import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
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
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          mr: 6,
          p: 3,
          width: 260,
          bgcolor: "rgba(255,255,255,0.75)",
          borderRadius: 4,
          backdropFilter: "blur(6px)"
        }}
      >
        <Typography fontWeight="bold" gutterBottom>
          WATER SAVING HEROES
        </Typography>

        <Typography variant="body2">✔ Fix Leaks</Typography>
        <Typography variant="body2">✔ Shorter Showers</Typography>
        <Typography variant="body2">✔ Efficient Gardening</Typography>
      </Box>

      {/* LOGIN CARD */}
      <Paper
        elevation={10}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 5,
          textAlign: "center",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Public Works Department
        </Typography>

        <Typography variant="body2" sx={{ mb: 4 }}>
          Drinking Water – NRW Management System
        </Typography>

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
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

        {/* Circular Login Button */}
        <Button
          onClick={handleLogin}
          sx={{
            mt: 4,
            width: 90,
            height: 90,
            borderRadius: "50%",
            fontWeight: "bold",
            bgcolor: "#1976d2",
            color: "#fff",
            "&:hover": {
              bgcolor: "#0d47a1",
              transform: "scale(1.05)"
            }
          }}
        >
          LOGIN
        </Button>
      </Paper>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          ml: 6,
          p: 3,
          width: 260,
          bgcolor: "rgba(255,255,255,0.75)",
          borderRadius: 4,
          backdropFilter: "blur(6px)",
          textAlign: "center"
        }}
      >
        <Typography fontWeight="bold" gutterBottom>
          OUR IMPACT
        </Typography>

        <Typography variant="body2">
          Together, we save water!
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Community Goal – 10% usage reduction
        </Typography>
      </Box>
    </Box>
  );
}
