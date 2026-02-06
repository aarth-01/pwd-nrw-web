return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      /* ✅ KEEP original water background */
      backgroundImage: `
        linear-gradient(rgba(0,60,90,0.6), rgba(0,60,90,0.6)),
        url(${require("../assets/backg-water.jpg")})
      `,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  >
    {/* MAIN CONTAINER */}
    <Box
      sx={{
        display: "flex",
        gap: 0,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)"
      }}
    >
      {/* ================= LEFT : LOGIN ================= */}
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "rgba(255,255,255,0.95)"
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Public Works Department
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Government of Goa • NRW Monitoring System
        </Typography>

        <TextField
          fullWidth
          label="Official Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPass ? "text" : "password"}
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            mt: 4,
            height: 48,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "#0b5ed7",
            "&:hover": { bgcolor: "#084298" }
          }}
        >
          Secure Login
        </Button>

        <Typography
          variant="caption"
          sx={{ mt: 3, textAlign: "center", color: "gray" }}
        >
          Authorized personnel only
        </Typography>
      </Paper>

      {/* ================= RIGHT : IMAGE ================= */}
      <Box
        sx={{
          width: 420,                 // same width as login
          backgroundImage: `url(${sideImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
    </Box>
  </Box>
);
