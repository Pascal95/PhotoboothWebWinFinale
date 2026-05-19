import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { printPhoto } from "../api/photobooth";

/**
 * Shown after all photos are captured.
 * Displays the final montage with print and restart actions.
 */
export default function MontageDisplay({ montagePath, onRestart, copies = 1 }) {
  const [printing, setPrinting] = React.useState(false);
  const [printMessage, setPrintMessage] = React.useState(null);

  const montageUrl = `/static/${montagePath}`;

  const handlePrint = async () => {
    setPrinting(true);
    setPrintMessage(null);
    try {
      await printPhoto(montagePath, copies);
      setPrintMessage("Impression lancée !");
    } catch (err) {
      setPrintMessage(err.response?.data?.detail || "Erreur d'impression");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      width="100%"
      className="fade-in"
    >
      {/* Montage image */}
      <Box
        component="img"
        src={montageUrl}
        alt="Montage"
        sx={{
          maxWidth: "100%",
          maxHeight: "65vh",
          borderRadius: 3,
          boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
          objectFit: "contain",
        }}
      />

      {/* Actions */}
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <Button
          variant="contained"
          startIcon={printing ? <CircularProgress size={18} color="inherit" /> : <PrintIcon />}
          onClick={handlePrint}
          disabled={printing}
          size="large"
        >
          {printing ? "Impression…" : "Imprimer"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<CameraAltIcon />}
          onClick={onRestart}
          size="large"
          sx={{ borderWidth: 2 }}
        >
          Nouveau shooting
        </Button>
      </Box>

      {printMessage && (
        <Typography
          variant="body2"
          sx={{
            color: printMessage.includes("Erreur") ? "error.main" : "success.main",
            fontWeight: 600,
          }}
        >
          {printMessage}
        </Typography>
      )}
    </Box>
  );
}
