import { subscribeRequestSchema, subscribeResponseSchema } from "../src/newsletter/contracts";
import { PostgresSubscriberStore } from "../src/newsletter/server";
import type { ApiRequest, ApiResponse } from "./types";
import { sendJson } from "./types";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return sendJson(response, 405, { ok: false, message: "Method not allowed." });
  }

  const contentType = request.headers["content-type"]?.split(";")[0];
  if (contentType !== "application/json") {
    return sendJson(response, 415, { ok: false, message: "Expected an application/json request." });
  }

  const contentLength = Number(request.headers["content-length"] ?? 0);
  if (contentLength > 16_384) return sendJson(response, 413, { ok: false, message: "Request is too large." });

  const parsed = subscribeRequestSchema.safeParse(request.body);
  if (!parsed.success) return sendJson(response, 400, { ok: false, message: "Enter a valid email address." });
  if (parsed.data.honeypot) return sendJson(response, 200, { ok: true, subscriberId: "bot", status: "subscribed" });

  try {
    const result = await new PostgresSubscriberStore().upsertSubscriber(parsed.data);
    return sendJson(
      response,
      200,
      subscribeResponseSchema.parse({
        ok: true,
        subscriberId: result.subscriber.id,
        status: result.created ? "subscribed" : "already_subscribed"
      })
    );
  } catch (error) {
    console.error("newsletter subscribe failed", error instanceof Error ? error.message : "unknown error");
    return sendJson(response, 503, { ok: false, message: "Signup is temporarily unavailable." });
  }
}
