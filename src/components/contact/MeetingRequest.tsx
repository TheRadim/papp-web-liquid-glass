"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from "lucide-react";
import type { Locale } from "@/content/types";
import { meetingAvailability as availability, meetingTopics } from "@/config/meeting";
import { calendarMonth, meetingDates, meetingEmail, validMeetingSlot } from "@/lib/booking/meeting";
import { withBasePath } from "@/lib/site/basePath";

export function MeetingRequest({ locale, source }: { locale: Locale; source: string }) {
  const da = locale === "da";
  const id = useId();
  const topicRef = useRef<HTMLSelectElement>(null);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [details, setDetails] = useState(false);
  const [prepared, setPrepared] = useState<{ href: string; body: string } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (details) topicRef.current?.focus({ preventScroll: true }); }, [details]);
  const format = (value: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(da ? "da-DK" : "en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
  function toggle() {
    if (!open) {
      const upcoming = Array.from({ length: availability.weeksAhead }, (_, week) => meetingDates(new Date(), week)).flat();
      setDates(upcoming); setMonth(upcoming.includes(date) ? date.slice(0, 7) : upcoming[0].slice(0, 7));
    }
    setOpen(!open);
  }
  function moveMonth(amount: number) {
    const next = new Date(`${month}-01T12:00:00Z`);
    next.setUTCMonth(next.getUTCMonth() + amount);
    setMonth(next.toISOString().slice(0, 7));
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validMeetingSlot(date, time, duration)) {
      setError(da ? "Vælg en ny dato og tid." : "Please choose a new date and time.");
      setDates(Array.from({ length: availability.weeksAhead }, (_, week) => meetingDates(new Date(), week)).flat());
      setDetails(false); setDate(""); setTime(""); return;
    }
    const form = new FormData(event.currentTarget);
    const email = meetingEmail({ name: String(form.get("name")), email: String(form.get("email")), topic: String(form.get("topic")), message: String(form.get("message") || ""), date, time, duration, source });
    setError(""); setPrepared(email); window.location.href = email.href;
  }
  return <aside className="meeting-request meeting-request--calendar">
    <div className="meeting-request__intro">
      <Image src={withBasePath("/images/team/martine-profile-new.webp")} alt="Martine Winther" width={112} height={112} />
      <div><p className="eyebrow">{da ? "Tal med Martine" : "Talk to Martine"}</p><h3>{da ? "Lad os finde næste skridt." : "Let’s find your next step."}</h3><p>{da ? "En samtale om jeres spørgsmål og muligheder." : "A conversation about your question and the possibilities."}</p></div>
      <button className="papp-button papp-button--primary" type="button" aria-expanded={open} aria-controls={id} onClick={toggle}><CalendarDays size={18} aria-hidden="true" />{open ? (da ? "Luk kalender" : "Close calendar") : (da ? "Find et tidspunkt" : "Find a time")}</button>
    </div>
    <div className={`meeting-reveal ${open ? "is-open" : ""}`} id={id} inert={!open}><div>
      <div className="meeting-calendar-content">
        {!details ? <>
          <div className="meeting-calendar-layout">
            <div className="meeting-month">
              <div className="meeting-month__header"><h4 aria-live="polite">{month ? format(`${month}-01`, { month: "long", year: "numeric" }) : ""}</h4><div><button type="button" aria-label={da ? "Forrige måned" : "Previous month"} disabled={month <= (dates[0]?.slice(0, 7) || "")} onClick={() => moveMonth(-1)}><ChevronLeft size={20} /></button><button type="button" aria-label={da ? "Næste måned" : "Next month"} disabled={month >= (dates.at(-1)?.slice(0, 7) || "")} onClick={() => moveMonth(1)}><ChevronRight size={20} /></button></div></div>
              <div className="meeting-month__weekdays" aria-hidden="true">{(da ? ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"] : ["M", "T", "W", "T", "F", "S", "S"]).map((day, index) => <span key={index}>{day}</span>)}</div>
              <div className="meeting-month__days" role="group" aria-label={da ? "Vælg dato" : "Choose a date"}>{month ? calendarMonth(month).map((day) => day.startsWith(month) ? <button key={day} type="button" disabled={!dates.includes(day)} aria-pressed={date === day} aria-label={format(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} onClick={() => { setDate(day); setTime(""); setPrepared(null); setError(""); }}>{Number(day.slice(-2))}</button> : <span key={day} />) : null}</div>
              <p className="meeting-calendar-note">{da ? "Alle tider er dansk tid." : "All times are Denmark time."}</p>
            </div>
            <div className="meeting-slot">
              <fieldset><legend>{da ? "Hvor lang tid?" : "How long?"}</legend><div className="meeting-duration">{availability.durations.map((value) => <label key={value}><input type="radio" name={`${id}-duration`} value={value} checked={duration === value} onChange={() => setDuration(value)} /><span>{value} min</span></label>)}</div></fieldset>
              <fieldset disabled={!date}><legend>{date ? format(date, { weekday: "short", day: "numeric", month: "short" }) : (da ? "Vælg først en dato" : "Choose a date first")}</legend><div className="meeting-times">{availability.times.map((value) => <label key={value}><input type="radio" name={`${id}-time`} value={value} checked={time === value} onChange={() => setTime(value)} /><span>{value}</span></label>)}</div></fieldset>
              <button className="papp-button papp-button--primary" type="button" disabled={!date || !time} onClick={() => setDetails(true)}>{da ? "Fortsæt" : "Continue"}<ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          </div>
          <p className="meeting-calendar-note">{da ? "Vælg et ønsket tidspunkt. Vi bekræfter det efter din henvendelse." : "Choose a preferred time. We’ll confirm it after your request."}</p>
        </> : <form className="meeting-request__form" onSubmit={submit} onChange={() => setPrepared(null)}>
          <div className="meeting-selection"><strong>{format(date, { weekday: "short", day: "numeric", month: "long" })} · {time} · {duration} min</strong><button type="button" onClick={() => { setDetails(false); setPrepared(null); }}>{da ? "Skift" : "Change"}</button></div>
          <label>{da ? "Hvad handler det om?" : "What’s the topic?"}<select ref={topicRef} name="topic" required defaultValue=""><option value="" disabled>{da ? "Vælg emne" : "Select a topic"}</option>{meetingTopics.map((topic) => <option key={topic.en} value={topic.en}>{topic[locale]}</option>)}</select></label>
          <div className="meeting-request__fields"><label>{da ? "Navn" : "Name"}<input name="name" autoComplete="name" required maxLength={120} /></label><label>Email<input type="email" name="email" autoComplete="email" required maxLength={200} /></label></div>
          <label>{da ? "Hvad vil du drøfte? (valgfrit)" : "What would you like to discuss? (optional)"}<textarea name="message" rows={3} maxLength={2000} /></label>
          <p className="meeting-calendar-note">{da ? "Åbner din mailapp. Send anmodningen derfra, tidspunktet er først aftalt, når vi har bekræftet det." : "Opens your email app. Send the request there, the time is subject to confirmation."}</p>
          <button type="submit" className="papp-button papp-button--primary">{da ? "Opret mødeanmodning" : "Prepare meeting request"}</button>
          {prepared ? <div role="status"><strong>{da ? "Klar til at sende fra din mailapp." : "Ready to send from your email app."}</strong><p>{da ? "Ingen mailapp? Send oplysningerne nedenfor til " : "No email app? Send the details below to "}<a href={`mailto:${availability.recipient}`}>{availability.recipient}</a>.</p><a href={prepared.href}>{da ? "Åbn mail igen" : "Open email again"}</a><pre>{prepared.body}</pre></div> : null}
        </form>}
        {error ? <p role="alert">{error}</p> : null}
      </div>
    </div></div>
  </aside>;
}
