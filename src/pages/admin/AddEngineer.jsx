import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function AddEngineer() {
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [engineers, setEngineers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    constituency: "",
  });

  // 🔥 FETCH ENGINEERS FROM FIRESTORE
  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "engineer")
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEngineers(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 ADD ENGINEER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "users"), {
        ...formData,
        role: "engineer",
        createdAt: serverTimestamp(),
      });

      setFormData({ name: "", email: "", constituency: "" });
      setShowForm(false);
      fetchEngineers();

    } catch (error) {
      console.log(error);
    }
  };

  // OPEN CONFIRM DIALOG
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  // 🔥 DELETE ENGINEER
  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", deleteId));

      setOpenDialog(false);
      setSuccessMsg(true);
      fetchEngineers();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          pt: 12,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow: 5,
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {showForm ? "ADD ENGINEER" : "ENGINEER DETAILS"}
              </Typography>

              <Button
                variant="contained"
                onClick={() => setShowForm(!showForm)}
                sx={{
                  backgroundColor: "#0D47A1",
                  "&:hover": { backgroundColor: "#08306B" },
                }}
              >
                {showForm ? "View Engineers" : "Add Engineer"}
              </Button>
            </Box>

            {!showForm && (
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0D47A1" }}>
                    <TableCell sx={{ color: "white" }}>Sr No.</TableCell>
                    <TableCell sx={{ color: "white" }}>Name</TableCell>
                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                    <TableCell sx={{ color: "white" }}>Constituency</TableCell>
                    <TableCell sx={{ color: "white" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {engineers.map((eng, index) => (
                    <TableRow key={eng.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{eng.name}</TableCell>
                      <TableCell>{eng.email}</TableCell>
                      <TableCell>{eng.constituency}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(eng.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {showForm && (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  maxWidth: 500,
                  mx: "auto",
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#1e3c72",
                  }}
                >
                  Add Engineer
                </Typography>

                <TextField
                  fullWidth
                  select
                  margin="normal"
                  required
                  label="Constituency"
                  name="constituency"
                  value={formData.constituency}
                  onChange={handleChange}
                >
                  <MenuItem value="Margao">Margao</MenuItem>
                  <MenuItem value="Fatorda">Fatorda</MenuItem>
                  <MenuItem value="Benaulim">Benaulim</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  margin="normal"
                  required
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  type="email"
                  margin="normal"
                  required
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 4,
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: "bold",
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #1e3c72, #2a5298)",
                  }}
                >
                  Submit
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this engineer?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          Deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}