import {
  Container,
  Typography,
  Card,
  CardContent,
  Box
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import bg from "../../assets/bg-front.jpg";

export default function Success() {
  const locationState = useLocation();
  const { loss, minutes, location } = locationState.state || {};

  let message = "Leakage recorded successfully.";

  if (minutes <= 120) {
    message = "Quick action saved a lot of water 💧";
  } else if (minutes <= 720) {
    message = "Timely repair helped reduce water loss significantly.";
  } else {
    message =
      "If action was taken earlier, a large amount of water could have been saved.";
  }

  return (
    <>
      <Navbar role="engineer" />

      {/* ===== SAME BACKGROUND (NO BLUR) ===== */}
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

          // ⭐ overlay only, no blur
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.55)"
          }
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          
          {/* ===== CARD (no blur) ===== */}
          <Card
            elevation={12}
            sx={{
              borderRadius: 5,
              background: "rgba(255,255,255,0.95)",
              textAlign: "center",
              p: 5,
              minHeight: 320
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight={600}
                letterSpacing={1.2}
                color="primary"
                gutterBottom
              >
                ✅ Submission Successful
              </Typography>

              <Typography sx={{ mt: 2, fontSize: 17 }}>
                Estimated Water Lost:
                <br />
                <b style={{ fontSize: 20 }}>{loss.toFixed(2)} litres</b>
              </Typography>

              {location && (
                <Typography sx={{ mt: 2 }}>
                  📍 Location captured
                  <br />
                  Lat: {location.lat.toFixed(4)} | Lng:{" "}
                  {location.lng.toFixed(4)}
                </Typography>
              )}

              <Typography sx={{ mt: 3, fontStyle: "italic" }}>
                {message}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}