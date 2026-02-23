import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const drawerWidth = collapsed ? 60 : 180;

  const handleLogout = () => navigate("/");

  /* ---------------- ADMIN MENU (UNCHANGED) ---------------- */
  const adminMenu = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Map", path: "/admin/map", icon: <MapIcon /> },
    { text: "Summary", path: "/admin/summary", icon: <AssessmentIcon /> },
    { text: "Engineers", path: "/admin/add-engineer", icon: <EngineeringIcon /> },
  ];

  /* ---------------- ENGINEER MENU (TOP ONLY) ---------------- */
  const engineerMenu = [
    { text: "New Leakage", path: "/engineer/leakage-form" },
    { text: "Map", path: "/engineer/map" },
  ];

  return (
    <>
      {/* TOP APPBAR */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 1 }}>
            DDW-NRW : Real Losses
          </Typography>

          {/* ENGINEER TOP MENU */}
          {role === "engineer" && (
            <>
              {engineerMenu.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  sx={{
                    fontWeight:
                      activeTab === item.path ? "bold" : "normal",
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.text}
                </Button>
              ))}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* ADMIN SIDEBAR (NO CHANGES MADE) */}
      {role === "admin" && (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              transition: "width 0.3s ease",
              overflowX: "hidden",
              background: "linear-gradient(180deg, #1e3c72, #2a5298)",
              color: "#fff",
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "4px 0 12px rgba(0,0,0,0.25)",
            },
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: collapsed ? "center" : "flex-end",
                p: 1,
              }}
            >
              <IconButton
                onClick={() => setCollapsed(!collapsed)}
                sx={{ color: "#fff" }}
              >
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>

            <List>
              {adminMenu.map((item) => {
                const isActive = activeTab === item.path;

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        py: 1.5,
                        px: collapsed ? 1 : 2,
                        justifyContent: collapsed ? "center" : "flex-start",
                        borderRadius: 2,
                        mx: 1,
                        mb: 1,
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.25)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.15)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: "#fff",
                          minWidth: collapsed ? 0 : 36,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      {!collapsed && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: isActive ? "bold" : "normal",
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box sx={{ p: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: "rgba(255,0,0,0.85)",
                "&:hover": {
                  backgroundColor: "rgba(255,0,0,1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: collapsed ? 0 : 36,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
              )}
            </ListItemButton>
          </Box>
        </Drawer>
      )}
    </>
  );
}