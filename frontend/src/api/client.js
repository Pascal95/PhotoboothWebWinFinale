/**
 * Axios client pre-configured for the Photobooth API.
 * All API modules import from here — base URL is in one place.
 */

import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  timeout: 30_000,
});

export default client;
