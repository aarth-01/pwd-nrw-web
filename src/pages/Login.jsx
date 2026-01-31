import { Button, TextField, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // TEMP role logic for demo
    if (email === "viraj.patil@pwd.gov.in") {
      navigate("/admin/dashboard");
    } else {
      navigate("/engineer/leakage-form");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
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
  );
}
