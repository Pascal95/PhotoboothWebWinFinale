import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import { fetchHistory, printPhoto } from "../api/photobooth";

export default function History() {
  const navigate = useNavigate();
  const [montages, setMontages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then((data) => setMontages(data.montages))
      .catch(() => setMontages([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (filename) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  const handlePrintSelected = async () => {
    setPrinting(true);
    setMessage(null);
    let errors = 0;
    for (const filename of selected) {
      try {
        await printPhoto(`exports/${filename}`);
      } catch {
        errors++;
      }
    }
    setPrinting(false);
    setMessage(
      errors === 0
        ? `${selected.size} impression(s) lancée(s) !`
        : `${selected.size - errors} réussies, ${errors} échouée(s).`
    );
    clearSelection();
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Box
      minHeight="100vh"
      sx={{ background: "#0F0F1A", pb: 6, overflow: "auto" }}
    >
      {/* Top bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={2}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(15,15,26,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Historique
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {selected.size > 0 && (
            <>
              <Button size="small" onClick={clearSelection} sx={{ opacity: 0.6 }}>
                Tout désélectionner
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={printing ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />}
                onClick={handlePrintSelected}
                disabled={printing}
              >
                Imprimer ({selected.size})
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Messages */}
      {message && (
        <Box px={3} pt={2}>
          <Alert severity="info" onClose={() => setMessage(null)}>
            {message}
          </Alert>
        </Box>
      )}

      {/* Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" pt={10}>
          <CircularProgress />
        </Box>
      ) : montages.length === 0 ? (
        <Box display="flex" justifyContent="center" pt={10}>
          <Typography color="text.secondary">Aucun montage pour l'instant</Typography>
        </Box>
      ) : (
        <Box
          display="grid"
          sx={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 2.5,
            p: 3,
          }}
        >
          {montages.map((m) => {
            const isSelected = selected.has(m.filename);
            return (
              <Card
                key={m.filename}
                onClick={() => toggleSelect(m.filename)}
                sx={{
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.light",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                  },
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  image={m.url}
                  alt={m.filename}
                  sx={{ height: 180, objectFit: "cover" }}
                />
                <Box
                  px={1.5}
                  py={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(m.created_at)}
                  </Typography>
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => toggleSelect(m.filename)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
