# Liquid-glass navigation review

final result: passed

## Visual target and evidence
- User-supplied toolbar reference: codex-clipboard-e795b164-e86a-4fb4-8eec-a11e2de06d5d.png (453 × 61 pixels).
- Supporting reference: the supplied Papp sidebar and numerical glass settings.
- Implementation: qa/desktop-menu.png (1280 × 720 CSS viewport) and qa/mobile-menu.png (390 × 844 CSS viewport), browser screenshots at native capture density.
- The toolbar source and desktop implementation were displayed together for comparison. This is a style adaptation to a marketing website, not a pixel-identical recreation of the reference analytics application. Compare the focused top-bar surface, rounded silhouette, subdued shadow and control treatment; different app content and widths are intentional.

## Findings
No actionable P0/P1/P2 findings in the scoped navigation change.
- Typography: existing brand font retained; compact, legible controls and wordmark.
- Layout: inset 64px desktop bar and 58px phone bar, 34px corners, rounded dropdown. No cropped navigation controls at inspected widths.
- Colour: existing coral and blue preserved, neutral frost, white active pill. Zero shader chromatic aberration, distortion, specular and edge highlight.
- Images: existing vector brand asset retained, no substitute artwork.
- Copy: existing navigation and destinations retained. Added Papp Mobility wordmark.
- Interaction: keyboard entry into Solutions, product navigation, mobile menu, Technology expansion and Escape dismissal verified. Phone login stays in the menu. Desktop login remains visible.
- Browser error log: no errors during inspected navigation.

## Implementation detail and limits
The library renders only the decorative surface using the supplied settings; native backdrop blur samples live page content. This avoids rasterising the entire page, including WebGL models and charts. It is not a full-page optical refraction simulation. The CSS surface also works without WebGL. Mobile Safari hardware was not available for device testing.

## Comparison history
First comparison passed; no visual correction cycle required.

## Checks
Lint, nine existing tests and static Pages build passed. Responsive viewport override reset after testing.

## Shared surfaces follow-up
Extended the approved glass treatment to About/team/timeline, project filters and cards, homepage solution panels, product panels, forms and footer. Inspected desktop projects (camera filter selected), About February 2021 link, Insights controls/cards, and homepage footer; inspected contact fields at 390 × 844 and verified no horizontal overflow. No browser errors observed. Found and corrected missing inner padding on Insights chart cards; recapture confirmed inset text. Filter selection and timeline links still work; form input focus tested without submitting. Shared surfaces use native blur to avoid a WebGL context per card. Original repository remains untouched.

## Rounded-surface second pass
Increased broad panel radius to 36px desktop / 28px phone, with 24px inset media and smaller control radii. Covered App dock/icons, sensor text controls, camera feature cards, project workflow/detail sidebar and metadata, service/product hero images, solution controls, homepage testimonials and dark dashboard panels. Removed workflow card accent strips. Inspected main EN routes and project detail at desktop and 390px phone widths: no horizontal overflow. Visually checked App dock and feature selection, camera cards and rotation, mobile Solutions selection/detail panel. No browser errors observed. Kept phone frames, charts and 3D geometry intact. Final result remains passed.

## Targeted simplification and data review
Phone project filter descriptions hidden below 768px; 12px gaps and compact icon/title tiles verified at 390px. Workflow line removed and dot animations verified at 0/2/4/6-second offsets; reduced-motion disables pulsing. Testimonials have no surface/shadow, arrows retain glass; partners section computed white. Both Insights editorial panels have transparent backgrounds and no shadow. Area selector verified with All parking lots and Parking zone 1–3; selecting zone 3 updates charts/metrics. Dataset has 973 rows of approved analytical columns, no plate field, no raw CSV in public or exported output; original CSVs are not in this repository. Added privacy/schema regression tests, all 12 tests pass with lint and static build.

## Seamless backgrounds and editorial simplification
Unified the actual section canvas to white across home, projects, sensor/camera/Insights and services (computed backgrounds checked in browser). Removed homepage phone drop shadow and decorative band. Testimonials now clip only the slide viewport, keeping sibling arrow shadows visible; 400ms ease-in-out hover transitions verified. Workflow pulse extended to 16 seconds with much lower scale/halo intensity. Contact has seven large orbs with 55px blur and low opacity, moving over 24–42 seconds. Project articles now have a single readable column, no sticky sidebar/repeated tags, no article divider lines, and one concluding CTA; inspected desktop and 390px mobile without horizontal overflow. Shared Ideal for row now appears exactly once on each of five offering pages. Lint, all 12 tests and static export passed.

## Product and viewport refinement — 18 September 2026
- Removed the shared Ideal for section from every offering; centred sensor/camera introductions and About underline; reduced product hero titles and removed camera viewer surface.
- Shared project-card links cover the image and copy, with named accessible links and visible keyboard focus.
- App and Contact content now share viewport height with the header/footer, with height-responsive phone, form and spacing. Natural scrolling remains on narrow/short screens.
- Browser checks: App footer fits at 1280×720, 1024×768 and 1440×900; Contact footer fits at 1280×720 and 1440×900. Phone 390×844 remains readable with natural scroll. Camera and sensor desktop titles each occupy one line; introductions centred; camera shadow none; About underline at heading midpoint; related-project navigation works.
- Lint, 12 tests and static Pages export passed. Original repository untouched.

## Clearer glass and draft city — 20 September 2026
- Content and footer surfaces use more transparent graduated glass fills; additional camera controls, chart controls, app icons and form fields use the shared glass treatment. Header styling unchanged, and previously unboxed sections remain unboxed.
- Imported supplied pappcity.glb unchanged as a draft city asset; repositioned sensor/camera markers and focus views to match its geometry. Desktop sensor selection and 390px mobile camera selection render and open their information panels; no browser errors observed.
- Supplied brand artwork now forms a 1200×630 uncropped social preview. Open Graph and Twitter metadata use an absolute GitHub Pages image URL and consistent glass-site canonical URLs.
- Lint, all 12 tests, and production export passed; production preview checked on desktop and phone. Original website untouched.

## Vertical centring — 20 September 2026
- Made the App/Contact route-transition wrapper flex to pass remaining main-area height through to each section.
- Production preview at 1440×1000: Contact margins above/below content both 102.28px; App both 31.55px; footer ends at viewport bottom. At 390×844 App remains top-accessible and scrolls naturally.
- Static production build passed.

## Offering clarity and meeting requests — 23 September 2026
- Increased navigation/dropdown and city-card frost opacity, including the scrolled header state. Preserved existing visual language and animations; tightened the five-step homepage stream and portfolio introduction.
- Added a stationary-sentence capability rotation with pause/reduced-motion support, client logos with contain sizing/fallback, outcome-first Solutions copy, separate public-sector reports and business workshops, and shared consultant meeting requests.
- Sensor exterior uses a safe cloned untextured material override, dark grey with opaque surfaces throughout hover. Camera range control removed; direct drag changed displayed frame 24 to 47 in phone-size browser testing, with arrow controls retained.
- Added a filter-driven fleet fuel profile from structured demo rows. App cycle is 2.5 seconds with a verified 0.5-second image transition.
- Browser checks at 1440px desktop and 390px phone covered hero wrapping, menu keyboard expansion, all six loaded municipality logos, city popup contrast, camera dragging, sensor appearance, chart layout, project order, service CTAs and date/time/duration selection. No console errors observed on Insights.
- Meeting dates begin next week; tests cover Copenhagen midnight, DST, year boundaries, invalid slots and email payload. Recipient: radim.theiner@papp.nu. Static hosting has no email delivery service: UI prepares an email and explicitly asks the visitor to send it; it never claims the request was sent or the meeting reserved. No test emails sent.
- ESLint, all 17 tests and production static export passed. No new dependencies. Original website/repository untouched.

## Homepage, services and calendar refinement — 24 September 2026
- Faster 2-second capability rotation, reserved phrase width and no pause control; desktop sentence stays on one line and phone wraps without horizontal overflow. Reduced-motion support retained.
- Light iMac examples now include real Natural Earth geographic outlines, structured illustrative country/manufacturer shares and nine days of activity peaks. Checked map/manufacturer views on desktop and activity on 390px phone; examples clearly labelled. Source attribution stored with map data.
- Testimonial logos use Papp blue with no duplicate organisation label; fallback retained. Homepage and Solutions App imagery use the current feature-1 phone asset.
- Meeting requests now open into a month calendar with date, duration and time selection, followed by topic/name/email/context. Verified desktop and phone selection, next-week availability and focus transfer. Contact restored without booking. Email handoff remains explicit; no messages sent.
- Distinct report-focused Analysis and workshop-focused Consultancy stories precede booking. Solutions restores title/model first, then concise outcomes and Insights/Cameras/On-ground sensors/App ordering. Projects background animation removed; About timeline labels inherit body typography.
- Contact at 1440×900 remains aligned with footer visible; new homepage phone checked at 390px. Solutions model renders. No homepage console errors or horizontal overflow observed.
- ESLint, 19 tests and production Pages export passed. Original repository/site untouched.

## Alignment and content refinements — 24 September 2026
- Shortened capability to parking data; moved hero actions/arrow lower and targeted the next introduction directly. Phone browser verified heading lands at 144px below the navigation after clicking the arrow, with no horizontal overflow.
- Corrected dashboard panel width so heading, iMac and caption share the horizontal centre (720px at 1440px viewport). Compact single-line tabs now use blue states; screen header restored as Mobility overview. Added reduced-motion-aware bar, line and map entrance animations. Desktop and phone previews inspected.
- Moved deployment sentence beneath outcomes headline, reduced listing titles, and placed App after Consultancy. Browser confirmed offering order. Broadened Analysis measurement examples; Consultancy now explains interpreting Papp Insights together. Removed repetitive Projects process section.
- Lint and production export passed. Original site unchanged.

## Feedback round: hero, previews, Insights explorer and services, 24 September 2026
- Continued an unfinished Codex pass (hero wrapper, grey sensor, camera arrows, draft consultancy and Plotly switcher) and completed it.
- Hero: one viewport tall; title and capability line centred below the header using svh and vw sizing; actions and scroll cue anchored to the bottom edge. Capability line is heavier and never wraps; on phones its font scales from the longest sentence length.
- iMac preview: screen is a CSS size container with KPI tiles and white chart cards. Vehicle mix shows manufacturers plus a drivetrain donut (petrol, diesel, electric, hybrid, other) when space allows; phones show one chart. Removed the illustrative examples note.
- Removed remaining spaced dashes from visible copy (date range now uses "to").
- Sensor: every part #696969 with a matte finish (glTF default metalness made it render near black).
- Insights: the final fleet chart is replaced by a tabbed Plotly explorer with fleet age, manufacturers treemap coloured by electric share, guest origin choropleth on a log scale, 3D occupancy landscape, occupancy through the day with percentile band, arrival intensity heatmap and a forecast replay. Synthetic deterministic data in advanced-demo.ts.
- Camera: arrow buttons and their styles removed; drag and keyboard arrows remain.
- Analysis: added a working together paragraph, then the calendar, then the four step path. Hero button now jumps to the calendar.
- Consultancy: new page composition with its own hero and workshop board chart, typical questions, workshop format with an included list, calendar in the middle of the page, outcomes and Papp Insights link. Uses its own styles in refinements.scss.
- New styles live in src/styles/refinements.scss, loaded after glass-surfaces.scss.
- Checks: TypeScript and ESLint passed. Local Next build and Vitest could not run in the review sandbox; the Pages workflow build and a live browser check follow the push.

## Follow up fixes, 24 September 2026
- Capability line: the phrase window now has a single track as wide as the window, so shorter phrases are centred and fully visible (earlier they sat in a track as wide as the longest phrase, shifted right and clipped). Width rounds up with 2px spare.
- Hero actions lifted off the bottom edge (8svh).
- Homepage preview tabs form a 2 x 2 grid below 768px.
- Insights explorer: a dropdown replaces the seven buttons on phones. Forecast replay now tracks the day closely (mean miss about 1.4 vehicles, about 90% of the day inside the band) and states its average miss.
- Meeting calendar: removed the Denmark time note. Requests can be sent through Web3Forms once an access key is set in src/config/meeting.ts or NEXT_PUBLIC_WEB3FORMS_KEY; until then the email app handoff remains.
- Second follow up: capability phrases rewritten as things Papp measures (traffic counts, people counts, parking occupancy, parking forecasts, dwell times, visitor origins, postcode data, fleet profiles, charging demand, traffic patterns; Danish equivalents). Insights phone picker is a custom listbox instead of a native select. Forecast shows observed data only until 14:00 and a range that widens with the forecast horizon. Removed "example" labels from data views. Martine's calendar added near the end of the Insights page; its hero button jumps there.
