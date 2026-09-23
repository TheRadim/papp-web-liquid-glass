import type { Locale, LocalisedText } from "@/content/types";
import type { MobilityArea } from "@/types/mobility-city";

export interface MobilityCityProductContent {
  name: LocalisedText;
  description: LocalisedText;
  cta: LocalisedText;
}

export const mobilityCityProducts: Record<MobilityArea, MobilityCityProductContent> = {
  sensors: {
    name: { en: "On-ground sensors", da: "Jordmonterede sensorer" },
    description: {
      en: "Understand occupancy and utilisation at individual parking spaces.",
      da: "Forstå belægning og udnyttelse på de enkelte parkeringspladser."
    },
    cta: { en: "Explore parking sensors", da: "Udforsk parkeringssensorer" }
  },
  cameras: {
    name: { en: "Camera Analytics", da: "Kameraanalyse" },
    description: {
      en: "Measure vehicle activity, duration and movement across parking areas and streets.",
      da: "Mål køretøjsaktivitet, varighed og bevægelse på parkeringsarealer og gader."
    },
    cta: { en: "Explore camera analytics", da: "Udforsk kameraanalyse" }
  },
  insights: {
    name: { en: "Papp Insights", da: "Papp Insights" },
    description: {
      en: "Bring mobility data together and turn it into clear, actionable insight.",
      da: "Saml mobilitetsdata og gør dem til klar, handlingsorienteret indsigt."
    },
    cta: { en: "Explore Papp Insights", da: "Udforsk Papp Insights" }
  }
};

export const mobilityCityLabels = {
  loading: {
    en: "Loading interactive city model",
    da: "Indlæser interaktiv bymodel"
  },
  fallback: {
    en: "Interactive model unavailable. Use the product controls below.",
    da: "Den interaktive model er ikke tilgængelig. Brug produktknapperne nedenfor."
  },
  back: {
    en: "Back to overview",
    da: "Tilbage til overblik"
  },
  overview: {
    en: "Complete overview",
    da: "Samlet overblik"
  },
  choose: {
    en: "Choose a product area",
    da: "Vælg et produktområde"
  },
  productArea: {
    en: "Product area",
    da: "Produktområde"
  },
  learnMore: {
    en: "Learn more",
    da: "Læs mere"
  },
  close: {
    en: "Close product focus",
    da: "Luk produktfokus"
  }
} satisfies Record<string, LocalisedText>;

export function getMobilityCityProduct(area: MobilityArea) {
  return mobilityCityProducts[area];
}

export function getMobilityCityProducts() {
  return mobilityCityProducts;
}

export function pickMobilityText(locale: Locale, text: LocalisedText) {
  return text[locale] || text.en;
}
