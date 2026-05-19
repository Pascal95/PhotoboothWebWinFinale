/**
 * usePhotobooth — session state machine.
 *
 * Manages the full photo session lifecycle:
 *   idle → countdown → capturing → processing → done
 *
 * The component layer only calls startSession() and reset().
 * All async logic lives here.
 */

import { useCallback, useRef, useState } from "react";
import { capturePhoto, generateMontage } from "../api/photobooth";

const SESSION_STATES = {
  IDLE: "idle",
  COUNTDOWN: "countdown",
  CAPTURING: "capturing",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function usePhotobooth(config) {
  const [state, setState] = useState(SESSION_STATES.IDLE);
  const [countdown, setCountdown] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [montagePath, setMontagePath] = useState(null);
  const [error, setError] = useState(null);

  const cancelledRef = useRef(false);

  const numberOfPhotos = config?.nombre_photos ?? 4;
  const timerSeconds = config?.timer_seconds ?? 3;

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setState(SESSION_STATES.IDLE);
    setCountdown(null);
    setPhotos([]);
    setMontagePath(null);
    setError(null);
  }, []);

  const runCountdown = useCallback(
    async (seconds) => {
      for (let i = seconds; i >= 1; i--) {
        if (cancelledRef.current) return false;
        setCountdown(i);
        await delay(1000);
      }
      setCountdown("📸");
      await delay(500);
      setCountdown(null);
      return true;
    },
    []
  );

  const startSession = useCallback(async () => {
    cancelledRef.current = false;
    setPhotos([]);
    setMontagePath(null);
    setError(null);

    const capturedPaths = [];

    for (let i = 0; i < numberOfPhotos; i++) {
      if (cancelledRef.current) return;

      // Countdown before each shot
      setState(SESSION_STATES.COUNTDOWN);
      const ok = await runCountdown(timerSeconds);
      if (!ok || cancelledRef.current) return;

      // Capture
      setState(SESSION_STATES.CAPTURING);
      try {
        const result = await capturePhoto();
        capturedPaths.push(result.photo_path);
        setPhotos([...capturedPaths]);
      } catch (err) {
        setState(SESSION_STATES.ERROR);
        setError(err.response?.data?.detail || err.message);
        return;
      }
    }

    if (cancelledRef.current) return;

    // Generate montage
    setState(SESSION_STATES.PROCESSING);
    try {
      const result = await generateMontage(capturedPaths);
      setMontagePath(result.montage_path);
      setState(SESSION_STATES.DONE);
    } catch (err) {
      setState(SESSION_STATES.ERROR);
      setError(err.response?.data?.detail || err.message);
    }
  }, [numberOfPhotos, timerSeconds, runCountdown]);

  return {
    state,
    countdown,
    photos,
    montagePath,
    error,
    isIdle: state === SESSION_STATES.IDLE,
    isRunning: [
      SESSION_STATES.COUNTDOWN,
      SESSION_STATES.CAPTURING,
      SESSION_STATES.PROCESSING,
    ].includes(state),
    isDone: state === SESSION_STATES.DONE,
    isError: state === SESSION_STATES.ERROR,
    startSession,
    reset,
  };
}
