# Ionic Admin: styling diagnostics and deployment

This note matches the internal diagnostic plan for why Ionic can look unstyled or why custom CSS seems ignored.

## 1. Network verification (automated)

Run a production build and HTTP checks for `styles.css`, main bundles, and a sample Ionic lazy chunk:

```bash
npm run verify:assets
```

This runs `ng build` then serves `www/` locally and asserts HTTP 200 for each asset. To skip the build (reuse existing `www/`):

```bash
SKIP_BUILD=1 npm run verify:assets
```

For production, repeat the same checks in DevTools → Network against the deployed origin (all listed scripts/styles should be 200; failed lazy chunks break component-internal CSS).

## 2. Base href and Firebase hosting

- **Root deploy** (e.g. `https://admin.example.com/`): keep `<base href="/" />` in `src/index.html`, `baseHref: "/"` in `angular.json`, and build with default base.
- **Subpath deploy** (e.g. `https://example.com/admin/`): set `ng build --base-href /admin/` (or matching `baseHref` in `angular.json`), and ensure `index.html` base matches. Relative chunk URLs will break if base and hosting path disagree (404 on `*.js` → missing Ionic component styles).

`firebase.json` in this folder uses a SPA rewrite (`**` → `/index.html`) like the customer app. Copy `.firebaserc.example` to `.firebaserc` and set your Firebase project before `firebase deploy`.

## 3. Styling approach (Shadow DOM)

- Prefer **CSS custom properties on the host** (`ion-input`, `ion-segment`, `ion-select`, etc.) per [Ionic component docs](https://ionicframework.com/docs/components).
- Use **`::part(...)`** only where documented (e.g. segment indicator, select icon).
- Avoid targeting internal shadow classes (`sc-ion-*`); they are not stable APIs.

Shared underline tabs for `.users-tabs` / `.admin-tabs-filter` live in `src/global.scss` so feature pages do not duplicate segment rules.

## 4. Global CSS parity (granular vs bundle)

The `styles` array in `angular.json` follows the usual Ionic Angular **granular** set: `core`, `normalize`, `structure`, `typography`, `display`, `padding`, `float-elements`, `text-alignment`, `text-transformation`, `flex-utils`, then `src/global.scss`.

Optional A/B test: run a production build using the single-file Ionic bundle instead of granular CSS:

```bash
npm run build:bundle-css-parity
```

This uses the `bundleCssParity` configuration in `angular.json` (see [Ionic Angular styles](https://ionicframework.com/docs/angular/styles)). Tradeoff: larger CSS download vs fewer CSS requests. Compare UI in `www/` against a normal `ng build` if styles look missing or different.

Other packaged files (not required for this app): `utils.bundle.css`, `global.bundle.css`, dark/high-contrast palettes under `palettes/` — add only if you adopt those modes.

## 5. Architecture note (NgModule vs standalone)

The app bootstraps with `AppModule` and lazy feature `NgModule`s, while some route components are **standalone** and import `@ionic/angular/standalone`. That mix is valid in modern Angular. Prefer **one pattern per new feature** for consistency: either a lazy module with `IonicModule` or a standalone page importing only the Ionic pieces it needs.
