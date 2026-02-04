import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 5,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-4px)"
            }
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
            textAlign="center"
          >
            💧 Public Works Department
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mb: 4, opacity: 0.8 }}
          >
            Drinking Water – NRW Management System
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
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
                  <Lock color="primary" />
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
            size="large"
            sx={{
              mt: 4,
              py: 1.6,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
            }}
            onClick={handleLogin}
          >
            Login Securely
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}