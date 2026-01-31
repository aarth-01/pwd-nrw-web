import { Container, Typography } from "@mui/material";

export default function Summary() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Weekly / Monthly Summary</Typography>
      <Typography sx={{ mt: 2 }}>
        Summary of water loss and leakages will appear here.
      </Typography>
    </Container>
  );
}
