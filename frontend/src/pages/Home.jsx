import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { usePhotobooth } from "../hooks/usePhotobooth";
import WebcamPreview from "../components/WebcamPreview";
import CountdownOverlay from "../components/CountdownOverlay";
import PhotoThumbnails from "../components/PhotoThumbnails";
import MontageDisplay from "../components/MontageDisplay";

export default function Home({ config }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const role = localStorage.getItem("role");

  const {
    state,
    countdown,
    photos,
    montagePath,
    error,
    isIdle,
    isRunning,
    isDone,
    isError,
    startSession,
    reset,
  } = usePhotobooth(config);

  const numberOfPhotos = config?.nombre_photos ?? 4;
  const titleColor = config?.couleur_titre || "#fff";
  const titre = config?.titre_interface || "Photobooth";

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{ background: config?.bg_color || "#0F0F1A", overflow: "hidden" }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={1.5}
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: titleColor, letterSpacing: "-0.02em" }}
        >
          {titre}
        </Typography>

        <Box display="flex" gap={1}>
          <IconButton onClick={() => navigate("/history")} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
            <HistoryIcon />
          </IconButton>
          {role === "admin" && (
            <IconButton onClick={() => navigate("/admin-config")} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
              <SettingsIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ── Main content ─────────────────────────────────────────── */}
      <Box display="flex" flex={1} overflow="hidden" gap={2} p={2}>

        {/* Left: photo thumbnails (visible once at least one photo is taken) */}
        {photos.length > 0 && !isDone && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{ width: 120, flexShrink: 0 }}
          >
            <PhotoThumbnails photos={photos} total={numberOfPhotos} />
          </Box>
        )}

        {/* Center: camera preview / montage */}
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          {isDone ? (
            <MontageDisplay
              montagePath={montagePath}
              onRestart={reset}
              copies={config?.nombre_impressions ?? 1}
            />
          ) : (
            <Box
              position="relative"
              sx={{
                width: "100%",
                maxWidth: 900,
                aspectRatio: "16/9",
                borderRadius: 3,
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              }}
            >
              <WebcamPreview ref={webcamRef} />
              <CountdownOverlay
                value={countdown}
                show={config?.show_timer ?? true}
                color={config?.couleur_principale ?? "#7C3AED"}
              />

              {/* Processing overlay */}
              {state === "processing" && (
                <Box
                  position="absolute"
                  inset={0}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  sx={{ background: "rgba(0,0,0,0.7)" }}
                >
                  <CircularProgress size={56} />
                  <Typography variant="body1" color="rgba(255,255,255,0.7)">
                    Création du montage…
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        px={3}
        py={2}
        sx={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Left: message d'erreur */}
        <Box flex={1} display="flex" justifyContent="flex-start">
          {isError && (
            <Alert severity="error" onClose={reset} sx={{ maxWidth: 400 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Center: bouton + progression */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
          {!isDone && (
            <Button
              variant="contained"
              size="large"
              startIcon={
                isRunning ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CameraAltIcon />
                )
              }
              onClick={startSession}
              disabled={isRunning}
              sx={{ minWidth: 240, fontSize: "1.1rem" }}
            >
              {isIdle || isError ? "Lancer la séance" : "En cours…"}
            </Button>
          )}
          {isRunning && (
            <Typography variant="caption" color="text.secondary">
              Photo {photos.length + 1} / {numberOfPhotos}
            </Typography>
          )}
        </Box>

        {/* Right: espace symétrique */}
        <Box flex={1} />
      </Box>
    </Box>
  );
}
