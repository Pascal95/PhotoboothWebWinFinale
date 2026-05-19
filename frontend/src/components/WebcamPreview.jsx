import React, { forwardRef } from "react";
import Webcam from "react-webcam";
import { Box, Typography } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  facingMode: "user",
};

/**
 * Live webcam preview.
 * ref is forwarded so the parent can read a screenshot if needed.
 */
const WebcamPreview = forwardRef(function WebcamPreview(
  { deviceId, style },
  ref
) {
  const constraints = deviceId
    ? { ...VIDEO_CONSTRAINTS, deviceId: { exact: deviceId } }
    : VIDEO_CONSTRAINTS;

  return (
    <Webcam
      ref={ref}
      audio={false}
      videoConstraints={constraints}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "scaleX(-1)", // mirror effect
        ...style,
      }}
      onUserMediaError={() => {}}
    />
  );
});

export function WebcamUnavailable() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      height="100%"
      color="rgba(255,255,255,0.4)"
    >
      <VideocamOffIcon sx={{ fontSize: 64 }} />
      <Typography variant="body2">Caméra non disponible</Typography>
    </Box>
  );
}

export default WebcamPreview;
