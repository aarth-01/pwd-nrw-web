import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";
import { auth } from "../firebase";
console.log("Firebase Auth:", auth);
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "viraj.patil@pwd.gov.in") {
      navigate("/admin/dashboard");
    } else {
      navigate("/engineer/leakage-form");
    }
  };

return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC' }}>
      <Grid container>
        
        {/* LEFT SIDE: BRANDING & ANALYTICS VISUAL */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: 'relative',
            background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.9) 100%), 
                        url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 6,
          }}
        >
          {/* Decorative Flow Elements */}
          <Box sx={{ position: 'absolute', top: 40, left: 40, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WaterDrop sx={{ color: '#0ea5e9', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              PWD WATER TECH
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 600, textAlign: 'left', zIndex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              Precision <br />
              <span style={{ color: '#38bdf8' }}>NRW Management</span>
            </Typography>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4, fontWeight: 400 }}>
              Empowering government engineers with real-time hydraulic analytics and leak detection across all city zones.
            </Typography>

            {/* Glassmorphism Metric Cards (Visual Only) */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: 'Network Health', val: '98.2%', icon: <Shield fontSize="small" /> },
                { label: 'Active Sensors', val: '14,204', icon: <Analytics fontSize="small" /> }
              ].map((stat, i) => (
                <Box key={i} sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.05)', 
                  backdropFilter: 'blur(10px)', 
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 160
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#38bdf8', mb: 0.5 }}>
                    {stat.icon}
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.val}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SIDE: LOGIN FORM */}
        <Grid item xs={12} sm={8} md={5} component={Box} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Container maxWidth="xs">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <IconButton sx={{ bgcolor: '#eff6ff', mb: 2, p: 2 }}>
                <DarkModeOutlined sx={{ color: '#3b82f6' }} />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                Secure Login
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                NRW Monitoring & Analytics System <br />
                <strong>Public Works Department</strong>
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box component="form" noValidate>
                {/* Role Selector */}
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', mb: 1, display: 'block', textTransform: 'uppercase' }}>
                  Select Access Level
                </Typography>
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={handleRole}
                  fullWidth
                  sx={{ mb: 3, '& .MuiToggleButton-root': { py: 1, borderRadius: '8px !important', border: '1px solid #e2e8f0', mx: 0.5 } }}
                >
                  <ToggleButton value="admin" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Admin</ToggleButton>
                  <ToggleButton value="engineer" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Engineer</ToggleButton>
                  <ToggleButton value="field" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Field Staff</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  placeholder="name@government.gov"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, mb: 1 }}
                />

                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Button variant="text" sx={{ textTransform: 'none', color: '#3b82f6', fontWeight: 600 }}>
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                    }
                  }}
                >
                  Secure Login
                </Button>
              </Box>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Divider sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', px: 1 }}>
                  Official Access Only
                </Typography>
              </Divider>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                © 2026 Water Department Infrastructure Division. <br />
                All activities are logged and monitored.
              </Typography>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NRWLogin;
