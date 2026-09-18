"use client";

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
                <span>{testimonial.organisation.slice(0, 1)}</span>
                <strong>{testimonial.organisation}</strong>
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
