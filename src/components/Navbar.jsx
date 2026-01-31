import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PWD – Drinking Water NRW System
        </Typography>

        {role === "admin" && (
          <>
            <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/admin/map")}>
              Map
            </Button>
            <Button color="inherit" onClick={() => navigate("/admin/summary")}>
              Summary
            </Button>
            <Button color="inherit" onClick={() => navigate("/admin/add-engineer")}>
              Engineers
            </Button>
          </>
        )}

        {role === "engineer" && (
          <>
            <Button color="inherit" onClick={() => navigate("/engineer/leakage-form")}>
              New Leakage
            </Button>
            <Button color="inherit" onClick={() => navigate("/engineer/map")}>
              Map
            </Button>
          </>
        )}

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
