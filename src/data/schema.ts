import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  area: z.string().min(1),
  schedule: z.string().min(1),
  summary: z.string().min(1),
  url: z.url().optional(),
  price: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
  editorialHighlight: z.string().min(1).optional()
});

export const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  eventIds: z.array(z.string().min(1)).min(1)
});

export const weekendSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  dateRange: z.string().min(1),
  intro: z.string().min(1),
  ctaText: z.string().min(1),
  featuredPickIds: z.array(z.string().min(1)).length(3),
  topThreeTitle: z.string().min(1).optional(),
  neighbourhoodNote: z.string().min(1).optional(),
  weatherTip: z.string().min(1).optional(),
  events: z.array(eventSchema).min(1),
  sections: z.array(sectionSchema).min(1)
});

export type WeekendEvent = z.infer<typeof eventSchema>;
export type WeekendSection = z.infer<typeof sectionSchema>;
export type WeekendGuide = z.infer<typeof weekendSchema>;

export function validateWeekendGuide(input: WeekendGuide): WeekendGuide {
  const weekend = weekendSchema.parse(input);
  const eventIds = new Set<string>();

  for (const event of weekend.events) {
    if (eventIds.has(event.id)) {
      throw new Error(`Duplicate event id "${event.id}" in weekend "${weekend.slug}".`);
    }

    eventIds.add(event.id);
  }

  for (const featuredPickId of weekend.featuredPickIds) {
    if (!eventIds.has(featuredPickId)) {
      throw new Error(
        `Featured pick "${featuredPickId}" does not exist in weekend "${weekend.slug}".`
      );
    }
  }

  for (const section of weekend.sections) {
    for (const eventId of section.eventIds) {
      if (!eventIds.has(eventId)) {
        throw new Error(
          `Section "${section.id}" references missing event "${eventId}" in weekend "${weekend.slug}".`
        );
      }
    }
  }

  return weekend;
}
