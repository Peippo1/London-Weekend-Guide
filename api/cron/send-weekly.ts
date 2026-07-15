import { getCurrentWeekend } from "../../src/data/weekends/index.js";
import { buildWeeklyDigestContent } from "../../src/newsletter/render.js";
import { PostgresSubscriberStore, ResendWeeklyDigestTransport, requiredEnv } from "../../src/newsletter/server.js";
import type { ApiRequest, ApiResponse } from "../types.js";

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!isAuthorized(request)) return response.status(401).end("Unauthorized.");

  try {
    const weekend = getCurrentWeekend();
    const siteUrl = requiredEnv("PUBLIC_SITE_URL");
    const store = new PostgresSubscriberStore();
    const transport = new ResendWeeklyDigestTransport();
    const subscribers = (await store.listActiveSubscribers()).filter(
      (subscriber) => subscriber.lastSentIssueSlug !== weekend.slug
    );
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        const digest = buildWeeklyDigestContent(
          weekend,
          subscriber,
          new URL("/api/unsubscribe", siteUrl).toString()
        );
        await transport.sendDigest({ subscriber, ...digest });
        await store.markIssueSent(subscriber.id, weekend.slug);
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error("newsletter delivery failed", error instanceof Error ? error.message : "unknown error");
      }
    }

    return response.status(200).json({ ok: true, issueSlug: weekend.slug, attempted: subscribers.length, sent, failed });
  } catch (error) {
    console.error("weekly newsletter job failed", error instanceof Error ? error.message : "unknown error");
    return response.status(500).json({ ok: false, message: "Weekly send failed." });
  }
}

function isAuthorized(request: ApiRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.authorization === `Bearer ${secret}`);
}
