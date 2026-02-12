import { Box, Container, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import bg from "../../assets/LBB.jpg";

export default function Dashboard() {
  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          pt: 4,
        }}
      >
        <Container
          sx={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 2,
            p: 3,
            mt: 4,
          }}
        >
          <Typography variant="h5">
            PWD Admin Dashboard
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Monthly Water Loss | Leakage Count | Constituency Stats
          </Typography>
        </Container>
      </Box>
    </>
  );
}