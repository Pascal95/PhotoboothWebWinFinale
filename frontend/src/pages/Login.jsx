import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { login } from "../api/photobooth";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { role } = await login(password);
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin" : "/user");
    } catch {
      setError("Mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 70%)",
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 5,
          maxWidth: 400,
          width: "100%",
          mx: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={1.5} mb={4}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #9F67FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
            }}
          >
            <CameraAltIcon sx={{ fontSize: 32, color: "#fff" }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Photobooth
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Entrez votre code d'accès
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Code d'accès"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!password || loading}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Accéder"}
        </Button>
      </Paper>
    </Box>
  );
}
