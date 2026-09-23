import type { Locale } from "@/content/types";
import type { HomeContent } from "@/content/home/home";
import { Button } from "@/components/ui/Button";
import { CapabilityStatement } from "@/components/hero/CapabilityStatement";
import { HeroMotionField } from "@/components/hero/HeroMotionField";

interface HomepageHeroProps {
  locale: Locale;
  content: HomeContent["hero"];
}

export function HomepageHero({ locale, content }: HomepageHeroProps) {
  const [brandFirstWord, ...brandRestWords] = content.title.split(" ");
  const brandSecondWord = brandRestWords.join(" ");

  return (
    <section className="hero-section">
      <HeroMotionField />
      <div className="container">
        <div className="hero-layout hero-layout--centered">
          <div className="hero-copy">
            {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
            <h1 className="hero-title tracking-in-expand">
              <span className="hero-title__word hero-title__word--papp">{brandFirstWord}</span>
              {brandSecondWord ? " " : null}
              {brandSecondWord ? (
                <span className="hero-title__word hero-title__word--mobility">{brandSecondWord}</span>
              ) : null}
            </h1>
            {content.lead ? <p className="hero-lead">{content.lead}</p> : null}
            <div className="hero-secondary">
              <CapabilityStatement locale={locale} />
              <div className="hero-actions">
                <Button href={`/${locale}/solutions`} variant="primary" className="hero-action hero-action--blue">
                  {content.primaryCta}
                </Button>
                <Button href={`/${locale}/projects`} variant="text" className="hero-action hero-action--salmon">
                  {content.secondaryCta}
                </Button>
              </div>
            </div>
            <a className="hero-scroll-cue" href="#movement-meaning" aria-label={locale === "da" ? "Gå til næste sektion" : "Scroll to next section"}>
              <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="10 15 20 25 30 15" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
