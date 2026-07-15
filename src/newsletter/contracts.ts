import { z } from "zod";

export const subscribeRequestSchema = z.object({
  email: z.email(),
  source: z.string().min(1).default("site"),
  weekendSlug: z.string().min(1).optional(),
  postalCodeHint: z.string().trim().max(32).optional(),
  honeypot: z.string().optional().default("")
});

export const subscribeResponseSchema = z.object({
  ok: z.literal(true),
  subscriberId: z.string().min(1),
  status: z.enum(["subscribed", "pending_confirmation", "already_subscribed"]),
  message: z.string().min(1).optional()
});

export const newsletterSubscriberSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  status: z.enum(["active", "pending_confirmation", "unsubscribed"]),
  source: z.string().min(1),
  createdAtIso: z.string().min(1),
  postalCodeHint: z.string().max(32).optional(),
  updatedAtIso: z.string().min(1).optional(),
  confirmedAtIso: z.string().min(1).optional(),
  lastSentIssueSlug: z.string().min(1).optional()
});

export const weeklyDigestJobSchema = z.object({
  issueSlug: z.string().min(1),
  sendAtIso: z.string().min(1),
  previewUrl: z.url().optional(),
  unsubscribeBaseUrl: z.url(),
  subscriberIds: z.array(z.string().min(1)).min(1)
});

export type SubscribeRequest = z.infer<typeof subscribeRequestSchema>;
export type SubscribeResponse = z.infer<typeof subscribeResponseSchema>;
export type NewsletterSubscriber = z.infer<typeof newsletterSubscriberSchema>;
export type WeeklyDigestJob = z.infer<typeof weeklyDigestJobSchema>;

export interface SubscriberStoreAdapter {
  upsertSubscriber(
    request: SubscribeRequest
  ): Promise<{
    subscriber: NewsletterSubscriber;
    created: boolean;
  }>;
  listActiveSubscribers(): Promise<NewsletterSubscriber[]>;
  markIssueSent(subscriberId: string, issueSlug: string): Promise<void>;
  unsubscribeSubscriber(subscriberId: string): Promise<boolean>;
}

export interface WeeklyDigestTransport {
  sendDigest(input: WeeklyDigestTransportInput): Promise<WeeklyDigestTransportResult>;
}

export interface WeeklyDigestTransportInput {
  subscriber: NewsletterSubscriber;
  subject: string;
  html: string;
  text: string;
}

export interface WeeklyDigestTransportResult {
  providerMessageId: string;
}
