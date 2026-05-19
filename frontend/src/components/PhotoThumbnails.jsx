import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const THUMBNAIL_URL_BASE = "/static";

/**
 * Vertical strip of photo thumbnails showing captured photos
 * and empty placeholder slots for photos not yet taken.
 */
export default function PhotoThumbnails({ photos, total }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1.5}
      alignItems="center"
      sx={{ py: 1 }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const path = photos[i];
        return (
          <Box key={i} position="relative" sx={{ width: 100, height: 75 }}>
            {path ? (
              <Box
                component="img"
                src={`${THUMBNAIL_URL_BASE}/${path}`}
                alt={`Photo ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  border: "2px dashed rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <Typography variant="caption">{i + 1}</Typography>
              </Box>
            )}

            {/* Status icon */}
            <Box
              position="absolute"
              bottom={-6}
              right={-6}
              sx={{ color: path ? "primary.main" : "rgba(255,255,255,0.2)" }}
            >
              {path ? (
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
