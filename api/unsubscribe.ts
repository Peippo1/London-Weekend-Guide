import { PostgresSubscriberStore } from "../src/newsletter/server.js";
import type { ApiRequest, ApiResponse } from "./types.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") return response.status(405).json({ message: "Method not allowed." });
  const query = new URLSearchParams(request.url?.split("?")[1] ?? "");
  const subscriberId = query.get("subscriberId");
  if (!subscriberId) return response.status(400).json({ message: "Missing subscriberId." });

  try {
    const changed = await new PostgresSubscriberStore().unsubscribeSubscriber(subscriberId);
    response.setHeader("content-type", "text/plain; charset=utf-8");
    return response.status(200).end(changed ? "You have been unsubscribed." : "You are already unsubscribed.");
  } catch {
    return response.status(503).end("Unsubscribe is temporarily unavailable.");
  }
}
