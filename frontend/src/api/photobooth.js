/**
 * Photobooth API — all backend calls in one place.
 * Components never call axios directly; they use these functions.
 */

import client from "./client";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (password) =>
  client.post("/login", { password }).then((r) => r.data);

// ── Config ────────────────────────────────────────────────────────────────────
export const fetchConfig = () => client.get("/config").then((r) => r.data);
export const saveConfig = (config) =>
  client.post("/config", config).then((r) => r.data);

// ── Capture ───────────────────────────────────────────────────────────────────
export const capturePhoto = () =>
  client.get("/capture-photo").then((r) => r.data);

export const generateMontage = (photoPaths) =>
  client.post("/generate-montage", { photo_paths: photoPaths }).then((r) => r.data);

// ── History ───────────────────────────────────────────────────────────────────
export const fetchHistory = () => client.get("/history").then((r) => r.data);

// ── Print ─────────────────────────────────────────────────────────────────────
export const printPhoto = (imagePath, copies = 1) =>
  client.post("/print", { image_path: imagePath, copies }).then((r) => r.data);

export const fetchPrinters = () =>
  client.get("/printers").then((r) => r.data);

// ── Templates ─────────────────────────────────────────────────────────────────
export const fetchTemplates = () =>
  client.get("/templates").then((r) => r.data);

export const createTemplate = (formData) =>
  client.post("/templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const deleteTemplate = (nom) =>
  client.delete(`/templates/${nom}`).then((r) => r.data);

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadLogo = (file) => {
  const form = new FormData();
  form.append("file", file);
  return client.post("/upload-logo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

// ── Print counter ─────────────────────────────────────────────────────────────
export const fetchPrintCount = () =>
  client.get("/print-count").then((r) => r.data.count);

export const resetPrintCount = () =>
  client.post("/print-count/reset").then((r) => r.data.count);

// ── Camera devices ────────────────────────────────────────────────────────────
export const fetchCameraDevices = () =>
  client.get("/camera/devices").then((r) => r.data);
