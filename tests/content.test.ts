import { describe, expect, it } from "vitest";

import { getCurrentWeekend, getWeekendBySlug } from "../src/data/weekends";
import { validateWeekendGuide, type WeekendGuide } from "../src/data/schema";

const baseWeekend = getCurrentWeekend();

describe("weekend guide validation", () => {
  it("resolves the configured current weekend", () => {
    expect(baseWeekend.slug).toBe("2026-07-18");
    expect(getWeekendBySlug("2026-07-18")?.title).toContain("London this weekend");
  });

  it("rejects duplicate event ids", () => {
    const invalidWeekend: WeekendGuide = {
      ...baseWeekend,
      slug: "duplicate-id-test",
      events: [
        baseWeekend.events[0],
        { ...baseWeekend.events[0], title: "A duplicate record" }
      ]
    };

    expect(() => validateWeekendGuide(invalidWeekend)).toThrow(/Duplicate event id/);
  });

  it("rejects featured picks that reference missing events", () => {
    const invalidWeekend: WeekendGuide = {
      ...baseWeekend,
      slug: "missing-featured-pick-test",
      featuredPickIds: ["missing-id", "coal-drops-supper-club", "regents-park-open-air"]
    };

    expect(() => validateWeekendGuide(invalidWeekend)).toThrow(/Featured pick/);
  });

  it("rejects section references to unknown events", () => {
    const invalidWeekend: WeekendGuide = {
      ...baseWeekend,
      slug: "missing-section-event-test",
      sections: [
        {
          ...baseWeekend.sections[0],
          eventIds: ["missing-id"]
        }
      ]
    };

    expect(() => validateWeekendGuide(invalidWeekend)).toThrow(/references missing event/);
  });

  it("accepts missing optional fields", () => {
    const validWeekend: WeekendGuide = {
      ...baseWeekend,
      slug: "optional-fields-test",
      neighbourhoodNote: undefined,
      weatherTip: undefined,
      topThreeTitle: undefined,
      events: [
        {
          ...baseWeekend.events[0],
          url: undefined,
          price: undefined,
          tags: undefined,
          editorialHighlight: undefined
        },
        {
          ...baseWeekend.events[1],
          id: "secondary-event"
        },
        {
          ...baseWeekend.events[2],
          id: "third-event"
        }
      ],
      featuredPickIds: [baseWeekend.events[0].id, "secondary-event", "third-event"],
      sections: [
        {
          ...baseWeekend.sections[0],
          eventIds: [baseWeekend.events[0].id]
        }
      ]
    };

    expect(() => validateWeekendGuide(validWeekend)).not.toThrow();
  });
});
