import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import bg from "../../assets/LBB.jpg";

export default function AddEngineer() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 10,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255,255,255,0.85)",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add Engineer
        </Typography>

        <Box component="form">
          
          {/* Constituency */}
          <Typography sx={{ fontWeight: "bold", mt: 2 }}>
            Constituency
          </Typography>
          <TextField
            fullWidth
            select
            margin="normal"
            required
          >
            <MenuItem value="Margao">Margao</MenuItem>
            <MenuItem value="Fatorda">Fatorda</MenuItem>
            <MenuItem value="Benaulim">Benaulim</MenuItem>
          </TextField>

          {/* Name */}
          <Typography sx={{ fontWeight: "bold", mt: 2 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            required
          />

          {/* Email */}
          <Typography sx={{ fontWeight: "bold", mt: 2 }}>
            Email
          </Typography>
          <TextField
            fullWidth
            type="email"
            margin="normal"
            required
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "#0D47A1",
              "&:hover": {
                backgroundColor: "#08306B",
              },
            }}
          >
            Submit
          </Button>

        </Box>
      </Container>
    </Box>
  );
}