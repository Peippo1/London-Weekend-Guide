import type { WeekendGuide } from "../data/schema";
import type { NewsletterSubscriber } from "./contracts";

export interface WeeklyDigestContent {
  subject: string;
  html: string;
  text: string;
}

export function buildWeeklyDigestContent(
  weekend: WeekendGuide,
  subscriber: NewsletterSubscriber,
  unsubscribeBaseUrl: string
): WeeklyDigestContent {
  const unsubscribeUrl = new URL(unsubscribeBaseUrl);
  unsubscribeUrl.searchParams.set("subscriberId", subscriber.id);
  unsubscribeUrl.searchParams.set("issue", weekend.slug);

  const featuredEvents = weekend.featuredPickIds
    .map((featuredId) => weekend.events.find((event) => event.id === featuredId))
    .filter((event): event is WeekendGuide["events"][number] => Boolean(event));

  const subject = `${weekend.title} | ${weekend.dateRange}`;
  const htmlCards = featuredEvents
    .map(
      (event) => `
        <tr>
          <td style="padding:0 0 24px;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#0e5a46;">${escapeHtml(
              event.category
            )} · ${escapeHtml(event.area)}</p>
            <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:28px;line-height:1.1;color:#1d2430;">${escapeHtml(
              event.title
            )}</h2>
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#4e5a68;">${escapeHtml(
              event.schedule
            )}</p>
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#4e5a68;">${escapeHtml(
              event.summary
            )}</p>
            ${
              event.url
                ? `<a href="${event.url}" style="font-family:Arial,sans-serif;font-weight:700;color:#1d2430;">Open event details</a>`
                : ""
            }
          </td>
        </tr>
      `
    )
    .join("");

  const html = `
    <html>
      <body style="margin:0;padding:32px;background:#f3ede1;color:#1d2430;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;padding:32px;background:#fff8ef;border-radius:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#0e5a46;">London weekend guide</p>
                    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:14px;color:#4e5a68;">${escapeHtml(
                      weekend.dateRange
                    )}</p>
                    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:42px;line-height:0.98;">${escapeHtml(
                      weekend.title
                    )}</h1>
                    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:17px;line-height:1.7;color:#4e5a68;">${escapeHtml(
                      weekend.intro
                    )}</p>
                  </td>
                </tr>
                ${htmlCards}
                <tr>
                  <td>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#4e5a68;">
                      You are receiving this because you signed up at London Weekend Guide.
                      <a href="${unsubscribeUrl.toString()}" style="color:#4e5a68;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();

  const text = [
    "London weekend guide",
    weekend.dateRange,
    weekend.title,
    "",
    weekend.intro,
    "",
    ...featuredEvents.flatMap((event) => [
      `${event.title} (${event.category} - ${event.area})`,
      event.schedule,
      event.summary,
      event.url ?? "",
      ""
    ]),
    `Unsubscribe: ${unsubscribeUrl.toString()}`
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
