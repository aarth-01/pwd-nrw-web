import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => navigate("/");

  const menuItems =
    role === "admin"
      ? [
          { text: "Dashboard", path: "/admin/dashboard" },
          { text: "Map", path: "/admin/map" },
          { text: "Summary", path: "/admin/summary" },
          { text: "Engineers", path: "/admin/add-engineer" },
        ]
      : [
          { text: "New Leakage", path: "/engineer/leakage-form" },
          { text: "Map", path: "/engineer/map" },
        ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>

          {/* Hamburger icon for mobile */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: { xs: 16, md: 20 },
            }}
          >
            DDW-NRW : Real Losses
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {menuItems.map(item => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => navigate(item.path)}
              >
                {item.text}
              </Button>
            ))}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
