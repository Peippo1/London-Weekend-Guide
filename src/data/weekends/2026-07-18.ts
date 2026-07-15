import { validateWeekendGuide, type WeekendGuide } from "../schema.js";

const weekendGuide: WeekendGuide = {
  slug: "2026-07-18",
  title: "London this weekend: galleries, rooftops, and late northern sunsets",
  dateRange: "18 to 20 July 2026",
  intro:
    "A London weekend for people who want range: one big exhibition, one proper long lunch, one night out with some edge, and enough park time to make the city feel generous again.",
  ctaText: "Start with the three worth crossing town for",
  featuredPickIds: [
    "yoshitomo-nara-hayward",
    "coal-drops-supper-club",
    "regents-park-open-air"
  ],
  topThreeTitle: "If you only do three things",
  neighbourhoodNote:
    "Keep Saturday centred on the South Bank and King’s Cross if you want low-friction travel. Sunday is better for East London wandering when markets and canal paths do more of the work.",
  weatherTip:
    "If the forecast turns muggy, push the park stop later and front-load the indoor picks before 3pm. London feels much easier once the heat drops after dinner.",
  events: [
    {
      id: "yoshitomo-nara-hayward",
      category: "Exhibitions",
      title: "Yoshitomo Nara at the Hayward Gallery",
      area: "South Bank",
      schedule: "Saturday and Sunday, 10:00 to 19:00",
      summary:
        "Big-hearted, slightly unruly paintings and sculptures in a venue that can handle scale. This is the weekend’s most reliable culture pick if you want something memorable without doing homework.",
      url: "https://www.southbankcentre.co.uk/",
      price: "Paid",
      tags: ["Indoor", "Central", "Book ahead"],
      editorialHighlight: "Best exhibition pick"
    },
    {
      id: "coal-drops-supper-club",
      category: "Food and drink",
      title: "Canal-side supper at Coal Drops Yard",
      area: "King’s Cross",
      schedule: "Saturday, from 18:30",
      summary:
        "A polished dinner slot with enough atmosphere around it to turn into a full evening. Good if you want one meal that feels like an event without becoming a project.",
      url: "https://www.coaldropsyard.com/",
      price: "Mid to high",
      tags: ["Evening", "Waterside"],
      editorialHighlight: "Strong date-night option"
    },
    {
      id: "regents-park-open-air",
      category: "Outdoors",
      title: "Regent’s Park Open Air wandering and theatre",
      area: "Regent’s Park",
      schedule: "Sunday afternoon and evening",
      summary:
        "A rare London plan that still feels spacious. Start with the gardens, linger with a drink, and stay for the theatre if you want the city to feel less compressed.",
      url: "https://openairtheatre.com/",
      price: "Mixed",
      tags: ["Outdoor", "Sunday"],
      editorialHighlight: "Best slow-Sunday plan"
    },
    {
      id: "broadway-market-morning",
      category: "Markets",
      title: "Broadway Market breakfast crawl",
      area: "Hackney",
      schedule: "Saturday, 09:00 to 13:00",
      summary:
        "Go early, keep it simple, and use it as the start of an East London roam. The draw is less one stall than the steady run of coffee, people-watching, and easy canal walking.",
      url: "https://broadwaymarket.co.uk/",
      price: "Low to mid",
      tags: ["Morning", "East London"]
    },
    {
      id: "dalston-comedy-bill",
      category: "Live music and comedy",
      title: "Small-room comedy bill in Dalston",
      area: "Dalston",
      schedule: "Saturday, doors 19:30",
      summary:
        "A compact night out with the right amount of unpredictability. Better than a giant venue when you want a fun room and a shorter commitment.",
      url: "https://www.efdss.org/",
      price: "Paid",
      tags: ["Night out", "Book ahead"]
    },
    {
      id: "vanda-kew",
      category: "Family-friendly picks",
      title: "V&A family design trail",
      area: "South Kensington",
      schedule: "Sunday, museum hours",
      summary:
        "A strong fallback when London weather or energy levels get messy. The museum does the hard work, and the trail gives a clear shape to the visit.",
      url: "https://www.vam.ac.uk/",
      price: "Free",
      tags: ["Family", "Indoor"]
    }
  ],
  sections: [
    {
      id: "exhibitions",
      title: "Exhibitions",
      description: "One proper culture anchor, chosen for impact rather than completeness.",
      eventIds: ["yoshitomo-nara-hayward"]
    },
    {
      id: "food-drink",
      title: "Food and drink",
      description: "Meals and stops that can carry the mood of a day by themselves.",
      eventIds: ["coal-drops-supper-club"]
    },
    {
      id: "live-music-comedy",
      title: "Live music and comedy",
      description: "Evening plans with enough energy to justify the trip.",
      eventIds: ["dalston-comedy-bill"]
    },
    {
      id: "markets",
      title: "Markets",
      description: "Best used as a launch point rather than a destination in isolation.",
      eventIds: ["broadway-market-morning"]
    },
    {
      id: "outdoors",
      title: "Outdoors",
      description: "The city at its least claustrophobic.",
      eventIds: ["regents-park-open-air"]
    },
    {
      id: "family-friendly",
      title: "Family-friendly picks",
      description: "Options that still feel like a real day out for adults.",
      eventIds: ["vanda-kew"]
    }
  ]
};

export default validateWeekendGuide(weekendGuide);
