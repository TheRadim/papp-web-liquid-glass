import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { getProjects } from "@/lib/content/accessors";
import { pageMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectPortfolioFilter } from "@/components/projects/ProjectPortfolioFilter";

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

    </>
  );
}
