import type { LocalisedText, SeoContent } from "@/content/types";

/** Which Papp product a service is measured with; each links to its product page. */
export type ServiceTool = "cameras" | "sensors" | "insights";

export interface ServiceTopic {
  slug: string;
  name: LocalisedText;
  /** One plain sentence, also used in the navigation dropdown. */
  navDescription: LocalisedText;
  lead: LocalisedText;
  introduction: LocalisedText;
  /** Questions the service answers, in the visitor's own words. */
  answers: LocalisedText[];
  tools: ServiceTool[];
  heroImage: string;
  relatedProjectSlugs: string[];
  seo: SeoContent;
}

export const serviceTopics: ServiceTopic[] = [
  {
    slug: "parking-counting",
    name: { en: "Parking counting", da: "Parkeringstælling" },
    navDescription: { en: "How many spaces are taken, hour by hour.", da: "Hvor mange pladser er optaget, time for time." },
    lead: {
      en: "Know how full your parking is, at any time of day.",
      da: "Vid hvor fyldt jeres parkering er, på alle tider af døgnet."
    },
    introduction: {
      en: "We count occupied and free spaces continuously, from a single car park to a whole town centre. You see the numbers live and look back over weeks and months.",
      da: "Vi tæller optagede og ledige pladser løbende, fra en enkelt parkeringsplads til en hel bymidte. I ser tallene live og kan se tilbage over uger og måneder."
    },
    answers: [
      { en: "How many spaces are used right now?", da: "Hvor mange pladser er i brug lige nu?" },
      { en: "When does the car park get full, and on which days?", da: "Hvornår bliver pladsen fuld, og på hvilke dage?" },
      { en: "How long do cars stay?", da: "Hvor længe holder bilerne?" },
      { en: "Are accessible and charging spaces used as intended?", da: "Bruges handicap- og ladepladser som tiltænkt?" }
    ],
    tools: ["sensors", "cameras", "insights"],
    heroImage: "/images/corporate/parking-sensor-hand.jpg",
    relatedProjectSlugs: ["sensordata-herning", "handicap-og-ladepladser-gentofte", "iot-teknologi-varde"],
    seo: {
      title: { en: "Parking counting | Papp Mobility", da: "Parkeringstælling | Papp Mobility" },
      description: {
        en: "Count occupied and free parking spaces live and over time with Papp sensors and cameras.",
        da: "Tæl optagede og ledige parkeringspladser live og over tid med Papps sensorer og kameraer."
      }
    }
  },
  {
    slug: "traffic-counting",
    name: { en: "Traffic counting", da: "Trafiktælling" },
    navDescription: { en: "How many cars, bikes and people pass by.", da: "Hvor mange biler, cykler og fodgængere der kommer forbi." },
    lead: {
      en: "Count cars, bikes and people on your streets.",
      da: "Tæl biler, cykler og fodgængere i jeres gader."
    },
    introduction: {
      en: "Our cameras count everything that passes a point or crosses a line, split by type, direction and time. The counts are anonymous and ready to compare from day one.",
      da: "Vores kameraer tæller alt, der passerer et punkt eller krydser en linje, fordelt på type, retning og tidspunkt. Tællingerne er anonyme og klar til at sammenligne fra første dag."
    },
    answers: [
      { en: "How much traffic passes here each day?", da: "Hvor meget trafik kommer her forbi hver dag?" },
      { en: "How many are cars, bikes, vans or people on foot?", da: "Hvor mange er biler, cykler, varebiler eller fodgængere?" },
      { en: "Which direction do they go, and when is the rush?", da: "Hvilken retning kører de, og hvornår er myldretiden?" },
      { en: "Did a change to the street make a difference?", da: "Gjorde en ændring af gaden en forskel?" }
    ],
    tools: ["cameras", "insights"],
    heroImage: "/images/camera/installed-camera.webp",
    relatedProjectSlugs: ["damhustorvet-camera-monitoring", "kystparkering-thisted"],
    seo: {
      title: { en: "Traffic counting | Papp Mobility", da: "Trafiktælling | Papp Mobility" },
      description: {
        en: "Anonymous counts of cars, bikes and pedestrians by type, direction and time with GDPR-compliant cameras.",
        da: "Anonyme tællinger af biler, cykler og fodgængere efter type, retning og tidspunkt med GDPR-overholdende kameraer."
      }
    }
  },
  {
    slug: "parking-analysis",
    name: { en: "Parking analysis", da: "Parkeringsanalyse" },
    navDescription: { en: "When and where parking gets full, and what to do about it.", da: "Hvornår og hvor parkeringen bliver fuld, og hvad I kan gøre ved det." },
    lead: {
      en: "Understand how your parking is really used before you build, charge or change it.",
      da: "Forstå hvordan jeres parkering faktisk bruges, før I bygger, tager betaling eller ændrer den."
    },
    introduction: {
      en: "We turn parking counts into clear answers: where pressure builds up, where capacity sits unused, and which changes are likely to help. You get the findings explained, not just the data.",
      da: "Vi gør parkeringstællinger til klare svar: hvor presset opstår, hvor kapaciteten står ubrugt, og hvilke ændringer der sandsynligvis hjælper. I får resultaterne forklaret, ikke kun data."
    },
    answers: [
      { en: "Do we need more spaces, or better use of the ones we have?", da: "Har vi brug for flere pladser eller bedre brug af dem, vi har?" },
      { en: "Where is there hidden capacity?", da: "Hvor er der skjult kapacitet?" },
      { en: "How would time limits or paid parking change things?", da: "Hvad ville tidsbegrænsning eller betalingsparkering ændre?" },
      { en: "How busy will it be next month?", da: "Hvor travlt bliver der næste måned?" }
    ],
    tools: ["sensors", "cameras", "insights"],
    heroImage: "/images/corporate/parking-tablet-review.jpg",
    relatedProjectSlugs: ["sensordata-herning", "parkeringsmoenstre-ishoej", "dataoptimering-faaborg"],
    seo: {
      title: { en: "Parking analysis | Papp Mobility", da: "Parkeringsanalyse | Papp Mobility" },
      description: {
        en: "Find parking pressure, hidden capacity and the changes that help, explained in plain language.",
        da: "Find parkeringspres, skjult kapacitet og de ændringer, der hjælper, forklaret i et klart sprog."
      }
    }
  },
  {
    slug: "traffic-analysis",
    name: { en: "Traffic analysis", da: "Trafikanalyse" },
    navDescription: { en: "Rush hours, flows and routes on your streets.", da: "Myldretider, strømme og ruter i jeres gader." },
    lead: {
      en: "See how people and vehicles move through your area.",
      da: "Se hvordan mennesker og køretøjer bevæger sig gennem jeres område."
    },
    introduction: {
      en: "We combine counts from several points into one picture of movement: peaks, flows between places and how they change over time. It gives a solid basis for street design, trials and planning.",
      da: "Vi samler tællinger fra flere punkter til ét billede af bevægelsen: peaks, strømme mellem steder og hvordan de ændrer sig over tid. Det giver et solidt grundlag for gadedesign, forsøg og planlægning."
    },
    answers: [
      { en: "When and where does traffic build up?", da: "Hvornår og hvor hober trafikken sig op?" },
      { en: "How do cars, bikes and pedestrians share the street?", da: "Hvordan deler biler, cykler og fodgængere gaden?" },
      { en: "What changed after a trial or a new road layout?", da: "Hvad ændrede sig efter et forsøg eller en ny vejindretning?" },
      { en: "How does traffic differ between weekdays, weekends and seasons?", da: "Hvordan adskiller trafikken sig mellem hverdage, weekender og sæsoner?" }
    ],
    tools: ["cameras", "insights"],
    heroImage: "/images/projects/cameras/kystparkering-thisted-cover.jpg",
    relatedProjectSlugs: ["kystparkering-thisted", "damhustorvet-camera-monitoring"],
    seo: {
      title: { en: "Traffic analysis | Papp Mobility", da: "Trafikanalyse | Papp Mobility" },
      description: {
        en: "Understand peaks, flows and the effect of changes on your streets with anonymous camera data.",
        da: "Forstå peaks, strømme og effekten af ændringer i jeres gader med anonyme kameradata."
      }
    }
  },
  {
    slug: "demographic-analysis",
    name: { en: "Demographic analysis", da: "Demografisk analyse" },
    navDescription: { en: "Where your visitors come from and what they drive.", da: "Hvor jeres besøgende kommer fra, og hvad de kører i." },
    lead: {
      en: "Get to know the people who visit your area.",
      da: "Lær de mennesker at kende, der besøger jeres område."
    },
    introduction: {
      en: "From anonymised vehicle data we show where visitors come from, by country or postcode, and what kind of vehicles they use, including the share of electric cars. Results are always shown in groups, never for individual people.",
      da: "Ud fra anonymiserede køretøjsdata viser vi, hvor de besøgende kommer fra, på land eller postnummer, og hvilke køretøjer de bruger, herunder andelen af elbiler. Resultaterne vises altid samlet, aldrig for enkeltpersoner."
    },
    answers: [
      { en: "Are visitors local, regional or from abroad?", da: "Er de besøgende lokale, fra regionen eller fra udlandet?" },
      { en: "Which postcodes and countries do they come from?", da: "Hvilke postnumre og lande kommer de fra?" },
      { en: "How many drive electric, and how old are the cars?", da: "Hvor mange kører elbil, og hvor gamle er bilerne?" },
      { en: "Does the mix change with seasons and events?", da: "Ændrer sammensætningen sig med sæsoner og arrangementer?" }
    ],
    tools: ["cameras", "insights"],
    heroImage: "/images/corporate/insights-screen.jpg",
    relatedProjectSlugs: ["kystparkering-thisted", "parkeringsmoenstre-ishoej"],
    seo: {
      title: { en: "Demographic analysis | Papp Mobility", da: "Demografisk analyse | Papp Mobility" },
      description: {
        en: "See where visitors come from and what they drive, from anonymised vehicle data.",
        da: "Se hvor de besøgende kommer fra, og hvad de kører i, ud fra anonymiserede køretøjsdata."
      }
    }
  },
  {
    slug: "charging-analysis",
    name: { en: "EV charging analysis", da: "Ladeanalyse" },
    navDescription: { en: "How chargers are used and where more are needed.", da: "Hvordan ladere bruges, og hvor der mangler flere." },
    lead: {
      en: "Plan charging around how people actually charge.",
      da: "Planlæg opladning efter, hvordan folk faktisk lader."
    },
    introduction: {
      en: "We measure how often charging spaces are used, how long cars stay and whether non-electric cars take the spaces. Together with the share of electric cars in the area, it shows where new chargers make the most difference.",
      da: "Vi måler, hvor ofte ladepladser bruges, hvor længe bilerne holder, og om almindelige biler optager pladserne. Sammen med andelen af elbiler i området viser det, hvor nye ladere gør størst forskel."
    },
    answers: [
      { en: "Are our chargers busy or standing empty?", da: "Er vores ladere optaget eller står de tomme?" },
      { en: "Do cars stay long after they are charged?", da: "Holder bilerne længe efter, de er ladet op?" },
      { en: "Do other cars block the charging spaces?", da: "Blokerer andre biler ladepladserne?" },
      { en: "Where should the next chargers go?", da: "Hvor skal de næste ladere stå?" }
    ],
    tools: ["sensors", "cameras", "insights"],
    heroImage: "/images/corporate/parking-ev-plug.jpg",
    relatedProjectSlugs: ["ladeindsigter-frederiksberg", "handicap-og-ladepladser-gentofte"],
    seo: {
      title: { en: "EV charging analysis | Papp Mobility", da: "Ladeanalyse | Papp Mobility" },
      description: {
        en: "Measure how charging spaces are used and find where new chargers help most.",
        da: "Mål hvordan ladepladser bruges, og find ud af, hvor nye ladere hjælper mest."
      }
    }
  }
];

export function getServiceTopic(slug: string) {
  return serviceTopics.find((topic) => topic.slug === slug);
}
