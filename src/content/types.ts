export type Locale = "en" | "da";

export type OfferingCategory =
  | "sensors"
  | "cameras"
  | "insights"
  | "analysis"
  | "consultancy";

export type ProjectCategory = "sensors" | "cameras" | "analysis" | "consultancy";

export type ContentStatus =
  | "approved"
  | "draft"
  | "needs-content"
  | "needs-translation"
  | "needs-review";

export interface LocalisedText {
  en: string;
  da: string;
}

export interface SeoContent {
  title: LocalisedText;
  description: LocalisedText;
  socialImage?: string;
}

export interface Offering {
  slug: string;
  category: OfferingCategory;
  name: LocalisedText;
  eyebrow?: LocalisedText;
  shortDescription: LocalisedText;
  introduction: LocalisedText;
  benefits: LocalisedText[];
  useCases: LocalisedText[];
  process?: LocalisedText[];
  heroImage: string;
  secondaryImages?: string[];
  relatedProjectSlugs: string[];
  contentStatus: ContentStatus;
  seo: SeoContent;
}

export interface Project {
  slug: string;
  category: ProjectCategory;
  clientName: string;
  location?: LocalisedText;
  title: LocalisedText;
  summary: LocalisedText;
  challenge?: LocalisedText;
  approach?: LocalisedText;
  solution?: LocalisedText;
  result?: LocalisedText;
  technologies?: OfferingCategory[];
  coverImage: string;
  gallery?: string[];
  testimonialSlug?: string;
  published: boolean;
  contentStatus: ContentStatus;
  seo: SeoContent;
}

export interface Testimonial {
  slug: string;
  quote: LocalisedText;
  personName?: string;
  personRole?: LocalisedText;
  organisation: string;
  organisationLogo?: string;
  published: boolean;
  contentStatus: ContentStatus;
}

export interface Partner {
  slug: string;
  name: string;
  logo: string;
  website?: string;
  category: "client" | "partner" | "supporter";
  published: boolean;
}

