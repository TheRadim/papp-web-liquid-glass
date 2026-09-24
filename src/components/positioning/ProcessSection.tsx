import type { HomeContent } from "@/content/home/home";
import type { Locale } from "@/content/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InsightDashboardMockup } from "@/components/positioning/InsightDashboardMockup";
import { ProcessTimeline } from "@/components/positioning/ProcessTimeline";

interface ProcessSectionProps {
  content: HomeContent["process"];
  locale: Locale;
}

export function ProcessSection({ content, locale }: ProcessSectionProps) {
  return (
    <section id="movement-meaning" className="process-section" aria-label={content.title} role="region" tabIndex={0}>
      <div className="process-section__intro">
        <div id="movement-meaning-intro"><SectionHeading eyebrow={content.eyebrow} title={content.title} body={content.body} align="center" /></div>
      </div>
      <InsightDashboardMockup locale={locale} />
      <ProcessTimeline steps={content.steps} />
      <div className="process-section__outro" aria-hidden="true" />
    </section>
  );
}
