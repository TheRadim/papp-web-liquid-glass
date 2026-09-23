import Image from "next/image";
import type { Locale } from "@/content/types";
import type { HomeContent } from "@/content/home/home";
import { company } from "@/content/global/company";
import { withBasePath } from "@/lib/site/basePath";
import { Button } from "@/components/ui/Button";

interface AppPromotionProps {
  locale: Locale;
  content: HomeContent["app"];
  showCta?: boolean;
}

export function AppPromotion({ locale, content, showCta = true }: AppPromotionProps) {
  return (
    <section className={`app-promo ${showCta ? "app-promo--homepage" : "app-promo--page"}`}>
      <div className="container app-promo__grid">
        <div className="app-phone-stage">
          <Image className="app-phone" src={withBasePath("/images/app/feature-1.webp")} alt={locale === "da" ? "Papp App viser ledige parkeringspladser" : "Papp App showing available parking spaces"} width={600} height={1300} />
        </div>
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          {showCta ? <Button href={`/${locale}/app`} variant="secondary">{content.cta}</Button> : null}
          <div className="store-badges" aria-label={locale === "da" ? "Download appen" : "Download the app"}>
            <a href={company.appStoreUrl} target="_blank" rel="noreferrer">
              <Image src={withBasePath("/images/app/appstore-badge.png")} alt="Download on the App Store" width={193} height={66} />
            </a>
            <a href={company.googlePlayUrl} target="_blank" rel="noreferrer">
              <Image src={withBasePath("/images/app/googleplay-badge.png")} alt="Get it on Google Play" width={193} height={65} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
