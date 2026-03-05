import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { updatePassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {

    try {

        const user = auth.currentUser;

        if (!user) {
        alert("Session expired. Please login again.");
        navigate("/");
        return;
        }

        await updatePassword(user, password);

        // Get user document directly using UID
        const userDocRef = doc(db, "users", user.uid);

        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
        alert("User document not found.");
        return;
        }

        const data = userDoc.data();

        // Update mustChangePassword
        await updateDoc(userDocRef, {
        mustChangePassword: false
        });

        alert("Password updated successfully");

        // Redirect based on role
        if (data.role === "admin") {
        navigate("/admin/dashboard");
        } else {
        navigate("/engineer/leakage-form");
        }

    } catch (error) {

        alert(error.message);

    }

    };

  return (
    <Container maxWidth="sm">

      <Box mt={10}>

        <Typography variant="h5" mb={3}>
          Change Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleChangePassword}
        >
          Update Password
        </Button>

      </Box>

    </Container>
  );
}