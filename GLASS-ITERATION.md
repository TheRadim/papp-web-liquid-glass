# Parallel glass iteration

Original: https://theradim.github.io/papp-web/en/
Experiment: https://theradim.github.io/papp-web-liquid-glass/en/

This repository is an independent copy of papp-web. Its own main branch deploys only to papp-web-liquid-glass. It has no remote pointing to the original repository. Preview pages request no search indexing.

Run `npm ci` and `npm run dev -- --port 3001` for a separate local preview. Run `npm run pages:build` for this repository's static base path.

Navigation uses @ybouane/liquidglass 1.0.3 (MIT), https://github.com/ybouane/liquidglass, plus native CSS backdrop blur. The shader settings live in GlassSurface.tsx. The empty decorative layer avoids capturing interactive page content; navigation remains normal accessible HTML. patch-package is included because upstream's published install script requires it.

See design-qa.md for visual checks and limitations.
