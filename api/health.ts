import type { ApiRequest, ApiResponse } from "./types.js";

export default function handler(_request: ApiRequest, response: ApiResponse) {
  return response.status(200).json({ ok: true, service: "london-weekend-guide" });
}
