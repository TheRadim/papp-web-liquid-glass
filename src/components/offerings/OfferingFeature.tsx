import Image from "next/image";
import type { Locale, Offering } from "@/content/types";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";
import { Button } from "@/components/ui/Button";

interface OfferingFeatureProps {
  offering: Offering;
  locale: Locale;
  index: number;
}

export function OfferingFeature({ offering, locale, index }: OfferingFeatureProps) {
  const isService = offering.category === "analysis" || offering.category === "consultancy";
  const href = offering.slug === "app" ? `/${locale}/app` : isService ? `/${locale}/services/${offering.slug}` : `/${locale}/products/${offering.slug}`;

  return (
    <section id={`solution-${offering.slug}`} className={`offering-feature ${index % 2 ? "offering-feature--reverse" : ""}`}>
      <div className="offering-feature__visual">
        <Image src={withBasePath(offering.heroImage)} alt="" width={1672} height={941} sizes="(max-width: 992px) 100vw, 44vw" />
      </div>
      <div className="offering-feature__copy">
        <p className="eyebrow">{offering.eyebrow ? pick(locale, offering.eyebrow) : ""}</p>
        <h2>{pick(locale, offering.name)}</h2>
        <p>{pick(locale, offering.introduction)}</p>
        <ul className="check-list">
          {offering.benefits.slice(0, 3).map((benefit) => (
            <li key={pick(locale, benefit)}>{pick(locale, benefit)}</li>
          ))}
        </ul>
        {/* Papp Insights is the one offering highlighted with the coral button. */}
        <Button href={href} variant={offering.slug === "insights" ? "dark" : "secondary"}>
          {locale === "da" ? "Læs mere" : "Learn more"}
        </Button>
      </div>
    </section>
  );
}
