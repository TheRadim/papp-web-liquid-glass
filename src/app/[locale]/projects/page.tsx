import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { getProjects } from "@/lib/content/accessors";
import { pageMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectPortfolioFilter } from "@/components/projects/ProjectPortfolioFilter";

const workSteps = [
  {
    title: { en: "Scope the question", da: "Afklar spørgsmålet" },
    body: { en: "We define the decision, the site and the behaviour that needs to be understood.", da: "Vi afklarer beslutningen, stedet og den adfærd, der skal forstås." }
  },
  {
    title: { en: "Measure the real world", da: "Mål virkeligheden" },
    body: { en: "Sensors, cameras or existing data sources are selected to match the project.", da: "Sensorer, kameraer eller eksisterende datakilder vælges ud fra projektet." }
  },
  {
    title: { en: "Turn data into insight", da: "Gør data til indsigt" },
    body: { en: "Papp Insights and analysis reveal occupancy, flow, dwell time and patterns.", da: "Papp Insights og analyse viser belægning, flow, opholdstid og mønstre." }
  },
  {
    title: { en: "Recommend next steps", da: "Anbefal næste skridt" },
    body: { en: "We translate findings into practical actions for cities, operators and partners.", da: "Vi omsætter indsigter til praktiske handlinger for byer, operatører og partnere." }
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      title: { en: "Projects | Papp Mobility", da: "Projekter | Papp Mobility" },
      description: {
        en: "Selected Papp Mobility projects across sensors, cameras, analysis and advisory.",
        da: "Udvalgte Papp Mobility-projekter med sensorer, kameraer, analyse og rådgivning."
      }
    },
    "/projects"
  );
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const projects = getProjects(locale);

  return (
    <>
      <div className="projects-net-zone">
        <Section className="projects-page">
          <div className="projects-hero">
            <SectionHeading
              eyebrow={locale === "da" ? "Projekter" : "Projects"}
              title={locale === "da" ? "Mobilitetsprojekter baseret på reel adfærd." : "Mobility projects built around real behaviour."}
              body={
                locale === "da"
                  ? "Vi hjælper byer, operatører og partnere med at bruge sensorer, kameraer og analyse til at forstå parkering og bevægelse i praksis."
                  : "We help cities, operators and partners use sensors, cameras and analysis to understand parking and movement in practice."
              }
            />
          </div>
        </Section>
      </div>
      <Section tone="soft" className="project-listing-section">
        <SectionHeading
          eyebrow={locale === "da" ? "Portfolio" : "Portfolio"}
          title={locale === "da" ? "Udvalgte projekter." : "Selected projects."}
          body={
            locale === "da"
              ? "Filtrer projekterne efter teknologi og projektform, og gå videre til de enkelte cases."
              : "Filter the projects by technology and project type, then open the individual cases."
          }
          align="center"
        />
        <ProjectPortfolioFilter locale={locale} projects={projects} />
      </Section>
      <Section className="project-work-section">
          <SectionHeading
            eyebrow={locale === "da" ? "Sådan arbejder vi" : "How we work"}
            title={locale === "da" ? "Fra lokalt spørgsmål til konkret anbefaling." : "From local question to practical recommendation."}
            body={
              locale === "da"
                ? "En enkel proces, der forbinder målinger, analyse og rådgivning uden at gøre projektet tungere end nødvendigt."
                : "A simple process that connects measurement, analysis and advisory without making the project heavier than it needs to be."
            }
            align="center"
          />
          <div className="project-workflow">
            {workSteps.map((step, index) => (
              <article className={`project-workflow__step project-workflow__step--${index % 2 === 0 ? "left" : "right"}`} key={step.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title[locale]}</h3>
                  <p>{step.body[locale]}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
    </>
  );
}
