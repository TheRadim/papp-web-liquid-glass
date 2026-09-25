import Image from "next/image";
import { Camera, ChartNoAxesCombined, RadioTower, ShieldCheck } from "lucide-react";
import type { Locale } from "@/content/types";
import type { ServiceTool, ServiceTopic } from "@/content/services/service-topics";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeetingRequest } from "@/components/contact/MeetingRequest";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/content/accessors";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";

const tools: Record<ServiceTool, { icon: typeof Camera; name: { en: string; da: string }; body: { en: string; da: string }; cta: { en: string; da: string }; href: string }> = {
  cameras: {
    icon: Camera,
    name: { en: "Cameras", da: "Kameraer" },
    body: {
      en: "Count and classify vehicles, bikes and people over larger areas. GDPR compliant: number plates are processed on the camera and the data is anonymised.",
      da: "Tæller og klassificerer biler, cykler og fodgængere over større områder. GDPR-overholdende: nummerplader behandles i kameraet, og data anonymiseres."
    },
    cta: { en: "Read more about our cameras", da: "Læs mere om vores kameraer" },
    href: "/products/cameras"
  },
  sensors: {
    icon: RadioTower,
    name: { en: "On-ground sensors", da: "Jordmonterede sensorer" },
    body: {
      en: "A small sensor in each space tells whether it is free or taken, and for how long.",
      da: "En lille sensor i hver plads fortæller, om den er ledig eller optaget, og hvor længe."
    },
    cta: { en: "Read more about our sensors", da: "Læs mere om vores sensorer" },
    href: "/products/sensors"
  },
  insights: {
    icon: ChartNoAxesCombined,
    name: { en: "Papp Insights", da: "Papp Insights" },
    body: {
      en: "All results in one online dashboard, live and over time, ready to share and export.",
      da: "Alle resultater i ét online dashboard, live og over tid, klar til at dele og eksportere."
    },
    cta: { en: "Read more about Papp Insights", da: "Læs mere om Papp Insights" },
    href: "/products/insights"
  }
};

/** A simple page for one service topic: what it answers, how we measure it, and a meeting. */
export function ServiceTopicPage({ locale, topic }: { locale: Locale; topic: ServiceTopic }) {
  const da = locale === "da";
  const relatedProjects = getProjects(locale).filter((project) => topic.relatedProjectSlugs.includes(project.slug));
  const usesCameras = topic.tools.includes("cameras");

  return (
    <>
      <section className="subpage-hero">
        <div className="container">
          <div className="subpage-hero__grid">
            <div>
              <p className="eyebrow">{da ? "Ydelse" : "Service"}</p>
              <h1>{pick(locale, topic.name)}</h1>
              <p className="hero-lead">{pick(locale, topic.lead)}</p>
              <p>{pick(locale, topic.introduction)}</p>
              <Button href={`#${topic.slug}-meeting`}>{da ? "Tal med os" : "Talk to us"}</Button>
            </div>
            <Image src={withBasePath(topic.heroImage)} alt="" width={1672} height={941} priority sizes="(max-width: 992px) 100vw, 44vw" />
          </div>
        </div>
      </section>

      <Section>
        <div className="service-topic__answers">
          <SectionHeading eyebrow={da ? "Det får I svar på" : "What you find out"} title={da ? "Spørgsmål, vi hjælper med at besvare" : "Questions we help you answer"} />
          <ul className="check-list check-list--large">
            {topic.answers.map((answer) => <li key={answer.en}>{pick(locale, answer)}</li>)}
          </ul>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading eyebrow={da ? "Sådan måler vi" : "How we measure it"} title={da ? "Teknologien bag" : "The technology behind it"} align="center" />
        <div className="service-topic__tools">
          {topic.tools.map((tool) => {
            const item = tools[tool];
            const Icon = item.icon;
            return (
              <article key={tool}>
                <Icon aria-hidden="true" size={26} />
                <h3>{item.name[locale]}</h3>
                <p>{item.body[locale]}</p>
                <Button href={`/${locale}${item.href}`} variant="text">{item.cta[locale]}</Button>
              </article>
            );
          })}
        </div>
        {usesCameras ? (
          <p className="service-topic__gdpr"><ShieldCheck aria-hidden="true" size={18} />{da ? "Alle kameramålinger er GDPR-overholdende, og data anonymiseres før analysen." : "All camera measurements are GDPR compliant, and data is anonymised before analysis."}</p>
        ) : null}
      </Section>

      {relatedProjects.length ? (
        <Section>
          <SectionHeading eyebrow={da ? "Relaterede projekter" : "Related projects"} title={da ? "Se det i praksis" : "See it in practice"} />
          <div className="project-grid">
            {relatedProjects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}
          </div>
        </Section>
      ) : null}

      <Section className="service-meeting-section">
        <div id={`${topic.slug}-meeting`}><MeetingRequest locale={locale} source={topic.slug} /></div>
      </Section>
    </>
  );
}
