import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/content/types";
import { getProjectBySlug, getProjects, getTestimonialBySlug } from "@/lib/content/accessors";
import { pageMetadata } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return getProjects("en").flatMap((project) => [
    { locale: "en", slug: project.slug },
    { locale: "da", slug: project.slug }
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) return {};
  return pageMetadata(locale, project.seo, `/projects/${project.slug}`);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) notFound();
  const testimonial = project.testimonialSlug ? getTestimonialBySlug(project.testimonialSlug) : undefined;

  const categoryLabels = {
    sensors: { en: "Sensor project", da: "Sensorprojekt" },
    cameras: { en: "Camera project", da: "Kameraprojekt" },
    analysis: { en: "Analysis project", da: "Analyseprojekt" },
    consultancy: { en: "Advisory project", da: "Rådgivningsprojekt" }
  };

  return (
    <>
      <section className="project-article-hero">
        <div className="container">
          <div className="project-article-hero__inner">
            <Link className="project-back-link" href={`/${locale}/projects`}>
              <ArrowLeft aria-hidden="true" size={16} />
              {locale === "da" ? "Tilbage til projekter" : "Back to projects"}
            </Link>
            <p className="eyebrow">
              {pick(locale, categoryLabels[project.category])} / {project.clientName}
            </p>
            <h1>{pick(locale, project.title)}</h1>
            <p className="hero-lead">{pick(locale, project.summary)}</p>
          </div>
          <Image
            className="project-article-hero__image"
            src={withBasePath(project.coverImage)}
            alt=""
            width={1672}
            height={941}
            priority
            sizes="(max-width: 992px) 100vw, 920px"
          />
        </div>
      </section>
      <Section className="project-article-section">
        <div className="project-article-layout">
          <div className="project-article-body">
            {project.challenge ? (
              <article>
                <p className="eyebrow">{locale === "da" ? "Udfordring" : "Challenge"}</p>
                <h2>{locale === "da" ? "Hvad skulle forstås." : "What needed to be understood."}</h2>
                <p>{pick(locale, project.challenge)}</p>
              </article>
            ) : null}
            {project.approach ? (
              <article>
                <p className="eyebrow">{locale === "da" ? "Tilgang" : "Approach"}</p>
                <h2>{locale === "da" ? "Fra måling til overblik." : "From measurement to clarity."}</h2>
                <p>{pick(locale, project.approach)}</p>
              </article>
            ) : null}
            {project.result ? (
              <article>
                <p className="eyebrow">{locale === "da" ? "Resultat" : "Outcome"}</p>
                <h2>{locale === "da" ? "Et stærkere beslutningsgrundlag." : "A stronger basis for decisions."}</h2>
                <p>{pick(locale, project.result)}</p>
              </article>
            ) : null}
            {testimonial ? (
              <blockquote className="project-quote-card">
                <p>{pick(locale, testimonial.quote)}</p>
                <cite>{testimonial.organisation}</cite>
              </blockquote>
            ) : null}
            <div className="project-article-cta">
              <Button href={`/${locale}/contact`} variant="secondary">
                {locale === "da" ? "Tal om et lignende projekt" : "Discuss a similar project"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
      {project.gallery?.length ? (
        <Section tone="soft" className="project-article-gallery-section">
          <div className="project-group__heading">
            <p className="eyebrow">{locale === "da" ? "Billeder" : "Images"}</p>
            <h2>{locale === "da" ? "Fra projektet." : "From the project."}</h2>
          </div>
          <div className="project-gallery">
            {project.gallery.map((image) => (
              <Image key={image} src={withBasePath(image)} alt="" width={1400} height={950} sizes="(max-width: 768px) 100vw, 50vw" />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
