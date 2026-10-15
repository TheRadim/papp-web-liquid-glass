# Redirects from the old site

When this site replaces the Wix site on pappmobility.com, old addresses forward to the new pages.

## What is set up

- **Bare domain** (`pappmobility.com/`): picks Danish or English from the visitor's browser languages (first Danish or English preference wins, otherwise English). See `src/components/layout/LanguageRedirect.tsx`.
- **Old pages and all 8 old project pages**: permanent (308) redirects, listed in `src/config/legacy-redirects.json`. Encoded and unencoded forms of æ/ø/å are both covered. `tests/redirects.test.ts` checks every target page exists.

| Old address | New page |
| --- | --- |
| /produkter | /da/products/insights |
| /udstyr | /da/products/sensors |
| /analyse | /da/services/analysis |
| /analyse-parkeringsanalyse | /da/services/parking-analysis |
| /rådgivning | /da/services/consultancy |
| /projekter | /da/projects |
| /app, /papp-mobility-app | /da/app |
| /om-os, /mød-teamet | /da/about |
| /kontakt | /da/contact |
| /privatlivspolitik | /da/privacy |
| /projekter/sensordata-i-herning | /da/projects/sensordata-herning |
| /projekter/datadrevet-parkering-med-iot-løsninger-ved-kysten-i-thisted | /da/projects/kystparkering-thisted |
| /projekter/bedre-overblik-og-regulering-af-parkeringskapaciteten-i-ishøj | /da/projects/parkeringsmoenstre-ishoej |
| /projekter/ladeindsigter-paa-frederiksberg | /da/projects/ladeindsigter-frederiksberg |
| /projekter/iot-teknologi-i-varde | /da/projects/iot-teknologi-varde |
| /projekter/handicap-og-ladepladser-i-gentofte | /da/projects/handicap-og-ladepladser-gentofte |
| /projekter/dataoptimering-i-faaborg | /da/projects/dataoptimering-faaborg |
| /projekter/erhvervsparkering-i-aalborg | /da/projects/erhvervsparkering-aalborg |

## Still to do at launch

1. Host the site on a platform that runs Next.js redirects (Vercel, Netlify or another Node host). GitHub Pages serves static files only, so the page redirects above don't run there; the language choice on the bare domain does.
2. Point pappmobility.com at the new host.
3. In Google Search Console, add the site and submit `/sitemap.xml`.
