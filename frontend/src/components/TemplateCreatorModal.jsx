import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
<<<<<<< HEAD
  FormControlLabel,
  IconButton,
  Switch,
=======
  IconButton,
>>>>>>> d6fb0c4 (Initial commit)
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { createTemplate } from "../api/photobooth";

const EMPTY_CADRE = { x: 0, y: 0, width: 400, height: 300 };

export default function TemplateCreatorModal({ open, onClose, onCreated }) {
  const [nom, setNom] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [cadres, setCadres] = useState([{ ...EMPTY_CADRE }]);
<<<<<<< HEAD
  const [overlayMode, setOverlayMode] = useState(false);
=======
>>>>>>> d6fb0c4 (Initial commit)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddCadre = () => setCadres([...cadres, { ...EMPTY_CADRE }]);

  const handleRemoveCadre = (index) =>
    setCadres(cadres.filter((_, i) => i !== index));

  const handleCadreChange = (index, field, value) => {
    const updated = cadres.map((c, i) =>
      i === index ? { ...c, [field]: Number(value) } : c
    );
    setCadres(updated);
  };

  const handleSubmit = async () => {
    if (!nom.trim() || !imageFile) {
      setError("Nom et image sont requis.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const form = new FormData();
    form.append("nom", nom.trim());
    form.append("nombre_photos", cadres.length);
    form.append("cadres", JSON.stringify(cadres));
<<<<<<< HEAD
    form.append("mode", overlayMode ? "overlay" : "classic");
=======
>>>>>>> d6fb0c4 (Initial commit)
    form.append("image", imageFile);

    try {
      const result = await createTemplate(form);
      onCreated?.(result.template);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setNom("");
    setImageFile(null);
    setCadres([{ ...EMPTY_CADRE }]);
<<<<<<< HEAD
    setOverlayMode(false);
=======
>>>>>>> d6fb0c4 (Initial commit)
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Créer un template
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Nom du template"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            fullWidth
          />

          <Button variant="outlined" component="label">
            {imageFile ? imageFile.name : "Choisir l'image de fond"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>

<<<<<<< HEAD
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={overlayMode}
                  onChange={(e) => setOverlayMode(e.target.checked)}
                />
              }
              label="Mode overlay"
            />
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              {overlayMode
                ? "Le template est appliqué par-dessus les photos (cadres, bordures). L'image doit avoir de la transparence."
                : "Les photos sont appliquées par-dessus le template (comportement classique)."}
            </Typography>
          </Box>

=======
>>>>>>> d6fb0c4 (Initial commit)
          <Typography variant="subtitle2" fontWeight={700}>
            Cadres ({cadres.length})
          </Typography>

          {cadres.map((cadre, i) => (
            <Box
              key={i}
              display="flex"
              gap={1.5}
              alignItems="center"
              flexWrap="wrap"
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Typography variant="body2" sx={{ minWidth: 24, fontWeight: 600 }}>
                #{i + 1}
              </Typography>
              {["x", "y", "width", "height"].map((field) => (
                <TextField
                  key={field}
                  label={field}
                  type="number"
                  size="small"
                  value={cadre[field]}
                  onChange={(e) => handleCadreChange(i, field, e.target.value)}
                  sx={{ width: 90 }}
                />
              ))}
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveCadre(i)}
                disabled={cadres.length === 1}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddCadre}
            sx={{ alignSelf: "flex-start" }}
          >
            Ajouter un cadre
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Création…" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
