import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery
} from "@mui/material";

import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import bg from "../../assets/bg-front.jpg";

const auth = getAuth();

const saveOfflineLeakage = (data) => {
  const queue = JSON.parse(localStorage.getItem("offlineLeakages")) || [];
  queue.push(data);
  localStorage.setItem("offlineLeakages", JSON.stringify(queue));
};

export default function LeakageForm() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const locationData = useLocation();
  const selectedLocation = locationData.state?.location || null;

  const [address, setAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    constituency: "",
    leakageType: "",
    pipelineType: "",
    days: "",
    hours: "",
    lpm: "",
    pressure: "",
    diameter: "",
    plumberName: "",
    attendedBy: "",
    damagedByAgency: "",
    agencyName: "" 
  });

  const [errors, setErrors] = useState({});

  const numericFields = ["days", "hours", "lpm", "pressure", "diameter"];

  const handleNumericChange = (e) => {

    const { name, value } = e.target;

    // Allow empty value
    if (value === "") {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
      return;
    }

    // Only allow numbers
    if (!/^[0-9]+$/.test(value)) {

      setErrors({
        ...errors,
        [name]: "Only numeric values allowed"
      });

      return;
    }

    setFormData({ ...formData, [name]: value });

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= AUTO GPS CAPTURE (MOBILE ONLY) ================= */

  useEffect(() => {
    if (!isMobile) return;
    if (selectedLocation) return;

    if (!navigator.geolocation) return;

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        navigate("/engineer/leakage-form", {
          state: { location: coords },
          replace: true,
        });

        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { enableHighAccuracy: true }
    );
  }, [isMobile]);

  /* ================= REVERSE GEOCODING ================= */

  useEffect(() => {
    if (!selectedLocation) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
        );
        const data = await res.json();
        setAddress(data.display_name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddress();
  }, [selectedLocation]);

  /* ================= SUBMIT ================= */

  const validateFields = () => {

    let newErrors = {};

    const requiredFields = [
      "date",
      "constituency",
      "leakageType",
      "pipelineType",
      "days",
      "hours",
      "lpm",
      "pressure",
      "diameter",
      "plumberName",
      "attendedBy",
      "damagedByAgency"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.damagedByAgency === "Yes" && !formData.agencyName) {
      newErrors.agencyName = "Agency Name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {

    if (!validateFields()) {
      return;
    }
    try {

      const UID = auth.currentUser.uid;

      
      const totalMinutes =
        Number(formData.days || 0) * 1440 +
        Number(formData.hours || 0) * 60;

      const adjustedFlow =
        Number(formData.lpm || 0) *
        Math.sqrt(Number(formData.pressure || 0)) *
        (Number(formData.diameter || 0) / 2);

      const estimatedLoss = adjustedFlow * totalMinutes;

      const leakageData = {
        engineerId: UID,
        ...formData,
        durationMinutes: totalMinutes,
        lpm: Number(formData.lpm || 0),
        location: selectedLocation
          ? {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              address: address || "",
            }
          : null,
        waterLoss: estimatedLoss,
        timestamp: new Date(),
      };

      if (navigator.onLine) {

        await addDoc(collection(db, "leakages"), {
          ...leakageData,
          timestamp: serverTimestamp(),
        });

      } else {

        saveOfflineLeakage(leakageData);

        alert("No internet. Leakage saved offline and will sync later.");
      }

      navigate("/engineer/success", {
        state: {
          loss: estimatedLoss,
          minutes: totalMinutes,
          location: selectedLocation,
        },
      });

    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  };

 /* ================= MOBILE UI ================= */

if (isMobile) {
  return (
    <>
      <Navbar role="engineer" />

      <Box sx={{ minHeight: "100vh", background: "#f4f6f9", pb: 10 }}>
        <Container maxWidth="sm" sx={{ pt: 2 }}>

          <Typography variant="h6" textAlign="center" mb={2}>
            Leakage Entry
          </Typography>

          {loadingLocation && (
            <Typography sx={{ fontSize: 13, color: "blue" }}>
              📍 Capturing location...
            </Typography>
          )}

          {selectedLocation && (
            <Typography sx={{ fontSize: 13, color: "green", mb: 1 }}>
              📍 {address || "Fetching address..."}
            </Typography>
          )}

          <Button
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onClick={() => navigate("/engineer/map")}
          >
            Adjust Location on Map
          </Button>

          {/* Date */}
          <TextField
            fullWidth
            type="date"
            size="small"
            margin="dense"
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Constituency */}
          <TextField
            select
            fullWidth
            size="small"
            margin="dense"
            label="Constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
            error={!!errors.constituency}
            helperText={errors.constituency}
          >
            <MenuItem value="Margao">Margao</MenuItem>
            <MenuItem value="Fatorda">Fatorda</MenuItem>
            <MenuItem value="Benaulim">Benaulim</MenuItem>
          </TextField>

          {/* Leakage Type */}
          <TextField
            select
            fullWidth
            size="small"
            margin="dense"
            label="Leakage Type"
            name="leakageType"
            value={formData.leakageType}
            onChange={handleChange}
            error={!!errors.leakageType}
            helperText={errors.leakageType}
          >
            <MenuItem value="Breakdown">Breakdown</MenuItem>
            <MenuItem value="Corrosion">Corrosion</MenuItem>
            <MenuItem value="Manmade">Man-made</MenuItem>
            <MenuItem value="Aging">Aging</MenuItem>
          </TextField>

          {/* Pipeline Type */}
          <TextField
            select
            fullWidth
            size="small"
            margin="dense"
            label="Pipeline Type"
            name="pipelineType"
            value={formData.pipelineType}
            onChange={handleChange}
            error={!!errors.pipelineType}
            helperText={errors.pipelineType}
          >
            <MenuItem value="GI">GI</MenuItem>
            <MenuItem value="PVC">PVC</MenuItem>
            <MenuItem value="OPVC">OPVC</MenuItem>
            <MenuItem value="AC">AC</MenuItem>
            <MenuItem value="DI">DI</MenuItem>
            <MenuItem value="HDPE">HDPE</MenuItem>

          </TextField>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Days"
              name="days"
              type="number"
              value={formData.days}
              onChange={handleNumericChange}
              error={!!errors.days}
              helperText={errors.days}
            />

            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Hours"
              name="hours"
              type="number"
              value={formData.hours}
              onChange={handleNumericChange}
              error={!!errors.hours}
              helperText={errors.hours}
            />
          </Box>

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="LPM"
            name="lpm"
            type="number"
            value={formData.lpm}
            onChange={handleNumericChange}
            error={!!errors.lpm}
            helperText={errors.lpm}
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Water Pressure (kgs)"
            name="pressure"
            value={formData.pressure}
            onChange={handleNumericChange}
            error={!!errors.pressure}
            helperText={errors.pressure}
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Diameter (inches)"
            name="diameter"
            value={formData.diameter}
            onChange={handleNumericChange}
            error={!!errors.diameter}
            helperText={errors.diameter}
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Plumber Name"
            name="plumberName"
            value={formData.plumberName}
            onChange={handleChange}
            error={!!errors.plumberName}
            helperText={errors.plumberName}
          />

          <TextField
            select
            fullWidth
            size="small"
            margin="dense"
            label="Attended By"
            name="attendedBy"
            value={formData.attendedBy}
            onChange={handleChange}
            error={!!errors.attendedBy}
            helperText={errors.attendedBy}
          >
            <MenuItem value="Department">Department</MenuItem>
            <MenuItem value="External Agency">External Agency</MenuItem>
          </TextField>

          <FormControl sx={{ mt: 1 }}>
            <FormLabel>Damage Caused By Other Agencies?</FormLabel>

            {formData.damagedByAgency === "Yes" && (

              <TextField
                select
                fullWidth
                size="small"
                margin="dense"
                label="Agency Name"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                error={!!errors.agencyName}
                helperText={errors.agencyName}
              >

                <MenuItem value="PWD">PWD</MenuItem>
                <MenuItem value="Electricity Dept">Electricity Dept</MenuItem>
                <MenuItem value="Telecom">Telecom</MenuItem>
                <MenuItem value="Road Contractor">Road Contractor</MenuItem>
                <MenuItem value="Sewerage Dept">Sewerage Dept</MenuItem>
                <MenuItem value="Other">Other</MenuItem>

              </TextField>
            )}

            <RadioGroup
              row
              name="damagedByAgency"
              value={formData.damagedByAgency}
              onChange={handleChange}
              error={!!errors.damagedByAgency}
              helperText={errors.damagedByAgency}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

        </Container>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
            backgroundColor: "#fff",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            Submit Leakage
          </Button>
        </Box>
      </Box>
    </>
  );
}

/* ================= DESKTOP UI ================= */

return (
<>
<Navbar role="engineer" />

<Box
sx={{
minHeight: "100vh",
fontFamily: "'Poppins', sans-serif",
backgroundImage: `url(${bg})`,
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
display: "flex",
alignItems: "center",
justifyContent: "center",
p: 3,
position: "relative",
"&::before": {
content: '""',
position: "absolute",
inset: 0,
bgcolor: "rgba(255,255,255,0.55)"
}
}}
>
<Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
<Paper
elevation={10}
sx={{
p: 4,
borderRadius: 4,
background: "rgba(255,255,255,0.95)"
}}
>

<Typography
variant="h5"
fontWeight={600}
letterSpacing={1.5}
textAlign="center"
sx={{ mb: 3 }}
>
LEAKAGE ENTRY FORM
</Typography>

{selectedLocation && (
<Typography color="green" sx={{ mb: 2 }}>
📍 {address || "Fetching address..."}
</Typography>
)}

<Box sx={{ display: "flex", justifyContent: "left", mt: 2 }}>
<Button
variant="contained"
size="small"
sx={{
borderRadius: 2,
textTransform: "none",
px: 2,
py: 0.8,
backgroundColor: "#4FC3F7",
"&:hover": {
backgroundColor: "#29B6F6"
}
}}
onClick={() => navigate("/engineer/map")}
>
Mark Location on Map
</Button>
</Box>

<TextField
fullWidth
type="date"
label="Date"
name="date"
margin="normal"
value={formData.date}
onChange={handleChange}
InputLabelProps={{ shrink: true }}
/>

<TextField select fullWidth label="Constituency" name="constituency" margin="normal" onChange={handleChange}>
<MenuItem value="Margao">Margao</MenuItem>
<MenuItem value="Fatorda">Fatorda</MenuItem>
<MenuItem value="Benaulim">Benaulim</MenuItem>
</TextField>

<TextField select fullWidth label="Leakage Type" name="leakageType" margin="normal" onChange={handleChange}>
<MenuItem value="Breakdown">Breakdown</MenuItem>
<MenuItem value="Corrosion">Corrosion</MenuItem>
<MenuItem value="Manmade">Man-made</MenuItem>
<MenuItem value="Aging">Aging</MenuItem>
</TextField>

<TextField fullWidth label="Pipeline Type (GI / PVC etc)" name="pipelineType" margin="normal" onChange={handleChange} />

<Box sx={{ display: "flex", gap: 2 }}>
<TextField fullWidth label="Days" name="days" margin="normal" onChange={handleNumericChange} error={!!errors.days} helperText={errors.days}/>
<TextField fullWidth label="Hours" name="hours" margin="normal" onChange={handleNumericChange} error={!!errors.hours} helperText={errors.hours}/>
</Box>

<TextField fullWidth label="Litres per minute (LPM)" name="lpm" margin="normal" onChange={handleNumericChange} error={!!errors.lpm} helperText={errors.lpm}/>
<TextField fullWidth label="Water Pressure" name="pressure" margin="normal" onChange={handleNumericChange} error={!!errors.pressure} helperText={errors.pressure}/>
<TextField fullWidth label="Diameter" name="diameter" margin="normal" onChange={handleNumericChange} error={!!errors.diameter} helperText={errors.diameter}/>
<TextField fullWidth label="Plumber / Meter Reader Name" name="plumberName" margin="normal" onChange={handleChange} />
<TextField
  select
  fullWidth
  label="Attended By"
  name="attendedBy"
  margin="normal"
  value={formData.attendedBy}
  onChange={handleChange}
>
  <MenuItem value="Department">Department</MenuItem>
  <MenuItem value="External Agency">External Agency</MenuItem>
</TextField>

<FormControl margin="normal">
  <FormLabel>Damage Caused By Other Agencies?</FormLabel>

  {formData.damagedByAgency === "Yes" && (

    <TextField
      select
      fullWidth
      label="Agency Name"
      name="agencyName"
      margin="normal"
      value={formData.agencyName}
      onChange={handleChange}
    >

      <MenuItem value="PWD">PWD</MenuItem>
      <MenuItem value="Electricity Dept">Electricity Dept</MenuItem>
      <MenuItem value="Telecom">Telecom</MenuItem>
      <MenuItem value="Road Contractor">Road Contractor</MenuItem>
      <MenuItem value="Sewerage Dept">Sewerage Dept</MenuItem>
      <MenuItem value="Other">Other</MenuItem>

    </TextField>

  )}

  <RadioGroup
    row
    name="damagedByAgency"
    value={formData.damagedByAgency}
    onChange={handleChange}
  >
    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
    <FormControlLabel value="No" control={<Radio />} label="No" />
  </RadioGroup>
</FormControl>

<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
<Button
variant="contained"
size="small"
onClick={handleSubmit}
sx={{
borderRadius: 2,
fontWeight: 600,
px: 4,
py: 1
}}
>
Submit
</Button>
</Box>

</Paper>
</Container>
</Box>
</>
);
}