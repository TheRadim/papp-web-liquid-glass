import type { ReactNode } from "react";
import Image from "next/image";
import { Camera, ChartNoAxesCombined, RadioTower, ShieldCheck } from "lucide-react";
import type { Locale } from "@/content/types";
import type { ServiceTool, ServiceTopic } from "@/content/services/service-topics";
import { exampleData, serviceTopicDetails, type ServiceSection } from "@/content/services/service-topic-details";
import { ServiceSignatureChart } from "@/components/offerings/ServiceSignatureChart";
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

/** One service topic page. Each topic picks its own sections, order and signature chart. */
export function ServiceTopicPage({ locale, topic }: { locale: Locale; topic: ServiceTopic }) {
  const da = locale === "da";
  const details = serviceTopicDetails[topic.slug];
  const relatedProjects = getProjects(locale).filter((project) => topic.relatedProjectSlugs.includes(project.slug));
  const usesCameras = topic.tools.includes("cameras");

  const sections: Record<ServiceSection, () => ReactNode> = {
    stats: () => (
      <Section key="stats" className="service-topic__stats-section">
        <div className="service-topic__stats">
          {details.stats.map((stat) => (
            <div key={stat.value.en}>
              <strong>{pick(locale, stat.value)}</strong>
              <span>{pick(locale, stat.label)}</span>
            </div>
          ))}
        </div>
      </Section>
    ),
    signature: () => (
      <Section key="signature" tone="soft" className="service-topic__signature-section">
        <div className="service-topic__signature">
          <div>
            <SectionHeading eyebrow={pick(locale, details.signature.eyebrow)} title={pick(locale, details.signature.title)} body={pick(locale, details.signature.body)} />
          </div>
          <figure className="service-topic__chart">
            <span className="service-topic__chart-tag">{pick(locale, exampleData)}</span>
            <ServiceSignatureChart chart={details.signature.chart} locale={locale} label={pick(locale, details.signature.title)} />
            <figcaption>{pick(locale, details.signature.caption)}</figcaption>
          </figure>
        </div>
      </Section>
    ),
    answers: () => (
      <Section key="answers">
        <div className="service-topic__answers">
          <SectionHeading eyebrow={da ? "Det får I svar på" : "What you find out"} title={da ? "Spørgsmål, vi hjælper med at besvare" : "Questions we help you answer"} />
          <ol className="service-topic__questions">
            {topic.answers.map((answer) => <li key={answer.en}>{pick(locale, answer)}</li>)}
          </ol>
        </div>
      </Section>
    ),
    steps: () => (
      <Section key="steps">
        <SectionHeading eyebrow={da ? "Forløbet" : "How it runs"} title={da ? "Fra første møde til resultater" : "From first meeting to results"} align="center" />
        <ol className="service-topic__steps">
          {details.steps.map((step, index) => (
            <li key={step.title.en}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{pick(locale, step.title)}</h3>
              <p>{pick(locale, step.body)}</p>
            </li>
          ))}
        </ol>
      </Section>
    ),
    deliverables: () => (
      <Section key="deliverables" tone="soft">
        <div className="service-topic__deliverables">
          <SectionHeading
            eyebrow={da ? "Det får I" : "What you get"}
            title={da ? "Leveret, forklaret og klar til brug" : "Delivered, explained and ready to use"}
            body={da ? "Alle resultater ligger også i Papp Insights, hvor I kan dykke ned i data selv." : "All results are also in Papp Insights, where you can dig into the data yourselves."}
          />
          <ul className="check-list check-list--large">
            {details.deliverables.map((item) => <li key={item.en}>{pick(locale, item)}</li>)}
          </ul>
        </div>
      </Section>
    ),
    "use-cases": () => (
      <Section key="use-cases">
        <SectionHeading eyebrow={da ? "Hvem bruger det" : "Who uses it"} title={da ? "Typiske opgaver" : "Typical projects"} />
        <div className="service-topic__cases">
          {details.useCases.map((useCase) => (
            <article key={useCase.title.en}>
              <h3>{pick(locale, useCase.title)}</h3>
              <p>{pick(locale, useCase.body)}</p>
            </article>
          ))}
        </div>
      </Section>
    ),
    tools: () => (
      <Section key="tools" tone="soft">
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
    ),
    projects: () =>
      relatedProjects.length ? (
        <Section key="projects">
          <SectionHeading eyebrow={da ? "Relaterede projekter" : "Related projects"} title={da ? "Se det i praksis" : "See it in practice"} />
          <div className="project-grid">
            {relatedProjects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}
          </div>
        </Section>
      ) : null,
    faq: () => (
      <Section key="faq">
        <div className="service-topic__faq">
          <SectionHeading eyebrow={da ? "Ofte stillede spørgsmål" : "Questions we often get"} title={da ? "Godt at vide" : "Good to know"} />
          <div>
            {details.faq.map((item) => (
              <details key={item.question.en}>
                <summary>{pick(locale, item.question)}</summary>
                <p>{pick(locale, item.answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    )
  };

  return (
    <div className={`service-topic service-topic--${details.accent}`}>
      <section className="subpage-hero">
        <div className="container">
          <div className={`subpage-hero__grid${details.imageFirst ? " service-topic__hero--image-first" : ""}`}>
            <div>
              <p className="eyebrow">{pick(locale, details.eyebrow)}</p>
              <h1>{pick(locale, topic.name)}</h1>
              <p className="hero-lead">{pick(locale, topic.lead)}</p>
              <p>{pick(locale, topic.introduction)}</p>
              <Button href={`#${topic.slug}-meeting`}>{da ? "Tal med os" : "Talk to us"}</Button>
            </div>
            <Image src={withBasePath(topic.heroImage)} alt="" width={1672} height={941} priority sizes="(max-width: 992px) 100vw, 44vw" />
          </div>
        </div>
      </section>

      {details.sections.map((section) => sections[section]())}

      <Section className="service-meeting-section">
        <div id={`${topic.slug}-meeting`}><MeetingRequest locale={locale} source={topic.slug} /></div>
      </Section>
    </div>
  );
}
