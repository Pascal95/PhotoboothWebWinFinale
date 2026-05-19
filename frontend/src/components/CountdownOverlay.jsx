import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Full-area countdown overlay — rendered on top of the webcam feed.
 * Accepts a `value` that can be a number (3, 2, 1) or "📸".
 */
export default function CountdownOverlay({ value }) {
  if (value === null || value === undefined) return null;

  const isShutter = value === "📸";

  return (
    <Box
      position="absolute"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: isShutter
          ? "rgba(255,255,255,0.15)"
          : "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
        borderRadius: "inherit",
        zIndex: 10,
        transition: "background 0.15s",
      }}
    >
      <Typography
        className={!isShutter ? "countdown-pulse" : undefined}
        sx={{
          fontSize: isShutter ? "5rem" : "9rem",
          fontWeight: 900,
          color: "#fff",
          textShadow: "0 4px 32px rgba(0,0,0,0.6)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
