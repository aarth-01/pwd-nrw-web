import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function LeakageForm() {
  const navigate = useNavigate();
  const locationData = useLocation();

  const [formData, setFormData] = useState({
    constituency: "",
    leakageType: "",
    pipelineType: "",
    days: "",
    hours: "",
    minutes: "",
    pipeSize: "",
    pressure: "",
    plumberName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    
    const geoLocation = locationData.state?.location || null;


    const totalMinutes =
      Number(formData.days) * 1440 +
      Number(formData.hours) * 60 +
      Number(formData.minutes);

    const estimatedLoss = totalMinutes * 50; // 50 litres per minute (assumed)

    navigate("/engineer/success", {
      state: {
        loss: estimatedLoss,
        minutes: totalMinutes,
        location: geoLocation,
      },
    });
  };

  return (
    <>
      <Navbar role="engineer" />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Leakage Entry Form
        </Typography>

        <TextField
          select
          fullWidth
          label="Constituency"
          name="constituency"
          margin="normal"
          onChange={handleChange}
        >
          <MenuItem value="Margao">Margao</MenuItem>
          <MenuItem value="Fatorda">Fatorda</MenuItem>
          <MenuItem value="Benaulim">Benaulim</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Leakage Type"
          name="leakageType"
          margin="normal"
          onChange={handleChange}
        >
          <MenuItem value="Breakdown">Breakdown</MenuItem>
          <MenuItem value="Corrosion">Corrosion</MenuItem>
          <MenuItem value="Manmade">Man-made</MenuItem>
          <MenuItem value="Aging">Aging</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Pipeline Type (GI / PVC etc)"
          name="pipelineType"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Duration (Days)"
          name="days"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Duration (Hours)"
          name="hours"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Duration (Minutes)"
          name="minutes"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Pipe Leakage Size (cm / inch)"
          name="pipeSize"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Water Pressure"
          name="pressure"
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Plumber / Meter Reader Name"
          name="plumberName"
          margin="normal"
          onChange={handleChange}
        />

        <Button variant="outlined" sx={{ mt: 2 }}>
          Mark Location on Map
        </Button>

        <Button
          variant="contained"
          sx={{ mt: 2, ml: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Container>
    </>
  );
}
