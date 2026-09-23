import type { Locale, Offering } from "@/content/types";

const sensorVisual = "/images/corporate/parking-sensor-ground.jpg";
const insightVisual = "/images/corporate/insights-laptop.webp";
const analysisVisual = "/images/corporate/insights-meeting-city.jpg";
const consultancyVisual = "/images/corporate/parking-consultation-charger.jpg";

export const offerings: Offering[] = [
  {
    slug: "sensors",
    category: "sensors",
    name: { en: "Parking Sensors", da: "Parkeringssensorer" },
    eyebrow: { en: "Technology", da: "Teknologi" },
    shortDescription: {
      en: "Precise parking data that turns occupancy, behaviour and demand into a usable decision basis.",
      da: "Præcis parkeringsdata, der gør belægning, adfærd og efterspørgsel til et brugbart beslutningsgrundlag."
    },
    introduction: {
      en: "Papp's IoT sensors help teams understand how parking areas are actually used, from live occupancy to long-term trends.",
      da: "Papps IoT-sensorer hjælper teams med at forstå, hvordan parkeringsområder faktisk bruges, fra live belægning til langsigtede mønstre."
    },
    benefits: [
      { en: "Live and historical occupancy views", da: "Live og historiske belægningsvisninger" },
      { en: "Utilisation and duration insight", da: "Indsigt i udnyttelse og varighed" },
      { en: "Support for parking and charging-space monitoring", da: "Understøtter overvågning af parkerings- og ladepladser" }
    ],
    useCases: [
      { en: "Municipal parking areas", da: "Kommunale parkeringsområder" },
      { en: "Private facilities and campuses", da: "Private anlæg og campusområder" },
      { en: "Long-term measurement programmes", da: "Langsigtede måleprogrammer" }
    ],
    process: [
      { en: "Define the spaces and questions to measure.", da: "Definer pladserne og spørgsmålene, der skal måles." },
      { en: "Install and connect the sensors.", da: "Installer og forbind sensorerne." },
      { en: "Review patterns in Papp Insights.", da: "Gennemgå mønstre i Papp Insights." }
    ],
    heroImage: sensorVisual,
    relatedProjectSlugs: ["sensordata-herning", "ladeindsigter-frederiksberg"],
    contentStatus: "draft",
    seo: {
      title: { en: "Parking Sensors | Papp Mobility", da: "Parkeringssensorer | Papp Mobility" },
      description: {
        en: "Understand occupancy, duration and utilisation with connected parking sensors.",
        da: "Forstå belægning, varighed og udnyttelse med forbundne parkeringssensorer."
      }
    }
  },
  {
    slug: "cameras",
    category: "cameras",
    name: { en: "Camera Analytics", da: "Kameraanalyse" },
    eyebrow: { en: "Technology", da: "Teknologi" },
    shortDescription: {
      en: "Camera-based measurement for larger parking areas, streets and vehicle activity.",
      da: "Kamerabaseret måling af større parkeringsområder, gader og køretøjsaktivitet."
    },
    introduction: {
      en: "Camera analytics help document flow, dwell time and utilisation where individual sensors are not the right fit.",
      da: "Kameraanalyse hjælper med at dokumentere flow, opholdstid og udnyttelse, hvor individuelle sensorer ikke er den rette løsning."
    },
    benefits: [
      { en: "Measure larger areas and street environments", da: "Mål større arealer og gademiljøer" },
      { en: "Understand flow, duration and activity patterns", da: "Forstå flow, varighed og aktivitetsmønstre" },
      { en: "Support temporary and permanent deployments", da: "Understøtter midlertidige og permanente opsætninger" }
    ],
    useCases: [
      { en: "Parking-area utilisation", da: "Udnyttelse af parkeringsarealer" },
      { en: "Street and curb activity", da: "Aktivitet på gader og kantsten" },
      { en: "Mobility measurement for planning", da: "Mobilitetsmåling til planlægning" }
    ],
    process: [
      { en: "Clarify the measurement area and privacy review needs.", da: "Afklar måleområdet og behovet for privacy-review." },
      { en: "Deploy cameras for the agreed measurement period.", da: "Opsæt kameraer i den aftalte måleperiode." },
      { en: "Use analytics to identify practical patterns.", da: "Brug analysen til at finde praktiske mønstre." }
    ],
    heroImage: "/images/camera/installed-camera.webp",
    relatedProjectSlugs: ["parkeringsmoenstre-ishoej", "kystparkering-thisted"],
    contentStatus: "needs-review",
    seo: {
      title: { en: "Camera Analytics | Papp Mobility", da: "Kameraanalyse | Papp Mobility" },
      description: {
        en: "Use camera analytics to understand parking areas, streets and mobility flows.",
        da: "Brug kameraanalyse til at forstå parkeringsområder, gader og mobilitetsflow."
      }
    }
  },
  {
    slug: "insights",
    category: "insights",
    name: { en: "Papp Insights", da: "Papp Insights" },
    eyebrow: { en: "Platform", da: "Platform" },
    shortDescription: {
      en: "Dashboards and reporting that turn mobility data into something teams can read, share and act on.",
      da: "Dashboards og rapportering, der gør mobilitetsdata lette at læse, dele og handle på."
    },
    introduction: {
      en: "Papp Insights visualises data from sensors, cameras and parking guidance systems, so decision-makers can understand patterns over time.",
      da: "Papp Insights visualiserer data fra sensorer, kameraer og p-henvisningssystemer, så beslutningstagere kan forstå mønstre over tid."
    },
    benefits: [
      { en: "Live views and historical comparisons", da: "Live visninger og historiske sammenligninger" },
      { en: "Maps, charts and reporting support", da: "Kort, grafer og rapporteringsstøtte" },
      { en: "One place to understand mobility patterns", da: "Et samlet sted til at forstå mobilitetsmønstre" }
    ],
    useCases: [
      { en: "Operational overview", da: "Operationelt overblik" },
      { en: "Decision support", da: "Beslutningsstøtte" },
      { en: "Stakeholder reporting", da: "Rapportering til interessenter" }
    ],
    process: [
      { en: "Connect relevant data sources.", da: "Forbind relevante datakilder." },
      { en: "Explore patterns across time and place.", da: "Udforsk mønstre på tværs af tid og sted." },
      { en: "Share the insight with decision-makers.", da: "Del indsigten med beslutningstagere." }
    ],
    heroImage: insightVisual,
    relatedProjectSlugs: ["dataoptimering-faaborg"],
    contentStatus: "draft",
    seo: {
      title: { en: "Papp Insights | Papp Mobility", da: "Papp Insights | Papp Mobility" },
      description: {
        en: "Bring mobility data together in Papp Insights for live views, historical patterns and reporting.",
        da: "Saml mobilitetsdata i Papp Insights med live visninger, historiske mønstre og rapportering."
      }
    }
  },
{
  "slug": "analysis",
  "category": "analysis",
  "name": {
    "en": "Analysis & reports",
    "da": "Analyse og rapporter"
  },
  "eyebrow": {
    "en": "For the public sector · B2G",
    "da": "Til den offentlige sektor · B2G"
  },
  "shortDescription": {
    "en": "A report you can put on the table. Evidence for the next public decision.",
    "da": "En rapport, I kan lægge på bordet. Dokumentation til den næste politiske beslutning."
  },
  "introduction": {
    "en": "For municipalities, cities and public organisations: we turn a parking, traffic or mobility question into measured evidence, clear conclusions and practical recommendations.",
    "da": "Til kommuner, byer og offentlige organisationer: Vi omsætter spørgsmål om parkering, trafik og mobilitet til målinger, klare konklusioner og praktiske anbefalinger."
  },
  "benefits": [
    {
      "en": "A documented measurement approach and transparent data basis.",
      "da": "En dokumenteret målemetode og et gennemsigtigt datagrundlag."
    },
    {
      "en": "Readable findings, maps and comparisons with limitations clearly explained.",
      "da": "Forståelige resultater, kort og sammenligninger med tydelige forbehold."
    },
    {
      "en": "A concrete report with conclusions and recommendations for officials, committees and politicians.",
      "da": "En konkret rapport med konklusioner og anbefalinger til embedsfolk, udvalg og politikere."
    }
  ],
  "process": [
    {
      "en": "Define the question and what evidence the decision needs.",
      "da": "Afklar spørgsmålet og det nødvendige beslutningsgrundlag."
    },
    {
      "en": "Plan measurements, collect data and validate the results.",
      "da": "Planlæg målinger, indsaml data og validér resultaterne."
    },
    {
      "en": "Analyse patterns, explain findings and assess possible actions.",
      "da": "Analysér mønstre, forklar resultater og vurder handlemuligheder."
    },
    {
      "en": "Deliver the report and walk decision-makers through the recommendations.",
      "da": "Aflever rapporten og gennemgå anbefalingerne med beslutningstagerne."
    }
  ],
  "useCases": [],
  "heroImage": "/images/corporate/insights-meeting-city.jpg",
  "relatedProjectSlugs": [
    "dataoptimering-faaborg"
  ],
  "contentStatus": "draft",
  "seo": {
    "title": {
      "en": "Analysis & reports for municipalities | Papp Mobility",
      "da": "Analyse og rapporter til kommuner | Papp Mobility"
    },
    "description": {
      "en": "Evidence, mobility measurement and tangible reports for public decisions.",
      "da": "Dokumentation, mobilitetsmåling og konkrete rapporter til offentlige beslutninger."
    }
  }
},
{
  "slug": "consultancy",
  "category": "consultancy",
  "name": {
    "en": "Consultancy & workshops",
    "da": "Rådgivning og workshops"
  },
  "eyebrow": {
    "en": "For businesses · B2B",
    "da": "Til virksomheder · B2B"
  },
  "shortDescription": {
    "en": "Work through your mobility question with us. Leave with a practical next step.",
    "da": "Arbejd med jeres mobilitetsspørgsmål sammen med os. Gå videre med et konkret næste skridt."
  },
  "introduction": {
    "en": "Hands-on workshops for businesses with parking, mobility or location questions. We bring your team together to understand the situation, explore options and decide what to do next.",
    "da": "Praktiske workshops til virksomheder med spørgsmål om parkering, mobilitet eller beliggenhed. Vi samler jeres team for at forstå situationen, udforske muligheder og aftale næste skridt."
  },
  "benefits": [
    {
      "en": "A shared understanding of the problem and the information you already have.",
      "da": "En fælles forståelse af problemet og den viden, I allerede har."
    },
    {
      "en": "Clarity about missing data, possible approaches and the trade-offs.",
      "da": "Klarhed om manglende data, mulige tilgange og afvejninger."
    },
    {
      "en": "Practical advice and agreed next steps your team can act on.",
      "da": "Praktisk rådgivning og aftalte næste skridt, som jeres team kan handle på."
    }
  ],
  "process": [
    {
      "en": "Bring your team, your questions and the information you already have.",
      "da": "Medbring jeres team, spørgsmål og den viden, I allerede har."
    },
    {
      "en": "Map the current situation together in a focused workshop.",
      "da": "Kortlæg den nuværende situation sammen i en fokuseret workshop."
    },
    {
      "en": "Explore options, interpret available data and identify what is missing.",
      "da": "Udforsk muligheder, fortolk eksisterende data og identificér, hvad der mangler."
    },
    {
      "en": "Agree practical next steps, ownership and any follow-up measurements.",
      "da": "Aftal konkrete næste skridt, ansvar og eventuelle opfølgende målinger."
    }
  ],
  "useCases": [],
  "heroImage": "/images/corporate/parking-consultation-charger.jpg",
  "relatedProjectSlugs": [],
  "contentStatus": "draft",
  "seo": {
    "title": {
      "en": "Business consultancy & workshops | Papp Mobility",
      "da": "Virksomhedsrådgivning og workshops | Papp Mobility"
    },
    "description": {
      "en": "Collaborative workshops and mobility advice for private businesses.",
      "da": "Samarbejdsbaserede workshops og mobilitetsrådgivning til private virksomheder."
    }
  }
}
];

export function getOfferings() {
  return offerings;
}

export function getOfferingBySlug(_locale: Locale, slug: string) {
  return offerings.find((offering) => offering.slug === slug);
}
