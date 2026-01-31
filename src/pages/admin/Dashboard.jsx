import { Container, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";


export default function Dashboard() {
  return (
    <>
      <Navbar role="admin" />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">PWD Admin Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>
            Monthly Water Loss | Leakage Count | Constituency Stats
        </Typography>
      </Container>
    </>
  );
}

