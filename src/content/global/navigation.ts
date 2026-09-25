import type { Locale } from "@/content/types";
import { serviceTopics } from "@/content/services/service-topics";

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

const localised = (path: string) => ({ en: `/en${path}`, da: `/da${path}` });

// Services come first (left column): they are named after what people want to
// know. Products (right column) are the tools we measure it with.
export const solutionGroups = [
  {
    id: "expertise",
    label: navLabels.expertise,
    items: [
      ...serviceTopics.map((topic) => ({
        label: topic.name,
        description: topic.navDescription,
        href: localised(`/services/${topic.slug}`)
      })),
      {
        label: { en: "Reports & recommendations", da: "Rapporter og anbefalinger" },
        description: {
          en: "A clear report that helps decision-makers choose.",
          da: "En klar rapport, der hjælper beslutningstagere med at vælge."
        },
        href: localised("/services/analysis")
      },
      {
        label: { en: "Consultancy", da: "Rådgivning" },
        description: {
          en: "Workshops and practical advice for your team.",
          da: "Workshops og praktisk rådgivning til jeres team."
        },
        href: localised("/services/consultancy")
      }
    ]
  },
  {
    id: "technology",
    label: navLabels.technology,
    items: [
      {
        label: { en: "Papp Insights", da: "Papp Insights" },
        description: {
          en: "Online dashboard with all your data, live and over time.",
          da: "Online dashboard med alle jeres data, live og over tid."
        },
        href: localised("/products/insights")
      },
      {
        label: { en: "Cameras", da: "Kameraer" },
        description: {
          en: "GDPR-compliant cameras that count vehicles, bikes and people.",
          da: "GDPR-overholdende kameraer, der tæller biler, cykler og fodgængere."
        },
        href: localised("/products/cameras")
      },
      {
        label: { en: "Parking sensors", da: "Parkeringssensorer" },
        description: {
          en: "A small sensor in each space shows if it is free or taken.",
          da: "En lille sensor i hver plads viser, om den er ledig eller optaget."
        },
        href: localised("/products/sensors")
      },
      {
        label: { en: "Papp App", da: "Papp App" },
        description: {
          en: "Free app with a live map of available parking.",
          da: "Gratis app med et live kort over ledige parkeringspladser."
        },
        href: localised("/app")
      }
    ]
  }
];
