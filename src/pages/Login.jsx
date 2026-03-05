import {
  Button,
  TextField,
  Container,
  Typography,
  Box
} from "@mui/material";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/bg-front.jpg";
import sideImage from "../assets/front-image .jpg";
import logo from "../assets/logo.jpg";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      // 🔐 Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // 📄 Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        alert("User role not configured.");
        return;
      }

      const userData = userDoc.data();
      const role = userData.role;

      // 🔒 Force password change
      if (userData.mustChangePassword) {

        navigate("/change-password");
        return;

      }

      // 🚦 Redirect based on role
      if (role === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/engineer/leakage-form");

      }

    } catch (error) {

      alert(error.message);

    }

  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `
          linear-gradient(rgba(0,90,130,0.35), rgba(0,90,130,0.35)),
          url(${bg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >

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

        {/* LOGIN FORM */}

        <Container
          sx={{
            flex: 1.2,
            py: 7,
            px: 6,
            textAlign: "center"
          }}
        >

          <Box
            component="img"
            src={logo}
            alt="PWD Logo"
            sx={{
              width: { xs: 180, md: 240 },
              height: "auto",
              mb: 2,
              mx: "auto",
              display: "block"
            }}
          />

          <Typography variant="h5" fontWeight="bold" color="primary">
            NRW Real Loss Management System
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

        {/* RIGHT IMAGE */}

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