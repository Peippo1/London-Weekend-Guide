import { describe, expect, it } from "vitest";

import weekend from "../src/data/weekends/2026-07-18";
import {
  newsletterSubscriberSchema,
  subscribeRequestSchema,
  subscribeResponseSchema
} from "../src/newsletter/contracts";
import { buildWeeklyDigestContent } from "../src/newsletter/render";

describe("newsletter contracts", () => {
  it("accepts a valid subscribe request", () => {
    const parsed = subscribeRequestSchema.parse({
      email: "reader@example.com",
      source: "site",
      weekendSlug: "2026-07-18",
      postalCodeHint: "E8",
      honeypot: ""
    });

    expect(parsed.email).toBe("reader@example.com");
  });

  it("rejects an invalid email address", () => {
    expect(() =>
      subscribeRequestSchema.parse({
        email: "not-an-email",
        source: "site"
      })
    ).toThrow();
  });

  it("accepts a valid subscribe response", () => {
    const parsed = subscribeResponseSchema.parse({
      ok: true,
      subscriberId: "sub_123",
      status: "subscribed"
    });

    expect(parsed.status).toBe("subscribed");
  });
});

describe("weekly digest rendering", () => {
  it("renders subject, HTML, and text from weekend content", () => {
    const subscriber = newsletterSubscriberSchema.parse({
      id: "sub_123",
      email: "reader@example.com",
      status: "active",
      source: "site",
      createdAtIso: "2026-07-14T18:00:00.000Z"
    });

    const digest = buildWeeklyDigestContent(
      weekend,
      subscriber,
      "https://example.com/newsletter/unsubscribe"
    );

    expect(digest.subject).toContain("London this weekend");
    expect(digest.html).toContain("Unsubscribe");
    expect(digest.html).toContain("Yoshitomo Nara at the Hayward Gallery");
    expect(digest.text).toContain("Coal Drops Yard");
  });
});
