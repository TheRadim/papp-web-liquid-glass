import type { Locale, Project } from "@/content/types";

export const projects: Project[] = [
  {
    slug: "sensordata-herning",
    category: "sensors",
    clientName: "Herning Kommune",
    title: {
      en: "Sensor data opens new parking opportunities in Herning",
      da: "Sensordata baner vej for nye parkeringsløsninger i Herning"
    },
    summary: {
      en: "Two parking areas. Same address. Very different occupancy. In Herning, data revealed hidden resources and opened a path toward smarter parking decisions.",
      da: "To parkeringspladser. Samme adresse. Meget forskellig belægning. I Herning har vi fået øjnene op for, hvordan data kan afsløre skjulte ressourcer og bane vej for smartere beslutninger."
    },
    challenge: {
      en: "In central Herning, a street-level parking area and an adjacent parking basement showed noticeably different occupancy. The task was to understand where capacity was being overlooked and why.",
      da: "I hjertet af Herning ligger to parkeringsarealer side om side. En parkeringskælder og en parkeringsplads i gadeplan. Sensordata fra parkeringsarealerne afslører en markant forskel i belægningsgraden."
    },
    approach: {
      en: "Papp used sensor data to compare occupancy, duration and behaviour across the two areas and turn the difference into questions the municipality could act on.",
      da: "Med Papp Insights bliver det tydeligt, at pladserne i gadeplan tiltrækker en bred gruppe bilister, mens parkeringskælderen forbliver overset. Dataene åbner for spørgsmål om tilgængelighed, skiltning og oplevet tryghed."
    },
    result: {
      en: "The project gives Herning a stronger basis for thinking in solutions that use the existing parking capacity better before expanding.",
      da: "Med unik dataindsigt og professionel rådgivning fra Papp Mobility kan man i Herning dykke ned i mønstrene og træffe oplyste beslutninger om, hvordan parkeringen kan optimeres."
    },
    coverImage: "/images/projects/sensors/sensordata-herning-cover.jpg",
    gallery: [
      "/images/projects/sensors/sensordata-herning-image1.jpg",
      "/images/projects/sensors/sensordata-herning-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["sensors", "insights", "analysis"],
    seo: {
      title: { en: "Sensor data in Herning | Papp Mobility", da: "Sensordata i Herning | Papp Mobility" },
      description: { en: "How sensor data helped reveal hidden parking capacity in Herning.", da: "Hvordan sensordata hjalp med at afsløre skjult parkeringskapacitet i Herning." }
    }
  },
  {
    slug: "kystparkering-thisted",
    category: "cameras",
    clientName: "Thisted Kommune",
    title: {
      en: "Data-driven coastal parking with IoT in Thisted",
      da: "Datadrevet parkering med IoT-løsninger ved Kysten i Thisted"
    },
    summary: {
      en: "Thisted uses IoT data to understand occupancy and parking duration along the coast, giving the municipality a factual basis for better use of existing spaces.",
      da: "Thisted Kommune tager temperaturen på kystparkering med IoT. 10 sensorer registrerer realtidsdata om belægning og parkeringstid, så kommunen kan træffe beslutninger baseret på fakta og sikre mere effektiv brug af parkeringspladserne."
    },
    challenge: {
      en: "On summer days, coastal areas attract many visitors. Thisted needed to understand how long drivers stay, when occupancy peaks and where capacity is under pressure.",
      da: "På sommerdage i Thisted tiltrækker kysten mange gæster. Kommunen havde behov for at forstå, hvor længe bilisterne holder, hvor stort presset er, og hvornår på dagen belægningen topper."
    },
    approach: {
      en: "IoT sensors collect real-time occupancy and duration data that can be reviewed in Papp Insights and used for planning discussions.",
      da: "Sensorerne registrerer realtidsdata om belægning og parkeringstid, så kommunen kan se brugen af parkeringsarealerne i praksis og arbejde videre på et dokumenteret grundlag."
    },
    result: {
      en: "The project supports a longer-term strategy for reducing search traffic and making better use of existing parking areas.",
      da: "Løsningen giver Thisted Kommune et bedre grundlag for at reducere søgetrafik og optimere udnyttelsen af eksisterende parkeringspladser."
    },
    coverImage: "/images/projects/cameras/kystparkering-thisted-cover.jpg",
    gallery: [
      "/images/projects/cameras/kystparkering-thisted-image1.jpg",
      "/images/projects/cameras/kystparkering-thisted-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["cameras", "insights", "analysis"],
    seo: {
      title: { en: "Coastal parking in Thisted | Papp Mobility", da: "Kystparkering i Thisted | Papp Mobility" },
      description: { en: "IoT parking data for better coastal parking decisions in Thisted.", da: "IoT-parkeringsdata til bedre beslutninger om kystparkering i Thisted." }
    }
  },
  {
    slug: "parkeringsmoenstre-ishoej",
    category: "cameras",
    clientName: "Ishøj Kommune",
    title: {
      en: "Data creates better parking solutions in Ishøj",
      da: "Data skaber bedre parkeringsløsninger i Ishøj"
    },
    summary: {
      en: "Papp Mobility helps Ishøj map parking patterns around Brohuset through IoT sensors and data analysis so capacity can be used more intelligently.",
      da: "Papp Mobility hjælper Ishøj Kommune med at kortlægge parkeringsmønstre ved Brohuset gennem IoT-sensorer og dataanalyse, så kapaciteten kan udnyttes smartere."
    },
    challenge: {
      en: "During the renovation of Brohuset, Ishøj needed insight into how ordinary, accessible and charging spaces were being used.",
      da: "Ishøj Kommune står i forbindelse med renoveringen af Brohuset med et behov for indsigt i, hvordan parkeringspladsen bliver udnyttet, både hvad angår almindelige pladser, handicappladser og ladepladser."
    },
    approach: {
      en: "Papp mapped use patterns, occupancy and intervals to build a decision basis for the future structure of the parking area.",
      da: "Målet er at skabe et datagrundlag, der gør det muligt at rådgive om den fremtidige indretning og brug af parkeringsarealet."
    },
    result: {
      en: "The analysis gives Ishøj a clearer basis for time restrictions, flexible use and better differentiation between user groups.",
      da: "På baggrund af analysen rådgiver Papp Mobility Ishøj Kommune om konkrete tiltag som tidsrestriktioner, fleksibel udnyttelse af pladserne og bedre differentiering mellem brugere."
    },
    coverImage: "/images/projects/cameras/parkeringsmoenstre-ishoej-cover.jpg",
    gallery: [
      "/images/projects/cameras/parkeringsmoenstre-ishoej-image1.jpg",
      "/images/projects/cameras/parkeringsmoenstre-ishoej-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["cameras", "insights", "analysis"],
    seo: {
      title: { en: "Parking patterns in Ishøj | Papp Mobility", da: "Parkeringsmønstre i Ishøj | Papp Mobility" },
      description: { en: "IoT sensor data and analysis for smarter parking capacity in Ishøj.", da: "IoT-sensordata og analyse til smartere parkeringskapacitet i Ishøj." }
    }
  },
  {
    slug: "ladeindsigter-frederiksberg",
    category: "sensors",
    clientName: "Frederiksberg Kommune",
    title: {
      en: "Optimised charging-space operation through data in Frederiksberg",
      da: "Optimeret drift af ladepladser ved hjælp af data på Frederiksberg"
    },
    summary: {
      en: "Frederiksberg uses precise data to understand how charging spaces are used and where operations can become more efficient and user-friendly.",
      da: "Hvordan bruges ladepladserne egentlig? Og hvor er der plads til forbedring? På Frederiksberg giver præcise data et nyt blik på et kendt problem og skaber fundamentet for en mere effektiv og brugervenlig infrastruktur."
    },
    challenge: {
      en: "Frederiksberg is busy, and so are the city's charging spaces. The municipality needed a detailed view of favourites, duration and usage patterns.",
      da: "Frederiksberg summer af aktivitet, og det samme gør byens ladepladser. For at få indsigt i, hvordan de bruges, leverer Papp Mobility præcise data, der giver et detaljeret overblik."
    },
    approach: {
      en: "Papp gathered and visualised charging-space use so the municipality could see patterns instead of relying on assumptions.",
      da: "Dataene giver et klart billede af, hvilke ladepladser der bruges mest, hvor længe bilerne holder, og hvor der er potentiale for forbedring."
    },
    result: {
      en: "The data creates a stronger foundation for improving charging infrastructure and making it easier to use.",
      da: "Data skaber fundamentet for en mere effektiv og brugervenlig ladeinfrastruktur."
    },
    coverImage: "/images/projects/sensors/ladeindsigter-frederiksberg-cover.jpg",
    gallery: [
      "/images/projects/sensors/ladeindsigter-frederiksberg-image1.png",
      "/images/projects/sensors/ladeindsigter-frederiksberg-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["sensors", "insights"],
    seo: {
      title: { en: "Charging-space insight in Frederiksberg | Papp Mobility", da: "Ladeindsigter på Frederiksberg | Papp Mobility" },
      description: { en: "Charging-space data for better operations in Frederiksberg.", da: "Ladedata til bedre drift af ladepladser på Frederiksberg." }
    }
  },
  {
    slug: "iot-teknologi-varde",
    category: "sensors",
    clientName: "Varde Kommune",
    title: {
      en: "IoT creates smarter and more flexible parking in Varde",
      da: "IoT skaber smartere og mere fleksibel parkering i Varde"
    },
    summary: {
      en: "In Varde, a single change shows how intelligent IoT solutions can calm traffic and make room for both cars and city life.",
      da: "Midtbyens kaos er ikke en naturlov. I Varde viser én enkelt ændring, hvordan intelligente IoT-løsninger kan give ro på vejene og plads til både biler og byliv."
    },
    challenge: {
      en: "Search traffic had long challenged Varde's cobblestoned city centre. A part of the square near the pedestrian street was converted into one-hour parking.",
      da: "I Vardes brostensbelagte midtby har søgetrafik længe skabt udfordringer for både borgere og besøgende. For at tackle dette problem er en del af torvet nær gågaden blevet omdannet til parkeringspladser med en tidsbegrænsning på én time."
    },
    approach: {
      en: "Wireless parking sensors measure use of the spaces and show whether the change works as intended.",
      da: "Ved hjælp af trådløse parkeringssensorer måler og analyserer Papp Mobility pladsernes brug. Dataene viser, om de nye pladser er fleksible og effektive."
    },
    result: {
      en: "The project shows how smaller, documented interventions can reduce search traffic and support local trade without heavy construction work.",
      da: "Projektet i Varde er et eksempel på, hvordan mobilitetsdata og intelligent parkering kan skabe konkrete forbedringer i hverdagen uden omfattende anlægsarbejde."
    },
    coverImage: "/images/projects/sensors/iot-teknologi-varde-cover.jpg",
    gallery: [
      "/images/projects/sensors/iot-teknologi-varde-image1.jpg",
      "/images/projects/sensors/iot-teknologi-varde-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["sensors", "analysis"],
    seo: {
      title: { en: "IoT technology in Varde | Papp Mobility", da: "IoT-teknologi i Varde | Papp Mobility" },
      description: { en: "IoT parking sensors and analysis for smarter city-centre parking in Varde.", da: "IoT-parkeringssensorer og analyse til smartere bymidteparkering i Varde." }
    }
  },
  {
    slug: "handicap-og-ladepladser-gentofte",
    category: "sensors",
    clientName: "Gentofte Kommune",
    title: {
      en: "Usage insight strengthens accessibility in Gentofte",
      da: "Indsigt i brugsmønstre styrker tilgængeligheden i Gentofte"
    },
    summary: {
      en: "When capacity is limited, data becomes the key to using spaces better. In Gentofte, the focus is accessible and charging spaces.",
      da: "Når kapaciteten er knap, bliver data nøglen til effektiv udnyttelse af pladserne. I Gentofte handler det om at forstå, hvordan pladserne bruges og finde løsninger, der styrker tilgængeligheden for dem, der har mest brug for den."
    },
    challenge: {
      en: "Gentofte wanted better conditions for people with disabilities while also understanding how selected charging spaces are used.",
      da: "I Gentofte er der fokus på at skabe bedre vilkår for personer med handicap, der ofte oplever udfordringer i bylivet. Da det er vanskeligt at udvide kapaciteten, arbejder Gentofte på at optimere udnyttelsen af de eksisterende pladser."
    },
    approach: {
      en: "Papp installed sensors on selected accessible and charging spaces to follow occupancy and demand more closely.",
      da: "Papp Mobility har installeret sensorer på udvalgte lade- og handicappladser, så kommunen kan følge pladsernes belægning tæt og forstå, hvornår de bruges."
    },
    result: {
      en: "The insight gives Gentofte a better basis for practical decisions such as signage, time limits and distribution of existing spaces.",
      da: "Indsigten gør det muligt at træffe beslutninger, der er i tråd med virkeligheden, fra tydeligere skiltning til ændrede tidsbegrænsninger og bedre fordeling af eksisterende pladser."
    },
    coverImage: "/images/projects/sensors/handicap-og-ladepladser-gentofte-cover.jpg",
    gallery: [
      "/images/projects/sensors/handicap-og-ladepladser-gentofte-image1.jpg",
      "/images/projects/sensors/handicap-og-ladepladser-gentofte-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["sensors", "insights"],
    seo: {
      title: { en: "Accessible and charging spaces in Gentofte | Papp Mobility", da: "Handicap- og ladepladser i Gentofte | Papp Mobility" },
      description: { en: "Usage insight for accessible and charging spaces in Gentofte.", da: "Indsigt i brugen af handicap- og ladepladser i Gentofte." }
    }
  },
  {
    slug: "dataoptimering-faaborg",
    category: "analysis",
    clientName: "Faaborg-Midtfyn Kommune",
    title: {
      en: "Smart data optimisation solves parking challenges in Faaborg",
      da: "Smart dataoptimering løser parkeringsudfordringer i gågaden i Faaborg"
    },
    summary: {
      en: "How do you create better business parking without building new spaces? In Faaborg, the answer is data, double use and a smarter urban environment.",
      da: "Hvordan skaber man bedre erhvervsparkering uden at bygge nyt? Faaborg har svaret og det handler om data, dobbeltudnyttelse og et smartere byrum."
    },
    challenge: {
      en: "Faaborg's popular pedestrian street creates pressure on nearby parking. The question was how existing spaces are used by visitors and residents.",
      da: "Faaborgs hyggelige gågade er en magnet for både lokale og besøgende. Med en tidsbegrænsning på tre timer for almindelige bilister og fri parkering for beboerne i området var spørgsmålet, hvordan parkeringspladserne egentlig bruges."
    },
    approach: {
      en: "Papp helped Faaborg get precise insight into parking patterns, occupancy and dwell time so decisions could be made on a documented basis.",
      da: "Papp Mobility har hjulpet Faaborg med at få præcis indsigt i parkeringsmønstre og belægningsgrader, så pladserne kan udnyttes smartere."
    },
    result: {
      en: "The city can now work with solutions that match both present and future needs while keeping the centre accessible and functional.",
      da: "Ved at forstå, hvordan parkeringspladserne bruges, kan Faaborg skabe løsninger, der matcher både nuværende og fremtidige behov."
    },
    coverImage: "/images/projects/consultancy/dataoptimering-faaborg-cover.jpg",
    gallery: [
      "/images/projects/consultancy/dataoptimering-faaborg-image1.jpg",
      "/images/projects/consultancy/dataoptimering-faaborg-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["analysis", "consultancy"],
    seo: {
      title: { en: "Data optimisation in Faaborg | Papp Mobility", da: "Dataoptimering i Faaborg | Papp Mobility" },
      description: { en: "Data optimisation and advisory for parking challenges in Faaborg.", da: "Dataoptimering og rådgivning om parkeringsudfordringer i Faaborg." }
    }
  },
  {
    slug: "erhvervsparkering-aalborg",
    category: "consultancy",
    clientName: "Aalborg Kommune",
    title: {
      en: "A flexible city centre creates better business parking in Aalborg",
      da: "Fleksibel bymidte skaber bedre erhvervsparkering i Aalborg"
    },
    summary: {
      en: "How do you make room for everyone without creating new parking spaces? Aalborg uses parking-pattern insight to improve flow and balance.",
      da: "Hvordan får man plads til alle, uden at lave nye p-pladser? I Aalborg skaber indsigt i parkeringsmønstre et bedre flow og mere retfærdig brug af gågadens attraktive pladser."
    },
    challenge: {
      en: "Growing demand for business parking required a solution that respected the existing city centre rather than adding more parking spaces.",
      da: "Når efterspørgslen på erhvervsparkering vokser, kræver det løsninger, der både gør hverdagen lettere og respekterer byens eksisterende rammer."
    },
    approach: {
      en: "Papp installed wireless IoT sensors and helped evaluate occupancy, parking duration and how the selected spaces were used throughout the day.",
      da: "Papp Mobility installerede trådløse IoT-sensorer, der giver data om belægningsgrader, parkeringstider og antallet af biler, der benytter pladserne."
    },
    result: {
      en: "The pilot supports flexible use: dedicated business parking during work hours and broader use later in the day.",
      da: "Løsningen skaber et dynamisk flow, der imødekommer behovene fra både hjemmeplejen og korttidsparkering og sikrer en effektiv udnyttelse af ressourcerne hele døgnet."
    },
    coverImage: "/images/projects/consultancy/erhvervsparkering-aalborg-cover.jpg",
    gallery: [
      "/images/projects/consultancy/erhvervsparkering-aalborg-image1.jpg",
      "/images/projects/consultancy/erhvervsparkering-aalborg-image121.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["sensors", "analysis", "consultancy"],
    seo: {
      title: { en: "Business parking in Aalborg | Papp Mobility", da: "Erhvervsparkering i Aalborg | Papp Mobility" },
      description: { en: "Flexible business parking supported by data in Aalborg.", da: "Fleksibel erhvervsparkering understøttet af data i Aalborg." }
    }
  },
  {
    slug: "damhustorvet-camera-monitoring",
    category: "cameras",
    clientName: "Damhustorvet",
    title: {
      en: "Battery-powered camera monitoring at Damhustorvet",
      da: "Batteridrevet kameramonitorering på Damhustorvet"
    },
    summary: {
      en: "A temporary camera project documented parking behaviour and traffic patterns, creating a stronger data basis for future decisions at Damhustorvet.",
      da: "Et midlertidigt kameraprojekt dokumenterede parkeringsadfærd og trafikmønstre og skabte et stærkere datagrundlag for fremtidige tiltag på Damhustorvet."
    },
    challenge: {
      en: "The site needed a clearer view of how the parking area was actually used without a heavy installation.",
      da: "Området havde brug for et klarere billede af, hvordan parkeringsarealet faktisk blev brugt, uden en tung installation."
    },
    approach: {
      en: "Papp deployed a battery-powered camera setup to monitor parking activity and traffic patterns with minimal installation work.",
      da: "Papp opsatte en batteridrevet kameraløsning, der målte parkeringsaktivitet og trafikmønstre med minimal implementering."
    },
    result: {
      en: "The project created detailed insight into real behaviour and a solid data basis for evaluating future initiatives.",
      da: "Projektet skabte detaljeret indsigt i reel adfærd og et solidt datagrundlag for at vurdere fremtidige tiltag."
    },
    coverImage: "/images/corporate/parking-tablet-review.jpg",
    gallery: [
      "/images/corporate/parking-sensor-ground.jpg",
      "/images/corporate/insights-screen.jpg"
    ],
    published: true,
    contentStatus: "approved",
    technologies: ["cameras", "insights", "analysis"],
    testimonialSlug: "damhustorvet-camera-insight",
    seo: {
      title: { en: "Damhustorvet camera monitoring | Papp Mobility", da: "Damhustorvet kameramonitorering | Papp Mobility" },
      description: { en: "Battery-powered camera monitoring for parking behaviour at Damhustorvet.", da: "Batteridrevet kameramonitorering af parkeringsadfærd på Damhustorvet." }
    }
  }
];

export function getProjects(_locale: Locale, filters?: { category?: Project["category"] }) {
  return projects.filter((project) => {
    if (!project.published) return false;
    if (!filters?.category) return true;
    if (project.category === filters.category) return true;

    return project.technologies?.includes(filters.category) ?? false;
  });
}

export function getProjectBySlug(_locale: Locale, slug: string) {
  return projects.find((project) => project.published && project.slug === slug);
}
