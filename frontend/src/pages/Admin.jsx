import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import {
  fetchConfig,
  fetchPrintCount,
  fetchPrinters,
  fetchTemplates,
  resetPrintCount,
  saveConfig,
  uploadLogo,
} from "../api/photobooth";
import TemplateCreatorModal from "../components/TemplateCreatorModal";

const FONTS = ["Montserrat", "Inter", "Verdana", "Arial", "Georgia", "Courier New"];
const LOGO_POSITIONS = [
  { value: "gauche", label: "Gauche" },
  { value: "droite", label: "Droite" },
  { value: "centre", label: "Centre" },
];

function SectionTitle({ children }) {
  return (
    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={2}>
      {children}
    </Typography>
  );
}

export default function Admin({ onConfigSaved }) {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [printCount, setPrintCount] = useState(null);

  useEffect(() => {
    Promise.all([fetchConfig(), fetchTemplates(), fetchPrinters(), fetchPrintCount()]).then(
      ([cfg, tplData, printerData, count]) => {
        setConfig(cfg);
        setTemplates(tplData.templates || []);
        setPrinters(printerData.printers || []);
        setPrintCount(count);
      }
    );
  }, []);

  const handleResetCount = async () => {
    const count = await resetPrintCount();
    setPrintCount(count);
  };

  const set = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveConfig(config);
      onConfigSaved?.(config);
      setMessage({ type: "success", text: "Configuration sauvegardée !" });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await uploadLogo(file);
      set("logo_path", result.path);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'upload du logo" });
    }
  };

  const handleTemplateCreated = (template) => {
    setTemplates((prev) => [...prev, template]);
    set("template", template.nom);
  };

  if (!config) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" sx={{ background: "#0F0F1A", overflow: "auto" }}>
      {/* Sticky header */}
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
          background: "rgba(15,15,26,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>Configuration</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving && <CircularProgress size={16} color="inherit" />}
        >
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </Button>
      </Box>

      {message && (
        <Box px={3} pt={2}>
          <Alert severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </Box>
      )}

      <Box maxWidth={720} mx="auto" px={3} py={4} display="flex" flexDirection="column" gap={4}>

        {/* ── Interface ─────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Interface</SectionTitle>
          <TextField label="Titre de l'interface" value={config.titre_interface} onChange={(e) => set("titre_interface", e.target.value)} fullWidth />
          <TextField label="Texte overlay sur les montages" value={config.texte_overlay} onChange={(e) => set("texte_overlay", e.target.value)} fullWidth />

          <Box display="flex" gap={2}>
            <TextField label="Couleur principale" type="color" value={config.couleur_principale} onChange={(e) => set("couleur_principale", e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Couleur titre" type="color" value={config.couleur_titre} onChange={(e) => set("couleur_titre", e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Couleur fond" type="color" value={config.bg_color} onChange={(e) => set("bg_color", e.target.value)} sx={{ flex: 1 }} />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Police</InputLabel>
            <Select value={config.font_titre} label="Police" onChange={(e) => set("font_titre", e.target.value)}>
              {FONTS.map((f) => <MenuItem key={f} value={f} style={{ fontFamily: f }}>{f}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Session ───────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Session photo</SectionTitle>
          <Box display="flex" gap={2} alignItems="center">
            <TextField label="Nombre de photos" type="number" value={config.nombre_photos} onChange={(e) => set("nombre_photos", Number(e.target.value))} inputProps={{ min: 1, max: 8 }} sx={{ flex: 1 }} />
            <TextField label="Durée du timer (s)" type="number" value={config.timer_seconds} onChange={(e) => set("timer_seconds", Number(e.target.value))} inputProps={{ min: 1, max: 10 }} disabled={!(config.show_timer ?? true)} sx={{ flex: 1 }} />
            <FormControlLabel
              control={<Switch checked={config.show_timer ?? true} onChange={(e) => set("show_timer", e.target.checked)} />}
              label="Afficher le timer"
              sx={{ whiteSpace: "nowrap" }}
            />
          </Box>

          {/* Template */}
          <Box display="flex" gap={1} alignItems="flex-end">
            <FormControl fullWidth>
              <InputLabel>Template</InputLabel>
              <Select value={config.template} label="Template" onChange={(e) => set("template", e.target.value)}>
                {templates.map((t) => <MenuItem key={t.nom} value={t.nom}>{t.nom}</MenuItem>)}
              </Select>
            </FormControl>
            <IconButton onClick={() => setShowTemplateModal(true)} sx={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, p: 1.5 }}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Matériel ──────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Matériel</SectionTitle>

          <FormControl fullWidth>
            <InputLabel>Mode caméra</InputLabel>
            <Select value={config.mode} label="Mode caméra" onChange={(e) => set("mode", e.target.value)}>
              <MenuItem value="webcam">Webcam (Logitech)</MenuItem>
              <MenuItem value="canon">Canon EOS (digiCamControl)</MenuItem>
            </Select>
          </FormControl>

          {config.mode === "webcam" && (
            <TextField label="Index webcam" type="number" value={config.webcam_index} onChange={(e) => set("webcam_index", Number(e.target.value))} inputProps={{ min: 0, max: 9 }} helperText="0 = première webcam détectée" />
          )}

          <FormControl fullWidth>
            <InputLabel>Imprimante</InputLabel>
            <Select value={config.printer_name} label="Imprimante" onChange={(e) => set("printer_name", e.target.value)}>
              {printers.length === 0
                ? <MenuItem value="DNP DS620">DNP DS620</MenuItem>
                : printers.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Impression ────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Impression</SectionTitle>
          <Box display="flex" gap={2} alignItems="center">
            <FormControlLabel
              control={<Switch checked={config.impression_auto} onChange={(e) => set("impression_auto", e.target.checked)} />}
              label="Impression automatique"
            />
            <TextField label="Nombre de copies" type="number" value={config.nombre_impressions} onChange={(e) => set("nombre_impressions", Number(e.target.value))} inputProps={{ min: 1, max: 10 }} sx={{ width: 160 }} />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Total imprimé : <strong>{printCount ?? "…"}</strong> photo{printCount !== 1 ? "s" : ""}
            </Typography>
            <Button size="small" variant="outlined" color="warning" onClick={handleResetCount}>
              Remettre à zéro
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Logo ──────────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Logo</SectionTitle>
          <Box display="flex" gap={2} alignItems="center">
            <Button variant="outlined" component="label" sx={{ flexShrink: 0 }}>
              Upload logo
              <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
            </Button>
            {config.logo_path && (
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                {config.logo_path}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={2}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Position</InputLabel>
              <Select value={config.logo_position} label="Position" onChange={(e) => set("logo_position", e.target.value)}>
                {LOGO_POSITIONS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Largeur (px)" type="number" value={config.logo_width} onChange={(e) => set("logo_width", Number(e.target.value))} sx={{ flex: 1 }} />
            <TextField label="Hauteur (px)" type="number" value={config.logo_height} onChange={(e) => set("logo_height", Number(e.target.value))} sx={{ flex: 1 }} />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Accès ─────────────────────────────────────────── */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          <SectionTitle>Accès</SectionTitle>
          <FormControlLabel
            control={<Switch checked={config.login_required} onChange={(e) => set("login_required", e.target.checked)} />}
            label="Authentification requise"
          />
          <Box display="flex" gap={2}>
            <TextField label="Mot de passe admin" type="password" value={config.mot_de_passe_admin} onChange={(e) => set("mot_de_passe_admin", e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Mot de passe utilisateur" type="password" value={config.mot_de_passe_utilisateur} onChange={(e) => set("mot_de_passe_utilisateur", e.target.value)} sx={{ flex: 1 }} />
          </Box>
          <TextField label="Durée de session (minutes)" type="number" value={config.duree_session_minutes} onChange={(e) => set("duree_session_minutes", Number(e.target.value))} sx={{ width: 240 }} />
        </Box>

      </Box>

      <TemplateCreatorModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onCreated={handleTemplateCreated}
      />
    </Box>
  );
}
