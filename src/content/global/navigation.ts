import type { Locale } from "@/content/types";

export const navLabels = {
  solutions: { en: "Solutions", da: "Løsninger" },
  projects: { en: "Projects", da: "Projekter" },
  app: { en: "App", da: "App" },
  about: { en: "About", da: "Om os" },
  contact: { en: "Contact", da: "Kontakt" },
  login: { en: "Log in", da: "Log ind" },
  menu: { en: "Menu", da: "Menu" },
  close: { en: "Close", da: "Luk" },
  technology: { en: "Products", da: "Produkter" },
  expertise: { en: "Services", da: "Ydelser" }
};

export function primaryNavigation(locale: Locale) {
  return [
    { label: navLabels.projects[locale], href: `/${locale}/projects` },
    { label: navLabels.about[locale], href: `/${locale}/about` },
    { label: navLabels.contact[locale], href: `/${locale}/contact` }
  ];
}

export const solutionGroups = [
  {
    id: "technology",
    label: navLabels.technology,
    items: [
      {
        label: { en: "Papp Insights", da: "Papp Insights" },
        description: {
          en: "The platform that brings live and historical data together.",
          da: "Platformen der samler live og historiske data."
        },
        href: { en: "/en/products/insights", da: "/da/products/insights" }
      },
      {
        label: { en: "Camera Analytics", da: "Kameraanalyse" },
        description: {
          en: "Measurement of parking areas, streets and mobility flows.",
          da: "Måling af parkeringsarealer, gader og mobilitetsflow."
        },
        href: { en: "/en/products/cameras", da: "/da/products/cameras" }
      },
      {
        label: { en: "On-ground sensors", da: "Jordmonterede sensorer" },
        description: {
          en: "Space-level data for occupancy, duration and utilisation.",
          da: "Data på pladsniveau om belægning, varighed og udnyttelse."
        },
        href: { en: "/en/products/sensors", da: "/da/products/sensors" }
      },
      {
        label: { en: "Papp App", da: "Papp App" },
        description: {
          en: "A public app that shows where Papp operates and measures occupancy.",
          da: "En offentlig app, der viser hvor Papp opererer og måler belægning."
        },
        href: { en: "/en/app", da: "/da/app" }
      }
    ]
  },
  {
    id: "expertise",
    label: navLabels.expertise,
    items: [
      {
        label: { en: "Analysis", da: "Analyse" },
        description: {
          en: "Reports and recommendations for municipalities and public decision-makers.",
          da: "Rapporter og anbefalinger til kommuner og offentlige beslutningstagere."
        },
        href: { en: "/en/services/analysis", da: "/da/services/analysis" }
      },
      {
        label: { en: "Consultancy", da: "Rådgivning" },
        description: {
          en: "Hands-on workshops and practical advice for businesses.",
          da: "Praktiske workshops og rådgivning til virksomheder."
        },
        href: { en: "/en/services/consultancy", da: "/da/services/consultancy" }
      }
    ]
  }
];
