import { Container, Typography } from "@mui/material";

export default function MapView() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Leakage Location Map</Typography>
      <Typography sx={{ mt: 2 }}>
        Click on the map to mark the leakage location.
      </Typography>
    </Container>
  );
}
