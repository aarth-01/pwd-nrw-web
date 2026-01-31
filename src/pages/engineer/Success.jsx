import { Container, Typography, Card, CardContent } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Success() {
  const location = useLocation();
  const { loss, minutes } = location.state || {};

  let message = "Leakage recorded successfully.";

  if (minutes <= 120) {
    message = "Quick action saved a lot of water 💧";
  } else if (minutes <= 720) {
    message =
      "Timely repair helped reduce water loss significantly.";
  } else {
    message =
      "If action was taken earlier, a large amount of water could have been saved.";
  }

  return (
    <>
      <Navbar role="engineer" />
      <Container sx={{ mt: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" color="primary">
              Submission Successful
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Estimated Water Lost: <b>{loss} litres</b>
            </Typography>

            <Typography sx={{ mt: 2 }}>{message}</Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
