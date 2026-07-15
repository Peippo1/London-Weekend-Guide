import { sql } from "@vercel/postgres";
import { Resend } from "resend";

import {
  newsletterSubscriberSchema,
  type NewsletterSubscriber,
  type SubscribeRequest,
  type SubscriberStoreAdapter,
  type WeeklyDigestTransport,
  type WeeklyDigestTransportInput,
  type WeeklyDigestTransportResult
} from "./contracts.js";

type SubscriberRow = {
  id: string;
  email: string;
  status: NewsletterSubscriber["status"];
  source: string;
  postal_code_hint: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  confirmed_at: Date | string | null;
  last_sent_issue_slug: string | null;
};

function toSubscriber(row: SubscriberRow): NewsletterSubscriber {
  return newsletterSubscriberSchema.parse({
    id: row.id,
    email: row.email,
    status: row.status,
    source: row.source,
    postalCodeHint: row.postal_code_hint ?? undefined,
    createdAtIso: new Date(row.created_at).toISOString(),
    updatedAtIso: new Date(row.updated_at).toISOString(),
    confirmedAtIso: row.confirmed_at ? new Date(row.confirmed_at).toISOString() : undefined,
    lastSentIssueSlug: row.last_sent_issue_slug ?? undefined
  });
}

export class PostgresSubscriberStore implements SubscriberStoreAdapter {
  async upsertSubscriber(request: SubscribeRequest) {
    const email = request.email.trim().toLowerCase();
    const id = `sub_${crypto.randomUUID()}`;
    const result = await sql<SubscriberRow & { created: boolean }>`
      insert into newsletter_subscribers
        (id, email, status, source, postal_code_hint, weekend_slug, confirmed_at)
      values
        (${id}, ${email}, 'active', ${request.source}, ${request.postalCodeHint ?? null}, ${request.weekendSlug ?? null}, now())
      on conflict (email) do update set
        status = 'active',
        source = excluded.source,
        postal_code_hint = coalesce(excluded.postal_code_hint, newsletter_subscribers.postal_code_hint),
        weekend_slug = coalesce(excluded.weekend_slug, newsletter_subscribers.weekend_slug),
        confirmed_at = coalesce(newsletter_subscribers.confirmed_at, now()),
        updated_at = now()
      returning *, (xmax = 0) as created
    `;

    const row = result.rows[0];
    if (!row) throw new Error("Subscriber could not be stored.");
    return { subscriber: toSubscriber(row), created: row.created };
  }

  async listActiveSubscribers() {
    const result = await sql<SubscriberRow>`
      select * from newsletter_subscribers where status = 'active' order by created_at asc
    `;
    return result.rows.map(toSubscriber);
  }

  async markIssueSent(subscriberId: string, issueSlug: string) {
    await sql`
      update newsletter_subscribers
      set last_sent_issue_slug = ${issueSlug}, updated_at = now()
      where id = ${subscriberId} and status = 'active'
    `;
  }

  async unsubscribeSubscriber(subscriberId: string) {
    const result = await sql`
      update newsletter_subscribers
      set status = 'unsubscribed', updated_at = now()
      where id = ${subscriberId} and status <> 'unsubscribed'
    `;
    return (result.rowCount ?? 0) > 0;
  }
}

export class ResendWeeklyDigestTransport implements WeeklyDigestTransport {
  private readonly client = new Resend(requiredEnv("RESEND_API_KEY"));

  async sendDigest(input: WeeklyDigestTransportInput): Promise<WeeklyDigestTransportResult> {
    const result = await this.client.emails.send({
      from: requiredEnv("NEWSLETTER_FROM_EMAIL"),
      to: input.subscriber.email,
      replyTo: process.env.NEWSLETTER_REPLY_TO || undefined,
      subject: input.subject,
      html: input.html,
      text: input.text
    });

    if (result.error || !result.data?.id) {
      throw new Error(result.error?.message ?? "Email provider did not return a message id.");
    }

    return { providerMessageId: result.data.id };
  }
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
