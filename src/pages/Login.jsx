import {
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Paper
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "viraj.patil@pwd.gov.in") {
      navigate("/admin/dashboard");
    } else {
      navigate("/engineer/leakage-form");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #081b3a, #0b6fa3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Glass Effect */}
      <Box
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          textAlign: "center"
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "#bde9ff", mb: 1 }}
        >
          Government of Goa · Smart Water
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "#ffffff", mb: 3 }}
        >
          Smart Water Analytics and NRW Intelligence
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "rgba(255,255,255,0.92)"
          }}
        >
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

          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            sx={{ my: 2 }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(e.target.value, index)
                }
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", fontSize: 18 }
                }}
                sx={{ width: 55 }}
              />
            ))}
          </Stack>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 6,
              background:
                "linear-gradient(135deg, #00c6ff, #0072ff)"
            }}
            onClick={handleLogin}
          >
            LOGIN SECURELY
          </Button>
        </Paper>

        <Typography
          variant="caption"
          sx={{ color: "#dbeafe", mt: 2, display: "block" }}
        >
          PWD · Government of Goa
        </Typography>
      </Box>
    </Box>
  );
}


