import type { LocalisedText } from "@/content/types";

/**
 * The parts that make each service page its own: key figures, a signature
 * example chart, how a project runs, what you receive, who it is for and FAQ.
 * Chart numbers are illustrative examples, and every chart says so.
 */

export interface ServiceStat {
  value: LocalisedText;
  label: LocalisedText;
}

export interface ServiceStep {
  title: LocalisedText;
  body: LocalisedText;
}

export interface ServiceUseCase {
  title: LocalisedText;
  body: LocalisedText;
}

export interface ServiceFaq {
  question: LocalisedText;
  answer: LocalisedText;
}

export type ServiceSignature =
  | { kind: "occupancy"; hours: number[]; weekday: number[]; saturday: number[]; capacity: number }
  | { kind: "mode-split"; modes: { label: LocalisedText; value: number; tone: string }[]; directions: { label: LocalisedText; value: number }[] }
  | { kind: "heatmap"; days: LocalisedText[]; slots: string[]; values: number[][] }
  | { kind: "before-after"; hours: number[]; before: number[]; after: number[]; beforeLabel: LocalisedText; afterLabel: LocalisedText }
  | { kind: "origins"; groups: { label: LocalisedText; value: number }[]; electricShare: number }
  | { kind: "charging"; spaces: LocalisedText[]; sessions: { space: number; start: number; end: number; state: "charging" | "idle" | "blocked" }[] };

/** Which sections the page shows, in order, so the pages don't all read alike. */
export type ServiceSection = "stats" | "signature" | "answers" | "steps" | "deliverables" | "use-cases" | "tools" | "projects" | "faq";

export interface ServiceTopicDetails {
  /** Short line above the hero title. */
  eyebrow: LocalisedText;
  /** Hero image on the left instead of the right. */
  imageFirst?: boolean;
  accent: "blue" | "coral" | "sky" | "navy" | "pink" | "green";
  stats: ServiceStat[];
  signature: {
    eyebrow: LocalisedText;
    title: LocalisedText;
    body: LocalisedText;
    caption: LocalisedText;
    chart: ServiceSignature;
  };
  steps: ServiceStep[];
  deliverables: LocalisedText[];
  useCases: ServiceUseCase[];
  faq: ServiceFaq[];
  sections: ServiceSection[];
}

export const exampleData: LocalisedText = { en: "Example data", da: "Eksempeldata" };

export const serviceTopicDetails: Record<string, ServiceTopicDetails> = {
  "parking-counting": {
    eyebrow: { en: "Live occupancy", da: "Live belægning" },
    accent: "blue",
    stats: [
      { value: { en: "24/7", da: "24/7" }, label: { en: "Counted around the clock, every day of the year", da: "Talt døgnet rundt, alle årets dage" } },
      { value: { en: "Live", da: "Live" }, label: { en: "Free and taken spaces, as they change", da: "Ledige og optagede pladser, mens det sker" } },
      { value: { en: "Per space", da: "Pr. plads" }, label: { en: "Down to single accessible or charging bays", da: "Helt ned til den enkelte handicap- eller ladeplads" } }
    ],
    signature: {
      eyebrow: { en: "A day in the car park", da: "En dag på parkeringspladsen" },
      title: { en: "See when it fills up, and how fast", da: "Se hvornår den fyldes op, og hvor hurtigt" },
      body: {
        en: "Occupancy by the hour shows the shape of a normal day. Compare weekdays with weekends, and spot the hours when drivers start circling for a space.",
        da: "Belægning time for time viser, hvordan en almindelig dag ser ud. Sammenlign hverdage med weekender, og se de timer, hvor bilisterne begynder at køre rundt efter en plads."
      },
      caption: { en: "Share of spaces taken, hour by hour. Above 85 % most drivers struggle to find a space.", da: "Andel optagede pladser, time for time. Over 85 % har de fleste bilister svært ved at finde en plads." },
      chart: {
        kind: "occupancy",
        hours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        weekday: [12, 28, 61, 82, 88, 91, 93, 90, 86, 84, 79, 68, 52, 41, 30, 22, 15],
        saturday: [6, 10, 18, 34, 58, 77, 89, 94, 92, 83, 70, 55, 44, 38, 31, 22, 14],
        capacity: 85
      }
    },
    steps: [
      { title: { en: "Walk the site together", da: "Vi gennemgår området sammen" }, body: { en: "We agree which spaces, zones or car parks to count and what you need to know.", da: "Vi aftaler, hvilke pladser, zoner eller parkeringspladser der skal tælles, og hvad I har brug for at vide." } },
      { title: { en: "Install sensors or cameras", da: "Vi monterer sensorer eller kameraer" }, body: { en: "Sensors go into each space in minutes; cameras cover larger areas. No cables, no digging.", da: "Sensorer sættes i hver plads på få minutter; kameraer dækker større områder. Ingen kabler, ingen gravearbejde." } },
      { title: { en: "Watch the numbers come in", da: "Følg tallene, mens de kommer ind" }, body: { en: "Occupancy shows up in Papp Insights the same day, live and building up history.", da: "Belægningen vises i Papp Insights samme dag, live og med historik, der vokser." } },
      { title: { en: "Share and act", da: "Del og handl" }, body: { en: "Export reports, feed live counts to signs or apps, and follow up on changes.", da: "Eksportér rapporter, send live tal til skilte eller apps, og følg op på ændringer." } }
    ],
    deliverables: [
      { en: "Live occupancy per space, zone and car park", da: "Live belægning pr. plads, zone og parkeringsplads" },
      { en: "Hourly, daily and monthly history", da: "Historik time for time, dag for dag og måned for måned" },
      { en: "Average parking time and turnover", da: "Gennemsnitlig parkeringstid og udskiftning" },
      { en: "Data feed for guidance signs and apps", da: "Datafeed til henvisningsskilte og apps" },
      { en: "Exports to Excel and PDF", da: "Eksport til Excel og PDF" }
    ],
    useCases: [
      { title: { en: "Town centres", da: "Bymidter" }, body: { en: "Show drivers where there is room and cut the traffic that circles for a space.", da: "Vis bilisterne, hvor der er plads, og skær ned på trafikken, der kører rundt efter en plads." } },
      { title: { en: "Accessible and charging bays", da: "Handicap- og ladepladser" }, body: { en: "Check that the bays that matter most are free for the people who need them.", da: "Tjek at de pladser, der betyder mest, er ledige for dem, der har brug for dem." } },
      { title: { en: "Workplaces and hospitals", da: "Arbejdspladser og hospitaler" }, body: { en: "Know if staff and visitor parking is big enough before you build more.", da: "Vid om personale- og besøgsparkeringen er stor nok, før I bygger mere." } }
    ],
    faq: [
      { question: { en: "Sensors or cameras, which do we need?", da: "Sensorer eller kameraer, hvad har vi brug for?" }, answer: { en: "Sensors are best for exact, per-space data. Cameras cover open areas and also count vehicle types. Many sites use both, and we help you choose.", da: "Sensorer er bedst til præcise data pr. plads. Kameraer dækker åbne områder og tæller også køretøjstyper. Mange steder bruger begge dele, og vi hjælper jer med at vælge." } },
      { question: { en: "How long does a counting project run?", da: "Hvor længe kører en tælling?" }, answer: { en: "From a few weeks for a snapshot to permanent counting. Two to four weeks is usually enough to see the normal pattern.", da: "Fra få uger til et øjebliksbillede til permanent tælling. To til fire uger er som regel nok til at se det normale mønster." } },
      { question: { en: "Can we show the numbers to the public?", da: "Kan vi vise tallene til borgerne?" }, answer: { en: "Yes. Live counts can feed signs, websites and the Papp app.", da: "Ja. Live tal kan sendes til skilte, hjemmesider og Papp-appen." } }
    ],
    sections: ["stats", "signature", "answers", "steps", "tools", "use-cases", "projects", "faq"]
  },

  "traffic-counting": {
    eyebrow: { en: "Every car, bike and pedestrian", da: "Hver bil, cykel og fodgænger" },
    imageFirst: true,
    accent: "coral",
    stats: [
      { value: { en: "6+", da: "6+" }, label: { en: "Road user types, from cars and vans to bikes and people on foot", da: "Typer trafikanter, fra biler og varebiler til cykler og fodgængere" } },
      { value: { en: "Both ways", da: "Begge veje" }, label: { en: "Every count split by direction", da: "Hver tælling fordelt på retning" } },
      { value: { en: "0 images", da: "0 billeder" }, label: { en: "Kept after counting: only anonymous numbers leave the camera", da: "Gemt efter tællingen: kun anonyme tal forlader kameraet" } }
    ],
    signature: {
      eyebrow: { en: "What passes by", da: "Hvad kommer forbi" },
      title: { en: "Who uses the street, and which way", da: "Hvem bruger gaden, og i hvilken retning" },
      body: {
        en: "One camera on a lamp post counts everything that crosses a line you draw. You get the mix of road users and the direction they travel, hour by hour.",
        da: "Ét kamera på en lygtepæl tæller alt, der krydser en linje, I tegner. I får fordelingen af trafikanter og den retning, de bevæger sig i, time for time."
      },
      caption: { en: "Passages on one street over a normal weekday.", da: "Passager på én gade over en almindelig hverdag." },
      chart: {
        kind: "mode-split",
        modes: [
          { label: { en: "Cars", da: "Biler" }, value: 6420, tone: "#1183ba" },
          { label: { en: "Bikes", da: "Cykler" }, value: 3180, tone: "#47b2e4" },
          { label: { en: "Pedestrians", da: "Fodgængere" }, value: 2750, tone: "#fb867f" },
          { label: { en: "Vans", da: "Varebiler" }, value: 910, tone: "#37517e" },
          { label: { en: "Trucks and buses", da: "Lastbiler og busser" }, value: 340, tone: "#fb6d88" }
        ],
        directions: [
          { label: { en: "Into town", da: "Mod byen" }, value: 54 },
          { label: { en: "Out of town", da: "Ud af byen" }, value: 46 }
        ]
      }
    },
    steps: [
      { title: { en: "Pick the counting points", da: "Vælg tællepunkterne" }, body: { en: "We find the lamp posts or walls that give a clear view of the lines you want counted.", da: "Vi finder de lygtepæle eller mure, der giver frit udsyn til de linjer, I vil have talt." } },
      { title: { en: "Mount the camera", da: "Montér kameraet" }, body: { en: "Battery or mains powered, installed in under an hour and ready to count the same day.", da: "Batteri- eller netdrevet, monteret på under en time og klar til at tælle samme dag." } },
      { title: { en: "Count and classify", da: "Tæl og klassificér" }, body: { en: "The camera sorts each passage by type and direction and sends only the numbers.", da: "Kameraet sorterer hver passage efter type og retning og sender kun tallene." } },
      { title: { en: "Compare over time", da: "Sammenlign over tid" }, body: { en: "See totals by hour, day and week in Papp Insights and export them for your models.", da: "Se totaler pr. time, dag og uge i Papp Insights, og eksportér dem til jeres modeller." } }
    ],
    deliverables: [
      { en: "Counts by road user type and direction", da: "Tællinger efter trafikanttype og retning" },
      { en: "Totals per 15 minutes, hour, day and week", da: "Totaler pr. 15 minutter, time, dag og uge" },
      { en: "Rush hour and peak day summaries", da: "Opsummering af myldretid og spidsdage" },
      { en: "Data ready for traffic models and reports", da: "Data klar til trafikmodeller og rapporter" }
    ],
    useCases: [
      { title: { en: "New bike lanes", da: "Nye cykelstier" }, body: { en: "Prove how many cyclists use a route before and after it is built.", da: "Dokumentér hvor mange cyklister der bruger en rute før og efter, den bygges." } },
      { title: { en: "School roads", da: "Skoleveje" }, body: { en: "See how many children walk or bike, and when cars pass the gate.", da: "Se hvor mange børn der går eller cykler, og hvornår bilerne kører forbi porten." } },
      { title: { en: "Events and tourism", da: "Arrangementer og turisme" }, body: { en: "Measure how many people an event or season really brings in.", da: "Mål hvor mange mennesker et arrangement eller en sæson reelt trækker til." } }
    ],
    faq: [
      { question: { en: "Is camera counting GDPR compliant?", da: "Er kameratælling GDPR-overholdende?" }, answer: { en: "Yes. Images are analysed on the camera itself and are not stored or sent. Only anonymous counts leave the device.", da: "Ja. Billederne analyseres i selve kameraet og bliver hverken gemt eller sendt. Kun anonyme tællinger forlader enheden." } },
      { question: { en: "How accurate are the counts?", da: "Hvor præcise er tællingerne?" }, answer: { en: "We check each installation against manual counts, so you know how reliable the numbers are for your location.", da: "Vi tjekker hver installation mod manuelle tællinger, så I ved, hvor pålidelige tallene er på jeres placering." } },
      { question: { en: "Does it need power?", da: "Kræver det strøm?" }, answer: { en: "It can run on a battery for short studies or be connected to a lamp post for permanent counting.", da: "Det kan køre på batteri til korte undersøgelser eller kobles til en lygtepæl til permanent tælling." } }
    ],
    sections: ["signature", "stats", "steps", "answers", "use-cases", "tools", "projects", "faq"]
  },

  "parking-analysis": {
    eyebrow: { en: "From counts to decisions", da: "Fra tællinger til beslutninger" },
    accent: "navy",
    stats: [
      { value: { en: "1 report", da: "1 rapport" }, label: { en: "Findings in plain language, ready for the committee", da: "Resultater i et klart sprog, klar til udvalget" } },
      { value: { en: "Hidden capacity", da: "Skjult kapacitet" }, label: { en: "Spaces that stand empty while others overflow", da: "Pladser, der står tomme, mens andre flyder over" } },
      { value: { en: "Before you build", da: "Før I bygger" }, label: { en: "Test changes on data, not guesses", da: "Afprøv ændringer på data, ikke gæt" } }
    ],
    signature: {
      eyebrow: { en: "The pressure map", da: "Presset på kortet" },
      title: { en: "Find the hours that matter", da: "Find de timer, der betyder noget" },
      body: {
        en: "A week of occupancy in one picture. The dark cells are where parking runs out; the pale ones are capacity you already have. Most analyses start here.",
        da: "En uges belægning i ét billede. De mørke felter er der, hvor parkeringen slipper op; de lyse er kapacitet, I allerede har. De fleste analyser starter her."
      },
      caption: { en: "Average occupancy per day and two-hour slot over four weeks.", da: "Gennemsnitlig belægning pr. dag og to-timers interval over fire uger." },
      chart: {
        kind: "heatmap",
        days: [
          { en: "Mon", da: "Man" }, { en: "Tue", da: "Tir" }, { en: "Wed", da: "Ons" }, { en: "Thu", da: "Tor" },
          { en: "Fri", da: "Fre" }, { en: "Sat", da: "Lør" }, { en: "Sun", da: "Søn" }
        ],
        slots: ["06", "08", "10", "12", "14", "16", "18", "20"],
        values: [
          [0.18, 0.62, 0.84, 0.88, 0.82, 0.7, 0.44, 0.24],
          [0.2, 0.66, 0.87, 0.9, 0.85, 0.72, 0.46, 0.25],
          [0.19, 0.64, 0.86, 0.91, 0.86, 0.73, 0.48, 0.27],
          [0.21, 0.67, 0.89, 0.93, 0.88, 0.78, 0.56, 0.33],
          [0.2, 0.6, 0.85, 0.95, 0.92, 0.84, 0.64, 0.42],
          [0.08, 0.22, 0.61, 0.94, 0.96, 0.81, 0.52, 0.36],
          [0.05, 0.1, 0.3, 0.55, 0.6, 0.48, 0.3, 0.18]
        ]
      }
    },
    steps: [
      { title: { en: "Define the question", da: "Formulér spørgsmålet" }, body: { en: "Build more, charge for parking, change time limits? We start from the decision you face.", da: "Bygge mere, indføre betaling, ændre tidsgrænser? Vi tager udgangspunkt i den beslutning, I står over for." } },
      { title: { en: "Collect the right data", da: "Indsaml de rigtige data" }, body: { en: "We use existing counts or measure with sensors and cameras for a set period.", da: "Vi bruger eksisterende tællinger eller måler med sensorer og kameraer i en fast periode." } },
      { title: { en: "Analyse and model", da: "Analysér og modellér" }, body: { en: "Peaks, parking times, turnover and scenarios for what happens if you change something.", da: "Spidser, parkeringstider, udskiftning og scenarier for, hvad der sker, hvis I ændrer noget." } },
      { title: { en: "Present and advise", da: "Præsentér og rådgiv" }, body: { en: "A clear report and a meeting where we go through the findings with you.", da: "En klar rapport og et møde, hvor vi gennemgår resultaterne med jer." } }
    ],
    deliverables: [
      { en: "A written report with clear recommendations", da: "En skriftlig rapport med klare anbefalinger" },
      { en: "Pressure maps by zone, day and hour", da: "Kort over presset efter zone, dag og time" },
      { en: "Parking time and turnover analysis", da: "Analyse af parkeringstid og udskiftning" },
      { en: "Scenarios for time limits, pricing and new spaces", da: "Scenarier for tidsgrænser, betaling og nye pladser" },
      { en: "Presentation for decision makers", da: "Præsentation for beslutningstagere" }
    ],
    useCases: [
      { title: { en: "Parking strategies", da: "Parkeringsstrategier" }, body: { en: "Base a new municipal parking policy on how spaces are used today.", da: "Byg en ny kommunal parkeringspolitik på, hvordan pladserne bruges i dag." } },
      { title: { en: "Before a new car park", da: "Før et nyt parkeringshus" }, body: { en: "Check whether demand is real, or whether better use of existing spaces is enough.", da: "Tjek om efterspørgslen er reel, eller om bedre brug af de eksisterende pladser er nok." } },
      { title: { en: "Paid parking and time limits", da: "Betalingsparkering og tidsgrænser" }, body: { en: "See who parks long and short, and what a change would mean for them.", da: "Se hvem der parkerer længe og kort, og hvad en ændring vil betyde for dem." } }
    ],
    faq: [
      { question: { en: "Can you use data we already have?", da: "Kan I bruge data, vi allerede har?" }, answer: { en: "Yes. We combine manual counts, payment data and our own measurements where it helps.", da: "Ja. Vi kombinerer manuelle tællinger, betalingsdata og vores egne målinger, hvor det giver mening." } },
      { question: { en: "How long does an analysis take?", da: "Hvor lang tid tager en analyse?" }, answer: { en: "Typically four to eight weeks from start to report, including a measuring period.", da: "Typisk fire til otte uger fra start til rapport, inklusive en måleperiode." } },
      { question: { en: "Do we get the raw data too?", da: "Får vi også rådata?" }, answer: { en: "Yes. Everything stays available in Papp Insights and can be exported.", da: "Ja. Alt forbliver tilgængeligt i Papp Insights og kan eksporteres." } }
    ],
    sections: ["stats", "answers", "signature", "deliverables", "steps", "use-cases", "projects", "faq"]
  },

  "traffic-analysis": {
    eyebrow: { en: "Flows, peaks and effects", da: "Strømme, spidser og effekter" },
    imageFirst: true,
    accent: "sky",
    stats: [
      { value: { en: "Before & after", da: "Før og efter" }, label: { en: "Measure the real effect of a trial or new layout", da: "Mål den reelle effekt af et forsøg eller en ny indretning" } },
      { value: { en: "Many points", da: "Mange punkter" }, label: { en: "Counts combined into one picture of movement", da: "Tællinger samlet til ét billede af bevægelsen" } },
      { value: { en: "All seasons", da: "Alle sæsoner" }, label: { en: "Weekdays, weekends and holidays compared", da: "Hverdage, weekender og ferier sammenlignet" } }
    ],
    signature: {
      eyebrow: { en: "Did the change work?", da: "Virkede ændringen?" },
      title: { en: "Compare before and after, hour by hour", da: "Sammenlign før og efter, time for time" },
      body: {
        en: "When a street is narrowed, closed or given a bike lane, the question is always the same: what happened? We measure before and after and show the difference clearly.",
        da: "Når en gade indsnævres, lukkes eller får en cykelsti, er spørgsmålet altid det samme: hvad skete der? Vi måler før og efter og viser forskellen tydeligt."
      },
      caption: { en: "Cars per hour on a street before and after a speed and layout change.", da: "Biler pr. time på en gade før og efter en ændring af hastighed og indretning." },
      chart: {
        kind: "before-after",
        hours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        before: [180, 520, 690, 480, 330, 310, 340, 330, 360, 470, 640, 710, 450, 280, 190],
        after: [150, 390, 470, 350, 260, 250, 270, 260, 290, 360, 450, 480, 330, 220, 160],
        beforeLabel: { en: "Before", da: "Før" },
        afterLabel: { en: "After", da: "Efter" }
      }
    },
    steps: [
      { title: { en: "Map the area", da: "Kortlæg området" }, body: { en: "We choose counting points that together show how traffic moves through the area.", da: "Vi vælger tællepunkter, der tilsammen viser, hvordan trafikken bevæger sig gennem området." } },
      { title: { en: "Measure a baseline", da: "Mål et udgangspunkt" }, body: { en: "A period of normal traffic gives the reference everything else is compared with.", da: "En periode med normal trafik giver det udgangspunkt, alt andet sammenlignes med." } },
      { title: { en: "Follow the change", da: "Følg ændringen" }, body: { en: "We keep counting through the trial or construction and after it.", da: "Vi fortsætter med at tælle under forsøget eller byggeriet og bagefter." } },
      { title: { en: "Explain the effect", da: "Forklar effekten" }, body: { en: "A clear account of what changed, for whom and when, with the data behind it.", da: "En klar redegørelse for, hvad der ændrede sig, for hvem og hvornår, med data bag." } }
    ],
    deliverables: [
      { en: "Peak hours and peak days per location", da: "Myldretider og spidsdage pr. placering" },
      { en: "Mode share: cars, bikes and pedestrians", da: "Fordeling på biler, cykler og fodgængere" },
      { en: "Before and after comparisons", da: "Sammenligninger før og efter" },
      { en: "Seasonal and weekday patterns", da: "Mønstre på tværs af sæsoner og ugedage" },
      { en: "A report for planners and politicians", da: "En rapport til planlæggere og politikere" }
    ],
    useCases: [
      { title: { en: "Street trials", da: "Gadeforsøg" }, body: { en: "Test a closure or a one-way street and see the effect in numbers.", da: "Afprøv en lukning eller ensretning, og se effekten i tal." } },
      { title: { en: "Coastal and tourist towns", da: "Kyst- og turistbyer" }, body: { en: "Understand how summer traffic differs from the rest of the year.", da: "Forstå hvordan sommertrafikken adskiller sig fra resten af året." } },
      { title: { en: "Urban development", da: "Byudvikling" }, body: { en: "Give new neighbourhoods a traffic plan built on real counts.", da: "Giv nye kvarterer en trafikplan bygget på rigtige tællinger." } }
    ],
    faq: [
      { question: { en: "How many counting points do we need?", da: "Hvor mange tællepunkter har vi brug for?" }, answer: { en: "It depends on the area. A single street can need one camera; a town centre usually needs three to ten.", da: "Det afhænger af området. En enkelt gade kan klare sig med ét kamera; en bymidte har typisk brug for tre til ti." } },
      { question: { en: "Can we follow routes between points?", da: "Kan vi følge ruter mellem punkterne?" }, answer: { en: "We show flows between points as anonymous totals, never as tracks of individual vehicles.", da: "Vi viser strømme mellem punkterne som anonyme totaler, aldrig som spor af enkelte køretøjer." } },
      { question: { en: "Can the data feed our traffic model?", da: "Kan data bruges i vores trafikmodel?" }, answer: { en: "Yes. We export in the formats planners and consultants already use.", da: "Ja. Vi eksporterer i de formater, planlæggere og rådgivere allerede bruger." } }
    ],
    sections: ["signature", "answers", "stats", "use-cases", "steps", "deliverables", "projects", "faq"]
  },

  "demographic-analysis": {
    eyebrow: { en: "Know your visitors", da: "Kend jeres besøgende" },
    accent: "pink",
    stats: [
      { value: { en: "Countries", da: "Lande" }, label: { en: "And Danish postcodes, for visitors from home and abroad", da: "Og danske postnumre, for besøgende fra ind- og udland" } },
      { value: { en: "EV share", da: "Elbilandel" }, label: { en: "How many visitors already drive electric", da: "Hvor mange besøgende allerede kører elbil" } },
      { value: { en: "Groups only", da: "Kun grupper" }, label: { en: "Never data about individual people", da: "Aldrig data om enkeltpersoner" } }
    ],
    signature: {
      eyebrow: { en: "Where visitors come from", da: "Hvor de besøgende kommer fra" },
      title: { en: "Local, regional or from abroad", da: "Lokale, regionale eller fra udlandet" },
      body: {
        en: "Anonymised vehicle data shows where cars are registered, grouped by distance or country. It tells you who your area really serves, and how that changes over the year.",
        da: "Anonymiserede køretøjsdata viser, hvor bilerne er indregistreret, samlet efter afstand eller land. Det fortæller, hvem jeres område reelt betjener, og hvordan det ændrer sig over året."
      },
      caption: { en: "Share of visiting cars by origin during a summer month at a coastal car park.", da: "Andel besøgende biler efter oprindelse i en sommermåned på en kystparkering." },
      chart: {
        kind: "origins",
        groups: [
          { label: { en: "Same municipality", da: "Samme kommune" }, value: 34 },
          { label: { en: "Same region", da: "Samme region" }, value: 21 },
          { label: { en: "Rest of Denmark", da: "Resten af Danmark" }, value: 17 },
          { label: { en: "Germany", da: "Tyskland" }, value: 15 },
          { label: { en: "Norway and Sweden", da: "Norge og Sverige" }, value: 7 },
          { label: { en: "Netherlands", da: "Holland" }, value: 4 },
          { label: { en: "Other countries", da: "Andre lande" }, value: 2 }
        ],
        electricShare: 23
      }
    },
    steps: [
      { title: { en: "Choose the places", da: "Vælg stederne" }, body: { en: "Car parks, entry roads or attractions where you want to know who comes.", da: "Parkeringspladser, indfaldsveje eller attraktioner, hvor I vil vide, hvem der kommer." } },
      { title: { en: "Measure anonymously", da: "Mål anonymt" }, body: { en: "Cameras read plates on the device, look up the vehicle type and discard the plate.", da: "Kameraerne læser nummerpladerne i enheden, slår køretøjstypen op og sletter nummerpladen." } },
      { title: { en: "Group the results", da: "Saml resultaterne" }, body: { en: "Origins and vehicle types are only ever shown for groups large enough to stay anonymous.", da: "Oprindelse og køretøjstyper vises kun for grupper, der er store nok til at forblive anonyme." } },
      { title: { en: "Use the insight", da: "Brug indsigten" }, body: { en: "Target marketing, plan charging and time services to the visitors you actually have.", da: "Målret markedsføring, planlæg opladning og tilpas tilbud til de besøgende, I faktisk har." } }
    ],
    deliverables: [
      { en: "Visitor origin by postcode, region and country", da: "Besøgendes oprindelse på postnummer, region og land" },
      { en: "Vehicle mix: fuel type, age and size", da: "Køretøjssammensætning: brændstof, alder og størrelse" },
      { en: "Share of electric and hybrid cars", da: "Andel el- og hybridbiler" },
      { en: "Seasonal and event comparisons", da: "Sammenligninger på tværs af sæsoner og arrangementer" }
    ],
    useCases: [
      { title: { en: "Tourism and destinations", da: "Turisme og destinationer" }, body: { en: "Know which markets your visitors come from and when they arrive.", da: "Vid hvilke markeder de besøgende kommer fra, og hvornår de ankommer." } },
      { title: { en: "Retail and town centres", da: "Detailhandel og bymidter" }, body: { en: "See how far shoppers travel and how that changes with campaigns.", da: "Se hvor langt kunderne rejser, og hvordan det ændrer sig med kampagner." } },
      { title: { en: "Charging plans", da: "Ladeplaner" }, body: { en: "Use the local EV share to plan how many chargers are needed, and where.", da: "Brug den lokale elbilandel til at planlægge, hvor mange ladere der er brug for, og hvor." } }
    ],
    faq: [
      { question: { en: "Is this legal under GDPR?", da: "Er det lovligt efter GDPR?" }, answer: { en: "Yes. Plates are processed on the camera, never stored, and results are only shown in groups. We help you document it for your data protection officer.", da: "Ja. Nummerplader behandles i kameraet, gemmes aldrig, og resultaterne vises kun samlet. Vi hjælper jer med at dokumentere det over for jeres databeskyttelsesrådgiver." } },
      { question: { en: "How detailed can the origins be?", da: "Hvor detaljeret kan oprindelsen være?" }, answer: { en: "Down to Danish postcodes and country for foreign cars, as long as each group is large enough.", da: "Helt ned til danske postnumre og land for udenlandske biler, så længe hver gruppe er stor nok." } },
      { question: { en: "Can we combine it with parking data?", da: "Kan vi kombinere det med parkeringsdata?" }, answer: { en: "Yes, and it is often most useful that way: who parks, for how long, and when.", da: "Ja, og det er ofte mest nyttigt sådan: hvem parkerer, hvor længe og hvornår." } }
    ],
    sections: ["signature", "stats", "answers", "use-cases", "steps", "deliverables", "projects", "faq"]
  },

  "charging-analysis": {
    eyebrow: { en: "Charging, measured", da: "Opladning, målt" },
    imageFirst: true,
    accent: "green",
    stats: [
      { value: { en: "Charging vs. parked", da: "Lader vs. holder" }, label: { en: "See how long cars stay after they are full", da: "Se hvor længe bilerne holder, efter de er ladet op" } },
      { value: { en: "Blocked bays", da: "Blokerede pladser" }, label: { en: "Spot non-electric cars in charging spaces", da: "Find almindelige biler på ladepladser" } },
      { value: { en: "Next chargers", da: "Næste ladere" }, label: { en: "Evidence for where to build next", da: "Grundlag for hvor der skal bygges næste gang" } }
    ],
    signature: {
      eyebrow: { en: "A day at the chargers", da: "En dag ved laderne" },
      title: { en: "Charging, waiting or blocked", da: "Lader, venter eller blokeret" },
      body: {
        en: "Each bar is a car in a charging space. Blue is time spent charging, pale is a full car that stays parked, and coral is a car that should not be there. Together they show how much charging capacity you really have.",
        da: "Hver bjælke er en bil på en ladeplads. Blå er tid, der bruges på at lade, lys er en fuldt opladet bil, der bliver holdende, og koral er en bil, der ikke burde holde der. Tilsammen viser de, hvor meget ladekapacitet I reelt har."
      },
      caption: { en: "Four charging spaces from 07:00 to 21:00 on a weekday.", da: "Fire ladepladser fra kl. 7 til 21 på en hverdag." },
      chart: {
        kind: "charging",
        spaces: [
          { en: "Space 1", da: "Plads 1" }, { en: "Space 2", da: "Plads 2" }, { en: "Space 3", da: "Plads 3" }, { en: "Space 4", da: "Plads 4" }
        ],
        sessions: [
          { space: 0, start: 7.5, end: 9.5, state: "charging" }, { space: 0, start: 9.5, end: 13, state: "idle" },
          { space: 0, start: 14, end: 15.5, state: "charging" }, { space: 0, start: 17.5, end: 19, state: "charging" },
          { space: 1, start: 8, end: 11.5, state: "blocked" }, { space: 1, start: 12, end: 13.5, state: "charging" },
          { space: 1, start: 13.5, end: 16, state: "idle" }, { space: 1, start: 18, end: 20.5, state: "charging" },
          { space: 2, start: 7, end: 8.5, state: "charging" }, { space: 2, start: 10, end: 11.5, state: "charging" },
          { space: 2, start: 11.5, end: 12.5, state: "idle" }, { space: 2, start: 15, end: 17.5, state: "blocked" },
          { space: 3, start: 9, end: 10.5, state: "charging" }, { space: 3, start: 10.5, end: 17, state: "idle" },
          { space: 3, start: 18.5, end: 20, state: "charging" }
        ]
      }
    },
    steps: [
      { title: { en: "List the charging spaces", da: "Kortlæg ladepladserne" }, body: { en: "Existing chargers and the places you are considering for new ones.", da: "Eksisterende ladere og de steder, I overvejer til nye." } },
      { title: { en: "Add sensors and cameras", da: "Tilføj sensorer og kameraer" }, body: { en: "Sensors tell when a space is taken; cameras tell whether the car is electric.", da: "Sensorer fortæller, hvornår en plads er optaget; kameraer fortæller, om bilen er elektrisk." } },
      { title: { en: "Combine with charger data", da: "Kombinér med laderdata" }, body: { en: "Where available, we add session data from the charge point operator.", da: "Hvor det er muligt, tilføjer vi sessionsdata fra ladeoperatøren." } },
      { title: { en: "Plan the next step", da: "Planlæg næste skridt" }, body: { en: "Rules, signs, enforcement or new chargers, based on what the data shows.", da: "Regler, skilte, kontrol eller nye ladere, baseret på hvad data viser." } }
    ],
    deliverables: [
      { en: "Occupancy and parking time per charging space", da: "Belægning og parkeringstid pr. ladeplads" },
      { en: "Time spent charging versus just parked", da: "Tid brugt på at lade i forhold til bare at holde" },
      { en: "Share of non-electric cars in charging bays", da: "Andel almindelige biler på ladepladser" },
      { en: "Local EV share and expected demand", da: "Lokal elbilandel og forventet efterspørgsel" },
      { en: "Recommendations for new charger locations", da: "Anbefalinger til placering af nye ladere" }
    ],
    useCases: [
      { title: { en: "Municipal charging plans", da: "Kommunale ladeplaner" }, body: { en: "Place public chargers where residents and visitors actually need them.", da: "Placér offentlige ladere, hvor borgere og besøgende faktisk har brug for dem." } },
      { title: { en: "Charge point operators", da: "Ladeoperatører" }, body: { en: "See utilisation per site and where the next investment pays off.", da: "Se udnyttelsen pr. lokation, og hvor den næste investering betaler sig." } },
      { title: { en: "Housing and workplaces", da: "Boliger og arbejdspladser" }, body: { en: "Share a few chargers fairly with time rules backed by data.", da: "Del få ladere retfærdigt med tidsregler, der bygger på data." } }
    ],
    faq: [
      { question: { en: "Do we need access to the chargers themselves?", da: "Skal vi have adgang til selve laderne?" }, answer: { en: "No. Our sensors and cameras work independently of the charger brand. Charger data is a bonus when available.", da: "Nej. Vores sensorer og kameraer virker uafhængigt af laderens mærke. Laderdata er en bonus, når de er tilgængelige." } },
      { question: { en: "How do you know if a car is electric?", da: "Hvordan ved I, om en bil er elektrisk?" }, answer: { en: "The camera looks up the vehicle type from the plate on the device, then discards the plate. Only the fuel type is kept.", da: "Kameraet slår køretøjstypen op ud fra nummerpladen i enheden og sletter derefter nummerpladen. Kun brændstoftypen gemmes." } },
      { question: { en: "Can you help with enforcement?", da: "Kan I hjælpe med kontrol?" }, answer: { en: "We show when and where misuse happens, so your parking control can focus on the right hours.", da: "Vi viser, hvornår og hvor misbrug sker, så jeres parkeringskontrol kan fokusere på de rigtige tidspunkter." } }
    ],
    sections: ["stats", "signature", "deliverables", "answers", "steps", "tools", "projects", "faq"]
  }
};
