# Release QA checklist

## Automated checks run in this workspace
- JavaScript syntax check: **PASS** (`node --check` on the extracted inline script).
- Runtime smoke test: **PASS** (18+ gate acknowledgement, house rendering, all 20 game modes start and complete, points/history persistence, profile rendering, and spin-wheel result).
- PWA asset-path review: **PASS** for the files included in this update. `manifest.json` points to root `icon.svg`; service-worker cache list includes the new show files and the existing Classic Arcade files.
- Full visual/browser/device test: **NOT RUN** in a real Android browser in this workspace.

## Manual checks after deployment
1. Open the page in an incognito/private tab. Confirm the entry button stays disabled until both age and consent acknowledgements are checked.
2. Enter the house; check the hero, five mobile navigation tabs, twenty game cards and BLACKED wardrobe.
3. Start all twenty modes; verify prompt, Complete, Skip, Pause, Favourite, Off-camera Choice and Stop actions.
4. Complete and skip rounds; verify points, counters and leaderboard update.
5. Spin the wheel from the Spin page; check each comfort level.
6. Add/remove housemates, add/remove a custom challenge, export/import backup and reset progress.
7. Open Classic Arcade; confirm it loads using the preserved `app.js` and `styles.css` and existing YaarJam saves remain separate.
8. Install/open as a PWA, reload once online to update the service worker, then test the cached app shell offline.

## Boundaries and release limitations
- Local-first only: cross-device rooms, shared live leaderboard, remote profiles, product checkout and central admin analytics need a separate backend and privacy design.
- The browser's 18+ gate is an acknowledgement, not verified age assurance.
- Adult-mode prompts are non-graphic; the app does not instruct, record or require sexual activity. Each challenge can be skipped, paused or stopped.
