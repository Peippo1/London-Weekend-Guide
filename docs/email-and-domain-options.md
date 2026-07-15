# Email And Domain Options

## Current State

- Sites project ID: `appgprj_6a5681c3feac8191b9bd3de79aff5fb8`
- Current Sites slug: `london-weekend-guide`
- The site already supports a frontend signup form.
- The signup form posts to `/api/subscribe` when deployed with the included Vercel functions.

## Newsletter Backend Shape

The repo includes a small Vercel-compatible backend in `api/`. It keeps subscriber storage and scheduled sending server-side while the Astro pages remain static.

1. Create the table with `sql/schema.sql` in a Postgres database.
2. Set `POSTGRES_URL`, `RESEND_API_KEY`, `NEWSLETTER_FROM_EMAIL`, `PUBLIC_SITE_URL`, and `CRON_SECRET` in the deployment environment. Vercel Postgres/Neon integrations provide `POSTGRES_URL` automatically.
3. Set `PUBLIC_NEWSLETTER_SUBSCRIBE_ENDPOINT=/api/subscribe`.
4. Configure a weekly cron request for `/api/cron/send-weekly`; `vercel.json` contains the schedule.

The endpoints are:

- `POST /api/subscribe` stores or reactivates a subscriber.
- `GET /api/unsubscribe?subscriberId=...` marks a subscriber unsubscribed.
- `GET /api/health` checks that the function is reachable without exposing configuration values.
- `GET /api/cron/send-weekly` sends the current issue and requires `Authorization: Bearer $CRON_SECRET`.

### Expected subscription request

`POST $PUBLIC_NEWSLETTER_SUBSCRIBE_ENDPOINT`

```json
{
  "email": "reader@example.com",
  "source": "site",
  "weekendSlug": "2026-07-18",
  "postalCodeHint": "E8",
  "honeypot": ""
}
```

### Expected subscription success response

```json
{
  "ok": true,
  "subscriberId": "sub_123",
  "status": "subscribed"
}
```

### Backend responsibilities

- Validate the request against `subscribeRequestSchema`
- Ignore or reject bot signups when `honeypot` is non-empty
- Upsert the subscriber in storage
- Return `subscribed`, `pending_confirmation`, or `already_subscribed`
- Expose a scheduled job that loads the current weekend content and sends it through a `WeeklyDigestTransport`.

The SQL migration is intentionally small and portable. If you later move to Supabase, Neon, or another Postgres provider, the `SubscriberStoreAdapter` interface in `src/newsletter/contracts.ts` is the seam to replace.

## Provider Abstraction

The repo now includes two integration seams:

- `SubscriberStoreAdapter`
  - owns storage concerns such as Postgres, Supabase, Airtable, or a custom CRM sync
- `WeeklyDigestTransport`
  - owns provider-specific delivery concerns such as Resend, Buttondown, Mailchimp, Postmark, or a custom SMTP wrapper

The rendering logic stays local in `src/newsletter/render.ts`, so the same weekend content can drive both the site and the weekly email.

## Domain / URL Options

### Option 1: Keep the current Sites slug

Use the existing Sites URL derived from `london-weekend-guide`. This is the fastest path and does not require DNS work.

### Option 2: Create a custom subdomain

Examples:

- `guide.timfinch.com`
- `london.timfinch.com`
- `weekend.timfinch.com`

This is usually the cleanest branded option if you already control a root domain.

### Option 3: Attach a dedicated domain

Examples:

- `londonweekend.guide`
- `thelondonweekend.com`

This gives the strongest editorial brand, but it requires domain registration plus DNS configuration.

### Option 4: Change the Sites slug later

If you decide `tf-london-weekend-guide` is better than `london-weekend-guide`, the safer approach is usually to create the replacement site or add a custom domain rather than rely on slug churn midstream.

## Recommended Rollout

1. Keep the current slug for now.
2. Add a backend endpoint and turn on `PUBLIC_NEWSLETTER_SUBSCRIBE_ENDPOINT`.
3. Choose a transport provider such as Resend or Buttondown.
4. Attach a custom subdomain once the newsletter loop is working end to end.
