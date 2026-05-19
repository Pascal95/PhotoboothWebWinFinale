import React from "react";
import { Box, Typography } from "@mui/material";

const R = 80;
const CIRC = 502.655; // 2 * Math.PI * 80

export default function CountdownOverlay({ value, show = true, color = "#7C3AED" }) {
  if (!show || value === null || value === undefined) return null;

  const isShutter = value === "📸";

  return (
    <Box
      position="absolute"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: isShutter ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        borderRadius: "inherit",
        zIndex: 10,
      }}
    >
      {isShutter ? (
        <Typography
          className="shutter-pop"
          sx={{
            fontSize: "6rem",
            lineHeight: 1,
            userSelect: "none",
            filter: "drop-shadow(0 0 24px rgba(255,255,255,0.9))",
          }}
        >
          📸
        </Typography>
      ) : (
        <Box
          position="relative"
          width={200}
          height={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* SVG ring */}
          <svg
            width={200}
            height={200}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Background track */}
            <circle
              r={R}
              cx={100}
              cy={100}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={7}
            />
            {/* Draining ring — key forces remount → animation restarts each tick */}
            <circle
              key={value}
              r={R}
              cx={100}
              cy={100}
              fill="none"
              stroke={color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={0}
              transform="rotate(-90 100 100)"
              style={{
                animation: "ring-drain 1s linear forwards",
                filter: `drop-shadow(0 0 8px ${color})`,
              }}
            />
          </svg>

          {/* Number */}
          <Typography
            key={`n-${value}`}
            className="countdown-enter"
            sx={{
              fontSize: "5.5rem",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              userSelect: "none",
              zIndex: 1,
              textShadow: `0 0 32px ${color}, 0 4px 20px rgba(0,0,0,0.6)`,
            }}
          >
            {value}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
