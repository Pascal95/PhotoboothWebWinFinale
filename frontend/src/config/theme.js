import { createTheme } from "@mui/material/styles";

/**
 * Build a MUI theme from the photobooth config.
 * Called once config is loaded so colours stay in sync with admin settings.
 */
export function createAppTheme(config = {}) {
  const primary = config.couleur_principale || "#7C3AED";
  const font = config.font_titre || "Montserrat";

  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: primary },
      background: {
        default: config.bg_color || "#0F0F1A",
        paper: "rgba(255,255,255,0.05)",
      },
    },
    typography: {
      fontFamily: `"${font}", "Inter", sans-serif`,
      h1: { fontWeight: 900 },
      h2: { fontWeight: 700 },
      button: { fontWeight: 700, letterSpacing: "0.05em" },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            textTransform: "none",
            padding: "12px 32px",
            fontSize: "1rem",
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
            boxShadow: `0 8px 32px ${primary}55`,
            "&:hover": {
              boxShadow: `0 12px 40px ${primary}88`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: "blur(12px)",
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
            },
          },
        },
      },
    },
  });
}
