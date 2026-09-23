import type { Locale } from "@/content/types";

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  process: {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ title: string; body: string }>;
  };
  featured: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  contact: {
    title: string;
    body: string;
    cta: string;
  };
  app: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
}

export function getHomepageContent(locale: Locale): HomeContent {
  const content: Record<Locale, HomeContent> = {
    en: {
      hero: {
        eyebrow: "",
        title: "Papp Mobility",
        lead: "",
        body: "Reliable data gathering for parking, streets and mobility decisions.",
        primaryCta: "Explore our solutions",
        secondaryCta: "View projects"
      },
      process: {
        eyebrow: "From movement to meaning",
        title: "Understand movement. Make better decisions.",
        body: "We measure how people and vehicles use places, turn that activity into insight, and help cities and businesses decide where to invest, how to operate and what to improve.",
        steps: [
          { title: "Frame the question", body: "We start with the practical decision: capacity, flow, dwell time, user behaviour or a future investment." },
          { title: "Collect", body: "Sensors and cameras measure real-world activity across parking areas, streets and selected mobility environments." },
          { title: "Validate", body: "Data is checked, structured and connected so the picture is trustworthy enough to support planning." },
          { title: "Understand", body: "Papp Insights reveals utilisation, duration, occupancy and patterns through live and historical views." },
          { title: "Recommend", body: "Analysis and advisory turn the findings into clear next steps for cities, operators and partners." }
        ]
      },
      featured: {
        eyebrow: "Featured project",
        title: "Data reveals hidden parking capacity in Herning.",
        body: "Two parking areas at the same address showed very different occupancy patterns. Sensor data gave Herning a clearer picture of overlooked capacity and new ways to optimise the existing city centre.",
        cta: "See projects"
      },
      contact: {
        title: "Let's talk about what you need to understand.",
        body: "Bring us the mobility question, the site, or the decision you need to support. We will help define the right measurement approach.",
        cta: "Start the conversation"
      },
      app: {
        eyebrow: "Free app",
        title: "A public view of where Papp measures occupancy.",
        body: "Explore the app as a showcase of live parking datapoints and the places where Papp helps users understand available capacity.",
        cta: "Explore the app"
      }
    },
    da: {
      hero: {
        eyebrow: "",
        title: "Papp Mobility",
        lead: "",
        body: "Pålidelig dataindsamling til parkering, gader og mobilitetsbeslutninger.",
        primaryCta: "Udforsk løsninger",
        secondaryCta: "Se projekter"
      },
      process: {
        eyebrow: "Fra bevægelse til mening",
        title: "Forstå bevægelse. Træf bedre beslutninger.",
        body: "Vi måler, hvordan mennesker og køretøjer bruger steder, omsætter aktiviteten til indsigt og hjælper byer og virksomheder med at prioritere investeringer, drift og forbedringer.",
        steps: [
          { title: "Definer spørgsmålet", body: "Vi starter med den praktiske beslutning: kapacitet, flow, opholdstid, brugeradfærd eller en fremtidig investering." },
          { title: "Indsaml", body: "Sensorer og kameraer måler aktivitet på parkeringsarealer, gader og udvalgte mobilitetsmiljøer." },
          { title: "Valider", body: "Data kontrolleres, struktureres og kobles sammen, så billedet er solidt nok til planlægning." },
          { title: "Forstå", body: "Papp Insights viser udnyttelse, varighed, belægning og mønstre gennem live og historiske visninger." },
          { title: "Anbefal", body: "Analyse og rådgivning omsætter resultaterne til tydelige næste skridt for byer, operatører og partnere." }
        ]
      },
      featured: {
        eyebrow: "Udvalgt projekt",
        title: "Data afslører skjult parkeringskapacitet i Herning.",
        body: "To parkeringsarealer på samme adresse viste meget forskellige belægningsmønstre. Sensordata gav Herning et klarere billede af overset kapacitet og nye muligheder for at optimere den eksisterende bymidte.",
        cta: "Se projekter"
      },
      contact: {
        title: "Lad os tale om, hvad I har brug for at forstå.",
        body: "Kom med mobilitetsspørgsmålet, området eller beslutningen, I skal understøtte. Vi hjælper med at definere den rigtige målemetode.",
        cta: "Start dialogen"
      },
      app: {
        eyebrow: "Gratis app",
        title: "Et offentligt indblik i hvor Papp måler belægning.",
        body: "Udforsk appen som et showcase for live parkeringsdatapunkter og de steder, hvor Papp hjælper brugere med at forstå ledig kapacitet.",
        cta: "Udforsk appen"
      }
    }
  };

  return content[locale];
}
