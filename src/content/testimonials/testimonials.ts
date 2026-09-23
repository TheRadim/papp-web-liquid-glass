import type { Locale, Testimonial } from "@/content/types";

export const testimonials: Testimonial[] = [
  {
    slug: "aarhus-data-basis",
    quote: {
      en: "The collaboration with Papp Mobility gives us the data we need to create a decision basis for Aarhus City Council in connection with a trial scheme for business parking spaces in the city centre. Their data and sparring are a great help in securing a better balance between needs and capacity, and in assessing whether the scheme has the potential to become permanent.",
      da: "Samarbejdet med Papp Mobility giver os den nødvendige data for at kunne lave et beslutningsgrundlag til Aarhus Byråd i forbindelse med en forsøgsordning med erhvervsparkeringspladser i midtbyen. Deres data og sparring er en stor hjælp i arbejdet med at sikre bedre balance mellem behov og kapacitet og om ordningen har potentiale til at gøres permanent."
    },
    organisation: "Aarhus Kommune",
    organisationLogo: "/images/partners/aarhus.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "faaborg-city-development",
    quote: {
      en: "The collaboration with Papp Mobility began as one project, but has opened up several new efforts, including understanding behaviour in the city centre and opportunities to create a more inviting urban space for tourists and citizens. Their data gives us focus points we can work with in long-term urban development.",
      da: "Samarbejdet med Papp Mobility startede som ét projekt, men har åbnet op for flere nye indsatser, herunder hvordan adfærden er i bymidten og mulighederne for at skabe et hyggeligere byrum for turister og borgere. Deres data giver os opmærksomhedspunkter, vi kan arbejde videre med i den langsigtede byudvikling."
    },
    organisation: "Faaborg-Midtfyn Kommune",
    organisationLogo: "/images/partners/faaborg.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "ishoej-restructuring",
    quote: {
      en: "In 2025, we started a data project with Papp Mobility to gain better insight into the use of a parking area under restructuring. The first data already gives a more nuanced picture of occupancy, flow and parking intervals, which will become an important basis for using the area more efficiently going forward.",
      da: "I 2025 indledte vi et dataprojekt med Papp Mobility for at få bedre indsigt i brugen af et parkeringsareal under omstrukturering. De første data giver allerede et mere nuanceret billede af belægning, flow og parkeringsintervaller, hvilket bliver et vigtigt grundlag for at udnytte pladsen mere effektivt fremover."
    },
    organisation: "Ishøj Kommune",
    organisationLogo: "/images/partners/ishoej.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "herning-useful-data",
    quote: {
      en: "We have gained access to precise and usable data that has strengthened our work with parking and mobility. Papp Mobility delivers detailed insight we can act on, and that makes a difference. Papp provides good service.",
      da: "Vi har fået adgang til præcise og brugbare data, der har styrket vores arbejde med parkering og mobilitet. Papp Mobility leverer detaljeret indsigt, vi kan handle på og det gør en forskel. Papp yder en god service."
    },
    organisation: "Herning Kommune",
    organisationLogo: "/images/partners/herning.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "thisted-search-traffic",
    quote: {
      en: "Papp Mobility has provided competent guidance and delivered a solution that, in a test phase, has shown promising results. It has enabled Thisted Municipality to consider the solution as part of a long-term strategy to reduce search traffic in coastal towns and optimise the use of existing parking spaces.",
      da: "Papp Mobility har ydet kompetent vejledning og leveret en løsning, der i en testfase har vist lovende resultater. Det har givet Thisted Kommune mulighed for at indtænke løsningen i en langsigtet strategi for at reducere søgetrafik i kystbyerne og optimere udnyttelse af eksisterende parkeringspladser i kommunens hovedby."
    },
    organisation: "Thisted Kommune",
    organisationLogo: "/images/partners/thisted.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "varde-search-traffic",
    quote: {
      en: "Papp Mobility delivers valuable insight into how search traffic affects our city centre. With their help, we have gained a clear picture of where and when action is needed to create better flow and less congestion.",
      da: "Papp Mobility leverer værdifuld indsigt i, hvordan søgetrafik påvirker vores bymidte. Med deres hjælp har vi fået et klart billede af, hvor og hvornår der skal sættes ind for at skabe bedre flow og mindre trængsel."
    },
    organisation: "Varde Kommune",
    organisationLogo: "/images/partners/varde.svg",
    published: true,
    contentStatus: "approved"
  },
  {
    slug: "damhustorvet-camera-insight",
    quote: {
      en: "Papp Mobility delivered valuable insight into the actual use of the parking area at Damhustorvet and created a solid data basis for future initiatives. The battery-powered camera solution was easy to implement and gave detailed insight into parking behaviour and traffic patterns.",
      da: "Papp Mobility har leveret værdifuld indsigt i den faktiske anvendelse af parkeringsområdet på Damhustorvet og skabt et solidt datagrundlag for fremtidige tiltag. Den batteridrevne kameraløsning var nem at implementere og gav detaljeret indsigt i parkeringsadfærd og trafikmønstre."
    },
    organisation: "Damhustorvet case",
    published: false,
    contentStatus: "approved"
  }
];

export function getTestimonials(_locale: Locale) {
  return testimonials.filter((testimonial) => testimonial.published);
}

export function getTestimonialBySlug(slug: string) {
  return testimonials.find((testimonial) => testimonial.slug === slug);
}
