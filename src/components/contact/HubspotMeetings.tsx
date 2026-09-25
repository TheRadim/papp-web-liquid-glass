"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";
import { hubspotEmbedUrl, readHubspotMessage } from "@/lib/booking/hubspot";

/** HubSpot's live booking calendar, sized to its content inside the meeting card. */
export function HubspotMeetings({ locale, active, onBooked }: { locale: Locale; active: boolean; onBooked: () => void }) {
  const da = locale === "da";
  const src = hubspotEmbedUrl();
  const [height, setHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // Load the iframe the first time the panel opens, then keep it so a half-finished booking survives closing.
  const [started, setStarted] = useState(false);
  if (active && !started) setStarted(true);
  useEffect(() => {
    function listen(event: MessageEvent) {
      const message = readHubspotMessage(event.origin, event.data);
      if (!message) return;
      if (message.height) setHeight(message.height);
      if (message.booked) onBooked();
    }
    window.addEventListener("message", listen);
    return () => window.removeEventListener("message", listen);
  }, [onBooked]);
  if (!src) return null;
  return <div className={`meeting-hubspot ${loaded ? "is-loaded" : ""}`} style={height ? { height } : undefined}>
    {!loaded ? <p className="meeting-hubspot__loading" role="status">{da ? "Henter ledige tider…" : "Loading available times…"}</p> : null}
    {started ? <iframe src={src} title={da ? "Book et møde" : "Book a meeting"} loading="lazy" onLoad={() => setLoaded(true)} /> : null}
  </div>;
}
