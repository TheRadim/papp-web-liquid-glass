"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/content/types";
import { meetingAvailability as availability } from "@/config/meeting";
import { meetingDates, meetingEmail, validMeetingSlot } from "@/lib/booking/meeting";
import { withBasePath } from "@/lib/site/basePath";

export function MeetingRequest({ locale, source }: { locale: Locale; source: string }) {
  const da = locale === "da";
  const [week, setWeek] = useState(0);
  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [prepared, setPrepared] = useState<{ href: string; body: string } | null>(null);
  const [error, setError] = useState("");
  function changeWeek(next: number) {
    setWeek(next); setDates(meetingDates(new Date(), next)); setDate(""); setTime(""); setPrepared(null); setError("");
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validMeetingSlot(date, time, duration)) {
      setError(da ? "Vælg en ny dato og tid. Datoerne er blevet opdateret." : "Please choose a new date and time. Availability dates have been refreshed.");
      setDates(meetingDates(new Date(), week)); setDate(""); return;
    }
    const form = new FormData(event.currentTarget);
    const email = meetingEmail({ name: String(form.get("name")), company: String(form.get("company")), email: String(form.get("email")), phone: String(form.get("phone") || ""), message: String(form.get("message") || ""), date, time, duration, source });
    setError(""); setPrepared(email);
    window.location.href = email.href;
  }
  return <aside className="meeting-request">
    <div className="meeting-request__intro">
      <Image src={withBasePath("/images/team/martine-profile-new.webp")} alt="Martine Winther" width={112} height={112} />
      <div><p className="eyebrow">{da ? "Tal med Martine" : "Talk to Martine"}</p><h3>{da ? "Usikker på, hvilke data I har brug for?" : "Not sure what data you need?"}</h3><p>{da ? "Fortæl vores konsulent om det problem, I vil løse." : "Tell our consultant about the problem you are trying to solve."}</p></div>
    </div>
    <details onToggle={(event) => { if (event.currentTarget.open && !dates.length) setDates(meetingDates()); }}>
      <summary className="papp-button papp-button--primary">{da ? "Anmod om et møde" : "Request a meeting"}</summary>
      <form className="meeting-request__form" onSubmit={submit} onChange={() => setPrepared(null)}>
        <p>{da ? "Vælg et ønsket tidspunkt. Vi bekræfter tiden med dig efter din henvendelse. Alle tider er dansk tid." : "Choose a preferred time. We will confirm availability after receiving your request. All times are Denmark time."}</p>
        <div className="meeting-request__weeks"><button type="button" disabled={week === 0} onClick={() => changeWeek(week - 1)}>{da ? "Forrige uge" : "Previous week"}</button><span aria-live="polite">{dates[0] ? new Intl.DateTimeFormat(da ? "da-DK" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${dates[0]}T12:00:00Z`)) : "…"}</span><button type="button" disabled={week >= availability.weeksAhead - 1} onClick={() => changeWeek(week + 1)}>{da ? "Næste uge" : "Next week"}</button></div>
        <fieldset><legend>{da ? "Dato" : "Date"}</legend><div className="meeting-request__choices">{dates.map((value) => <label key={value}><input type="radio" name="date" value={value} checked={date === value} required onChange={() => { setDate(value); setPrepared(null); }} /><span>{new Intl.DateTimeFormat(da ? "da-DK" : "en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`))}</span></label>)}</div></fieldset>
        <fieldset><legend>{da ? "Tidspunkt" : "Time"} · Europe/Copenhagen</legend><div className="meeting-request__choices">{availability.times.map((value) => <label key={value}><input type="radio" name="time" value={value} checked={time === value} required onChange={() => { setTime(value); setPrepared(null); }} /><span>{value}</span></label>)}</div></fieldset>
        <fieldset><legend>{da ? "Varighed" : "Duration"}</legend><div className="meeting-request__choices">{availability.durations.map((value) => <label key={value}><input type="radio" name="duration" value={value} checked={duration === value} onChange={() => { setDuration(value); setPrepared(null); }} /><span>{value} min</span></label>)}</div></fieldset>
        <div className="meeting-request__fields">
          <label>{da ? "Navn" : "Name"}<input name="name" autoComplete="name" required maxLength={120} /></label>
          <label>{da ? "Virksomhed / organisation" : "Company / organisation"}<input name="company" autoComplete="organization" required maxLength={160} /></label>
          <label>Email<input type="email" name="email" autoComplete="email" required maxLength={200} /></label>
          <label>{da ? "Telefon (valgfrit)" : "Phone (optional)"}<input type="tel" name="phone" autoComplete="tel" maxLength={40} /></label>
        </div>
        <label>{da ? "Hvad vil du tale om? (valgfrit)" : "What would you like to discuss? (optional)"}<textarea name="message" rows={3} maxLength={2000} /></label>
        <label className="checkbox-label"><input type="checkbox" required /><span>{da ? "Jeg accepterer, at Papp kontakter mig om mødet." : "I agree that Papp may contact me about this meeting."}</span></label>
        <p className="meeting-request__note">{da ? "Knappen åbner din mailapp med anmodningen. Send mailen derfra. Tidspunktet er ikke reserveret." : "The button opens your email app with the request. Send the email from there. The time is not reserved."}</p>
        <button type="submit" className="papp-button papp-button--primary">{da ? "Åbn mødeanmodning i mail" : "Prepare meeting request email"}</button>
        {error ? <p role="alert">{error}</p> : null}
        {prepared ? <div role="status"><strong>{da ? "Din anmodning er klar — send den fra din mailapp." : "Your request is ready — send it from your email app."}</strong><p>{da ? "Når vi har modtaget den, bekræfter vi tidspunktet. Ingen mailapp? Kopiér oplysningerne nedenfor og send dem til " : "Once received, we will confirm the time. No email app? Copy the details below and send them to "}<a href={`mailto:${availability.recipient}`}>{availability.recipient}</a>.</p><a href={prepared.href}>{da ? "Åbn mail igen" : "Open email again"}</a><pre>{prepared.body}</pre></div> : null}
      </form>
    </details>
  </aside>;
}
