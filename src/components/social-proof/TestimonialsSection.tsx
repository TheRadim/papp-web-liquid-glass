"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/site/basePath";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Locale } from "@/content/types";
import { getTestimonials } from "@/lib/content/accessors";
import { pick } from "@/lib/i18n/locales";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TestimonialsSectionProps {
  locale: Locale;
}

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const testimonials = getTestimonials(locale);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const previous = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((current) => (current + 1) % testimonials.length);

  useEffect(() => {
    if (testimonials.length < 2) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  function handleTouchEnd(x: number) {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - x;
    touchStartX.current = null;

    if (Math.abs(distance) < 44) return;
    if (distance > 0) {
      next();
    } else {
      previous();
    }
  }

  return (
    <Section className="testimonials-section">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}><defs><filter id="papp-testimonial-blue" colorInterpolationFilters="sRGB"><feFlood floodColor="#47b2e4" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs></svg>
      <SectionHeading
        title={locale === "da" ? "Samarbejde, der gør mobilitetsdata lettere at handle på." : "Collaboration that makes mobility data easier to act on."}
        align="center"
      />
      <div
        className="testimonial-carousel"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <button type="button" className="testimonial-arrow testimonial-arrow--left" onClick={previous} aria-label={locale === "da" ? "Forrige" : "Previous"}>
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <div className="testimonial-viewport">
        <div className="testimonial-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {testimonials.map((testimonial, index) => (
            <article className={`testimonial-card ${index === active ? "is-active" : ""}`} key={testimonial.slug}>
              <Quote aria-hidden="true" size={34} />
              <p>{pick(locale, testimonial.quote)}</p>
              <div>
                {testimonial.organisationLogo && !failedLogos[testimonial.slug] ? <Image className="testimonial-logo" src={withBasePath(testimonial.organisationLogo)} alt={testimonial.organisation} width={200} height={72} onError={() => setFailedLogos((current) => ({ ...current, [testimonial.slug]: true }))} /> : null}
                {!testimonial.organisationLogo || failedLogos[testimonial.slug] ? <strong>{testimonial.organisation}</strong> : null}
              </div>
            </article>
          ))}
        </div>
        </div>
        <button type="button" className="testimonial-arrow testimonial-arrow--right" onClick={next} aria-label={locale === "da" ? "Næste" : "Next"}>
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((testimonial, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            key={testimonial.slug}
            onClick={() => setActive(index)}
            aria-label={`${locale === "da" ? "Vis" : "Show"} ${testimonial.organisation}`}
          />
        ))}
      </div>
    </Section>
  );
}
