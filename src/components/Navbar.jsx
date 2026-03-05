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
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useTheme, useMediaQuery } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuIcon from "@mui/icons-material/Menu";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);

  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {

    setActiveTab(location.pathname);

    const syncOfflineData = async () => {

      const queue = JSON.parse(localStorage.getItem("offlineLeakages")) || [];

      if (queue.length === 0) return;

      try {

        for (const item of queue) {
          await addDoc(collection(db, "leakages"), item);
        }

        localStorage.removeItem("offlineLeakages");

        console.log("Offline leakages synced successfully");

      } catch (error) {

        console.log("Sync failed:", error);

      }
    };

    window.addEventListener("online", syncOfflineData);

    return () => {
      window.removeEventListener("online", syncOfflineData);
    };

  }, [location.pathname]);

  const drawerWidth = collapsed ? 60 : 180;

  const handleLogout = () => navigate("/");

  /* ---------------- ADMIN MENU ---------------- */
  const adminMenu = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Map", path: "/admin/map", icon: <MapIcon /> },
    { text: "Summary", path: "/admin/summary", icon: <AssessmentIcon /> },
    { text: "Engineers", path: "/admin/add-engineer", icon: <EngineeringIcon /> },
  ];

  /* ---------------- ENGINEER MENU ---------------- */
  const engineerMenu = [
    { text: "New Leakage", path: "/engineer/leakage-form" },
    { text: "Map", path: "/engineer/map" },
    { text: "Recent Leakages", path: "/engineer/recent-leakages" },
  ];

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #1e3c72, #2a5298)",
        }}
      >
        <Toolbar>

          {/* MOBILE ADMIN MENU BUTTON */}
          {role === "admin" && isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              letterSpacing: 1,
              fontSize: isMobile ? 18 : 20
            }}
          >
            {isMobile ? "DDW-NRW" : "DDW-NRW : Real Losses"}
          </Typography>

          {/* ENGINEER MENU */}
          {role === "engineer" && (
            <>
              {/* DESKTOP ENGINEER MENU */}
              {!isMobile &&
                engineerMenu.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    sx={{
                      fontWeight: activeTab === item.path ? "bold" : "normal",
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.text}
                  </Button>
                ))
              }

              {/* DESKTOP LOGOUT BUTTON */}
              {!isMobile && (
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  sx={{ ml: 2, fontWeight: "bold" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}

              {/* MOBILE PROFILE ICON */}
              {isMobile && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ ml: 1 }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={openProfile}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        minWidth: 200,
                        p: 1,
                      },
                    }}
                  >
                    <MenuItem onClick={() => navigate("/engineer/leakage-form")}>
                      🗒️   New Leakage
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        navigate("/engineer/recent-leakages");
                        setAnchorEl(null);
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      View Recent Leakages
                    </MenuItem>

                    <Divider />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      <ListItemIcon sx={{ color: "red" }}>
                        <LogoutIcon />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* ================= ADMIN SIDEBAR ================= */}
      {role === "admin" && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
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
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setMobileOpen(false);
                      }}
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