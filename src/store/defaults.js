import {
  advantages,
  areaTags,
  faqs,
  navLinks,
  services,
  site,
  testimonials,
} from "../content";
import { destinationSuggestions, originSuggestions } from "../data/fareEstimates";

const seedRoutes = [
  { id: "r1", origin: "תל אביב", destination: 'נתב"ג', min: 140, max: 170, minutes: 25 },
  { id: "r2", origin: "ראשון לציון", destination: 'נתב"ג', min: 130, max: 160, minutes: 22 },
  { id: "r3", origin: "פתח תקווה", destination: 'נתב"ג', min: 120, max: 150, minutes: 20 },
  { id: "r4", origin: "נתניה", destination: 'נתב"ג', min: 110, max: 140, minutes: 18 },
  { id: "r5", origin: "תל אביב", destination: "ירושלים", min: 260, max: 320, minutes: 55 },
  { id: "r6", origin: "תל אביב", destination: "חיפה", min: 320, max: 390, minutes: 75 },
  { id: "r7", origin: "תל אביב", destination: "ראשון לציון", min: 90, max: 120, minutes: 18 },
  { id: "r8", origin: "תל אביב", destination: "פתח תקווה", min: 95, max: 125, minutes: 20 },
  { id: "r9", origin: "תל אביב", destination: "נתניה", min: 130, max: 165, minutes: 30 },
];

export function createDefaultSiteState() {
  return {
    site: {
      ...site,
      email: "david.taxi@example.com",
      heroTitle: "שירותי מוניות והסעות לכל חלקי הארץ",
      heroSubtitle:
        "זמינות 24/7, הגעה בזמן ורכב חדיש ומרווח. הדרך הבטוחה והנוחה שלך לכל יעד.",
    },
    availability: {
      isAvailable: true,
    },
    fare: {
      originSuggestions: [...originSuggestions],
      destinationSuggestions: [...destinationSuggestions],
      routes: seedRoutes,
    },
    testimonials: testimonials.map((item, index) => ({
      id: `t${index + 1}`,
      name: item.name,
      quote: item.quote,
      rating: 5,
      visible: true,
    })),
    leads: [],
    static: {
      navLinks,
      services,
      advantages,
      areaTags,
      faqs,
    },
  };
}
