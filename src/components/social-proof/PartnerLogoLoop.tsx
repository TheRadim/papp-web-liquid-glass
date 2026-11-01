import Image from "next/image";
import { getPartners } from "@/lib/content/accessors";
import { withBasePath } from "@/lib/site/basePath";

export function PartnerLogoLoop() {
  const partners = getPartners();

  return (
    <div className="partner-strip" aria-label="Papp Mobility partners and collaborators">
      <div className="partner-track">
        {[0, 1].map((copy) => (
          <div className="partner-track__group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {partners.map((partner) => (
              <span key={partner.slug} data-partner={partner.slug}>
                {partner.logo ? <Image src={withBasePath(partner.logo)} alt={copy === 0 ? partner.name : ""} width={150} height={80} loading="eager" unoptimized /> : partner.name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
