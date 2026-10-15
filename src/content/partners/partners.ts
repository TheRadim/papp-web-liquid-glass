import type { Partner } from "@/content/types";

const partners: Partner[] = [
  {"slug": "varde", "name": "Varde Kommune", "logo": "/images/partners/varde.svg", "category": "client", "published": true},
  {"slug": "thisted", "name": "Thisted Kommune", "logo": "/images/partners/thisted.svg", "category": "client", "published": true},
  {"slug": "aalborg", "name": "Aalborg Kommune", "logo": "/images/partners/aalborg.svg", "category": "client", "published": true},
  {"slug": "aarhus", "name": "Aarhus Kommune", "logo": "/images/partners/aarhus.svg", "category": "client", "published": true},
  {"slug": "ishoej", "name": "Ishøj Kommune", "logo": "/images/partners/ishoej.svg", "category": "client", "published": true},
  {"slug": "herning", "name": "Herning Kommune", "logo": "/images/partners/herning.svg", "category": "client", "published": true},
  {"slug": "gentofte", "name": "Gentofte Kommune", "logo": "/images/partners/gentofte.svg", "category": "client", "published": true},
  {"slug": "frederiksberg", "name": "Frederiksberg Kommune", "logo": "/images/partners/frederiksberg.svg", "category": "client", "published": true},
  {"slug": "hvidovre", "name": "Hvidovre Kommune", "logo": "/images/partners/hvidovre.svg", "category": "client", "published": true},
  {"slug": "broendby", "name": "Brøndby Kommune", "logo": "/images/partners/broendby.svg", "category": "client", "published": true},
  {"slug": "lyngby", "name": "Lyngby-Taarbæk Kommune", "logo": "/images/partners/lyngby.svg", "category": "client", "published": true},
  {"slug": "horsens", "name": "Horsens Kommune", "logo": "/images/partners/horsens.svg", "category": "client", "published": true},
  {"slug": "faaborg", "name": "Faaborg-Midtfyn Kommune", "logo": "/images/partners/faaborg.svg", "category": "client", "published": true},
  {"slug": "dtu", "name": "DTU", "logo": "/images/partners/dtu.svg", "category": "partner", "published": true},
  {"slug": "erhvervshus", "name": "Erhvervshus", "logo": "/images/partners/erhvervshus.svg", "category": "supporter", "published": true},
  {"slug": "innovationsfonden", "name": "Innovationsfonden", "logo": "/images/partners/innovationsfonden.svg", "category": "supporter", "published": true},
  {"slug": "eifo", "name": "EIFO", "logo": "/images/partners/eifo.svg", "category": "supporter", "published": true},
];

export function getPartners() {
  return partners.filter((partner) => partner.published);
}
