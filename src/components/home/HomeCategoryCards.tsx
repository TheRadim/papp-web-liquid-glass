import Image from "next/image";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/site/basePath";

const categories = [
  {
    title: { en: "Papp Insights", da: "Papp Insights" },
    eyebrow: { en: "Platform", da: "Platform" },
    body: {
      en: "Papp Insights is the platform at the centre of everything we do: live views, historical comparisons and reports from every site you measure.",
      da: "Papp Insights er platformen i centrum af alt, hvad vi laver: livevisninger, historiske sammenligninger og rapporter fra alle de steder, I måler."
    },
    benefits: {
      en: ["Maps, charts and live views", "Historical comparisons", "One place for mobility data"],
      da: ["Kort, grafer og livevisninger", "Historiske sammenligninger", "Ét sted til mobilitetsdata"]
    },
    image: "/images/corporate/insights-screen.jpg",
    href: "/products/insights",
    cta: { en: "Open Insights", da: "Åbn Insights" }
  },
  {
    title: { en: "Cameras and sensors", da: "Kameraer og sensorer" },
    eyebrow: { en: "How the data is delivered", da: "Sådan leveres data" },
    body: {
      en: "The platform is delivered through our own cameras and sensors, which measure real behaviour in parking areas, streets and mobility environments.",
      da: "Platformen leveres gennem vores egne kameraer og sensorer, som måler reel adfærd på parkeringsarealer, gader og mobilitetsmiljøer."
    },
    benefits: {
      en: ["Live occupancy signals", "Area and street measurement", "Temporary or permanent deployments"],
      da: ["Live belægningssignaler", "Måling af arealer og gader", "Midlertidige eller permanente opsætninger"]
    },
    image: "/images/corporate/parking-sensor-ground.jpg",
    href: "/solutions",
    cta: { en: "Explore technology", da: "Udforsk teknologi" }
  },
  {
    title: { en: "Consultancy & workshops", da: "Rådgivning og workshops" },
    eyebrow: { en: "For businesses", da: "For virksomheder" },
    body: {
      en: "Hands-on workshops to clarify your business’s mobility questions, interpret existing information and agree practical next steps.",
      da: "Praktiske workshops, hvor vi afklarer virksomhedens mobilitetsspørgsmål, fortolker eksisterende viden og aftaler næste skridt."
    },
    benefits: {
      en: ["Understand the current situation", "Identify missing data", "Agree practical next steps"],
      da: ["Forstå den nuværende situation", "Identificér manglende data", "Aftal praktiske næste skridt"]
    },
    image: "/images/corporate/insights-meeting-city.jpg",
    href: "/services/consultancy",
    cta: { en: "See expertise", da: "Se ekspertise" }
  }
];

interface HomeCategoryCardsProps {
  locale: Locale;
}

export function HomeCategoryCards({ locale }: HomeCategoryCardsProps) {
  return (
    <div className="home-solution-list">
      {categories.map((category, index) => (
        <article className={`home-solution-row ${index % 2 ? "home-solution-row--reverse" : ""}`} key={category.title.en}>
          <div className="home-solution-row__visual">
            <Image
              src={withBasePath(category.image)}
              alt=""
              width={1672}
              height={941}
              sizes="(max-width: 992px) 100vw, 42vw"
            />
          </div>
          <div className="home-solution-row__copy">
            <p className="eyebrow">{category.eyebrow[locale]}</p>
            <h3>{category.title[locale]}</h3>
            <p>{category.body[locale]}</p>
            <ul className="check-list">
              {category.benefits[locale].map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <Button href={`/${locale}${category.href}`} variant="text">
              {category.cta[locale]}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
