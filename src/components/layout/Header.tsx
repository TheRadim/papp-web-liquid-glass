"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { company } from "@/content/global/company";
import { navLabels, primaryNavigation, solutionGroups } from "@/content/global/navigation";
import { pick } from "@/lib/i18n/locales";
import { withBasePath } from "@/lib/site/basePath";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

import { GlassSurface } from "@/components/layout/GlassSurface";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGroupsOpen, setMobileGroupsOpen] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const [dockIndicator, setDockIndicator] = useState({ x: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const solutionsCloseTimer = useRef<number | null>(null);
  const pathname = usePathname();

  const localeRoot = `/${locale}`;

  function isActive(href: string) {
    if (href === localeRoot) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isSolutionsActive() {
    return ["/solutions", "/products", "/services"].some((segment) => pathname.startsWith(`${localeRoot}${segment}`));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
        setMenuOpen(false);
        setMobileGroupsOpen({});
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.body.classList.toggle("has-open-menu", menuOpen);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.classList.remove("has-open-menu");
    };
  }, [menuOpen]);

  useEffect(() => {
    let animationFrame = 0;

    function updateHeaderState() {
      setScrolled(window.scrollY > 18);
    }

    function onScroll() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateHeaderState);
    }

    updateHeaderState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const syncIndicatorFromElement = useCallback((element: Element | null) => {
    if (!dockRef.current || !(element instanceof HTMLElement)) {
      setDockIndicator((indicator) => ({ ...indicator, opacity: 0 }));
      return;
    }

    const dockBox = dockRef.current.getBoundingClientRect();
    const itemBox = element.getBoundingClientRect();

    setDockIndicator({
      x: itemBox.left - dockBox.left,
      width: itemBox.width,
      opacity: 1
    });
  }, []);

  const syncIndicatorToActive = useCallback(() => {
    syncIndicatorFromElement(dockRef.current?.querySelector('[data-active="true"]') ?? null);
  }, [syncIndicatorFromElement]);

  useEffect(() => {
    syncIndicatorToActive();
    window.addEventListener("resize", syncIndicatorToActive);

    return () => {
      window.removeEventListener("resize", syncIndicatorToActive);
    };
  }, [pathname, syncIndicatorToActive]);

  const openSolutionsMenu = useCallback(() => {
    if (solutionsCloseTimer.current) {
      window.clearTimeout(solutionsCloseTimer.current);
      solutionsCloseTimer.current = null;
    }

    setSolutionsOpen(true);
  }, []);

  const scheduleSolutionsClose = useCallback(() => {
    if (solutionsCloseTimer.current) {
      window.clearTimeout(solutionsCloseTimer.current);
    }

    solutionsCloseTimer.current = window.setTimeout(() => {
      setSolutionsOpen(false);
      solutionsCloseTimer.current = null;
    }, 260);
  }, []);

  useEffect(() => {
    return () => {
      if (solutionsCloseTimer.current) {
        window.clearTimeout(solutionsCloseTimer.current);
      }
    };
  }, []);

  const dockStyle = {
    "--nav-indicator-x": `${dockIndicator.x}px`,
    "--nav-indicator-width": `${dockIndicator.width}px`,
    "--nav-indicator-opacity": dockIndicator.opacity
  } as CSSProperties;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="container">
        <nav className="nav-shell" ref={navRef} aria-label="Primary">
          <GlassSurface />
          <Link
            className="brand-link"
            href={`/${locale}`}
            aria-label="Papp Mobility home"
            onClick={(event) => {
              setMenuOpen(false);
              setSolutionsOpen(false);
              setMobileGroupsOpen({});
              // Already on the homepage: go back up to the hero instead of doing nothing.
              if (pathname.replace(/\/$/, "") === localeRoot) {
                event.preventDefault();
                if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
                const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
              }
            }}
          >
            <Image src={withBasePath(company.logo)} alt="" width={46} height={46} priority />
            <span className="brand-wordmark">Papp Mobility</span>
          </Link>

          <div
            className="desktop-nav nav-dock"
            ref={dockRef}
            style={dockStyle}
            onPointerOver={(event) => syncIndicatorFromElement((event.target as Element).closest("[data-nav-target]"))}
            onPointerLeave={syncIndicatorToActive}
            onFocus={(event) => syncIndicatorFromElement((event.target as Element).closest("[data-nav-target]"))}
            onBlur={syncIndicatorToActive}
          >
            <span className="nav-indicator" aria-hidden="true" />
            <div
              className="solutions-menu"
              onMouseEnter={openSolutionsMenu}
              onMouseLeave={scheduleSolutionsClose}
              onFocus={openSolutionsMenu}
            >
              <Link
                className={`nav-item nav-item--solutions-combined ${solutionsOpen || isSolutionsActive() ? "is-active" : ""}`}
                href={`/${locale}/solutions`}
                data-nav-target
                data-active={isSolutionsActive() ? "true" : undefined}
                aria-expanded={solutionsOpen}
                aria-controls="solutions-dropdown"
              >
                <span>
                  {navLabels.solutions[locale]}
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </Link>
              {solutionsOpen ? (
                <div className="solutions-dropdown" id="solutions-dropdown">
                  {solutionGroups.map((group) => (
                    <div key={group.id} className={`solutions-dropdown__group solutions-dropdown__group--${group.id}`}>
                      <p className="dropdown-label">{pick(locale, group.label)}</p>
                      <div className="solutions-dropdown__items">
                        {group.items.map((item) => (
                          <Link key={pick(locale, item.label)} href={item.href[locale]} onClick={() => setSolutionsOpen(false)}>
                            <strong>{pick(locale, item.label)}</strong>
                            <span>{pick(locale, item.description)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {primaryNavigation(locale).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? "is-active" : ""}`}
                data-nav-target
                data-active={isActive(item.href) ? "true" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <LanguageSwitcher locale={locale} pathname={pathname} />
            <a className="login-link" href={company.insightsUrl} target="_blank" rel="noreferrer">
              {navLabels.login[locale]}
            </a>
            <button
              className={`mobile-menu-button ${menuOpen ? "is-open" : ""}`}
              type="button"
              aria-label={menuOpen ? navLabels.close[locale] : navLabels.menu[locale]}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((open) => {
                  if (open) {
                    setMobileGroupsOpen({});
                  }

                  return !open;
                });
              }}
            >
              <span className="hamburger-icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {menuOpen ? (
        <div className="mobile-panel">
          <div className="container">
            <div className="mobile-panel__inner">
              <Link href={`/${locale}/solutions`} onClick={() => {
                setMenuOpen(false);
                setMobileGroupsOpen({});
              }}>
                {navLabels.solutions[locale]}
              </Link>
              {solutionGroups.map((group) => (
                <div key={group.id} className="mobile-group">
                  <button
                    type="button"
                    aria-expanded={Boolean(mobileGroupsOpen[group.id])}
                    onClick={() => setMobileGroupsOpen((current) => ({ ...current, [group.id]: !current[group.id] }))}
                  >
                    <span>{pick(locale, group.label)}</span>
                    <ChevronDown aria-hidden="true" size={17} />
                  </button>
                  {mobileGroupsOpen[group.id] ? (
                    <div className="mobile-group__links">
                      {group.items.map((item) => (
                        <Link key={pick(locale, item.label)} href={item.href[locale]} onClick={() => {
                          setMenuOpen(false);
                          setMobileGroupsOpen({});
                        }}>
                          {pick(locale, item.label)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {primaryNavigation(locale).map((item) => (
                <Link key={item.href} href={item.href} onClick={() => {
                  setMenuOpen(false);
                  setMobileGroupsOpen({});
                }}>
                  {item.label}
                </Link>
              ))}
              <a className="mobile-login-link" href={company.insightsUrl} target="_blank" rel="noreferrer">
                {navLabels.login[locale]}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
