import Image from "next/image";
import Link from "next/link";
import type { Locale, Project } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const categoryLabels = {
    sensors: { en: "Sensors", da: "Sensorer" },
    cameras: { en: "Cameras", da: "Kameraer" },
    analysis: { en: "Analysis", da: "Analyse" },
    consultancy: { en: "Consultancy", da: "Rådgivning" }
  };

  return (
    <article className={`project-card project-card--${project.category}`}>
      <Image src={withBasePath(project.coverImage)} alt="" width={1672} height={941} sizes="(max-width: 768px) 100vw, 33vw" />
      <div>
        <p className="project-card__category">{pick(locale, categoryLabels[project.category])}</p>
        <h3>{pick(locale, project.title)}</h3>
        <p className="project-card__client">{project.clientName}</p>
        <p>{pick(locale, project.summary)}</p>
        <Link className="project-card__link" aria-label={`${locale === "da" ? "Se projekt" : "View project"}: ${pick(locale, project.title)}`} href={`/${locale}/projects/${project.slug}`}>{locale === "da" ? "Se projekt" : "View project"}</Link>
      </div>
    </article>
  );
}
