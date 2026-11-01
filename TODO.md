# Needs your attention

Things only you can decide or do. Claude keeps this list up to date: items get ticked off when they're done and new ones are added as they come up. Last updated: 1 Nov 2026.

## Before launch (blocking)

- [ ] **Pick a host for the live site: Vercel (recommended) or Netlify.** GitHub Pages only serves static files, so the old-address redirects and a working contact form both need a real host. Say the word and Claude walks you through it.
- [ ] **Make the contact form deliver messages.** It posts to `/api/contact`, which is only a test stub and doesn't exist on GitHub Pages, so messages go nowhere today. Options: a free [Web3Forms](https://web3forms.com) key (also used by the meeting form) or an email service on the new host.
- [ ] **Add a Web3Forms access key for meeting requests** (`NEXT_PUBLIC_WEB3FORMS_KEY`). Without it, meeting requests open the visitor's mail app instead of sending directly. HubSpot booking works already.
- [ ] **Move the meeting calendar to Martine or Tan.** The booking calendar (HubSpot link in `src/config/meeting.ts`) is still yours; send Claude their HubSpot meeting link.
- [ ] **New team photos** to replace Michael's portrait on the About page.
- [ ] **Confirm the meeting email address.** Requests go to `radim.theiner@papp.nu` (`src/config/meeting.ts`), while the rest of the site uses `@pappmobility.com`.
- [ ] **Replace the privacy page placeholder** with the real privacy policy (currently says "migration placeholder").
- [ ] **Legal review**: go through `docs/legal-review-needed.md` (privacy, camera-analytics wording, GDPR claims, partner logos, testimonials).

## At launch

- [ ] Point `pappmobility.com` at the new host.
- [ ] Turn on search indexing: the site is set to `noindex` while it's a preview, and its base address is still the GitHub preview URL (`src/app/layout.tsx`). Claude can flip both when you say go.
- [ ] Add the site to Google Search Console and submit `/sitemap.xml`.

## Content to check

- [ ] **Brøndby testimonial**: the card is on the homepage with the logo only. Send the quote (camera project) and confirm the logo is right.
- [ ] **Ramboll in Collaborations**: shows the name as text until we have approval to use the logo. Send the logo file once they say yes.
- [ ] **Papp API page** (`/products/api`): the capabilities, the example response and "documentation shared at onboarding" are Claude's best guess. Check what the API really offers.
- [ ] **Partnerships page** (`/partnerships`): check the wording for consultancies, retailers (ANPR) and data companies, and whether the meeting form should go to someone else.
- [ ] **Insights page catchment map**: the municipality numbers are illustrative demo values (a site in Herning). Municipality borders: Styrelsen for Dataforsyning og Infrastruktur (DAGI); the homepage map uses Natural Earth (public domain). Add a source line if the legal review asks for it.

- [ ] **Brand font: decide whether the site should use Poppins.** The styles always asked for Jost/Poppins/Open Sans but never loaded them, so every visitor has been seeing their device's system font (San Francisco on your Mac). The site now uses the system font on purpose. If you want Poppins everywhere, Claude can self-host it; it's a two-line switch in `src/styles/tokens.scss`.

- [ ] Danish wording on the 3D scene: the sign says "LEDIG" (also when it shows 2) and the dashboard labels (`CITY_DATA` in `src/config/mobility-city.ts`).
- [ ] Example numbers on the 3D Insights dashboard (2–3 vehicles, 126 entries today) — fine as illustration, change if you'd rather show something else.

- [ ] **Homepage first line.** "Papp Mobility / We do parking simple." doesn't say what Papp does. Consider a plain line under it, e.g. "Sensors, cameras and data that show how parking and streets are really used." (your wording).

## Nice to have (Claude can do these, needs your OK)

- [ ] Compress images and the 12 MB sensor model so pages load faster (about 50 MB of assets are served at full size).
- [ ] Host the 3D lighting file ourselves instead of loading it from raw.githack.com on the sensor page.

## Housekeeping

- [ ] **Revoke the old GitHub token** (GitHub → Settings → Developer settings → Fine-grained tokens). Claude now uses the new one sent on 25 Oct.
- [ ] On your Mac, run `npm ci` once; the `.next` and `out` folders are build leftovers and safe to delete.
- [ ] Before re-exporting the city model from Blender, run *Mesh → Normals → Recalculate Outside* on the ground pieces.

## Done

- [x] GitHub connected; history credits only you.
- [x] Repository cleaned up, README added.
- [x] Redirects for all old Wix pages and projects; bare domain picks the browser language.
- [x] Design pass (system font, press feedback, accessible glass) and motion pass (consistent timing, hover only with a mouse, mobile menu exit).
- [x] 1 Nov feedback: Denmark traffic map in the hero, side buttons on the iMac preview and Insights explorer, icons on the process steps, Insights first on the homepage, app section removed from the homepage, one-line footer, Partnerships page and nav link, Papp API page, camera moved to the lot entrance, fresh green grass, closer sensor view, sticky hover fixed, About shows the team first.
- [x] Typography and polish pass (readable small text, fewer font sizes, balanced headings, scroll-in for sections, arrow hovers).
