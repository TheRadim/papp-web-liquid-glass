Homepage map geometry is a cropped, projected derivative of Natural Earth's public-domain 1:110m Admin 0 Countries dataset:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Fetched 23 September 2026. Country geometry is geographic; coloured visit shares are illustrative demo values in dashboard-demo.ts, not observed traffic. The view is centred on Scandinavia and neighbouring countries. No external map service is used at runtime.

Insights page catchment map (`public/data/dk-municipalities.json`): municipality borders from DAGI, Styrelsen for Dataforsyning og Infrastruktur (1:500 000, via the ok-dk/dagi GeoJSON export), simplified. Visit numbers in `municipality-origins.ts` are illustrative demo values.

Homepage hero map (`public/data/denmark-traffic.json`): Denmark outline and roads from Natural Earth 10m (public domain), projected and simplified; local links join postal-area centres (DAGI).
