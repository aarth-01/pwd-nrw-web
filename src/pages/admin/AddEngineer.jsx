import { Container, Typography } from "@mui/material";

export default function AddEngineer() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Add Engineer</Typography>
      <Typography sx={{ mt: 2 }}>
        Admin can add new engineers here.
      </Typography>
    </Container>
  );
}
