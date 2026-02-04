import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Stack
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleLogin = () => {
    // TEMP role logic for demo
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #081b3a, #0b6fa3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        {/* Glass container */}
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px rgba(0,0,0,0.3)",
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
            sx={{ color: "#fff", mb: 3 }}
          >
            Smart Water Analytics and NRW Intelligence
          </Typography>

          {/* Login Card */}
          <Box
            sx={{
              background: "rgba(255,255,255,0.9)",
              p: 3,
              borderRadius: 3
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

            {/* OTP */}
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
                borderRadius: 6,
                py: 1.2,
                background:
                  "linear-gradient(135deg, #00c6ff, #0072ff)"
              }}
              onClick={handleLogin}
            >
              LOGIN SECURELY
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ color: "#dbeafe", mt: 2, display: "block" }}
          >
            PWD · Government of Goa
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

