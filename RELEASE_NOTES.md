# Release 2.0 — Visual and functional rebuild

## Implemented
- Rebuilt the main homepage around the supplied BLACKED campaign artwork with a responsive two-column hero and compact mobile layout.
- Rebuilt House, Games, Spin, Task Arena, Ranks, BLACKED Fashion Zone and Profile views.
- Split the previous embedded application into `app.js` and `styles.css` for easier maintenance.
- Added Task Arena, Confession Room and Date Night Generator as real prompt-backed game modes (23 total).
- Reworked the game overlay, prompt cards, scoring controls, wheel animation, contestant rows and local leaderboard.
- Fixed the broken `classic.html` route, which previously pointed to missing `app.js` / `styles.css` assets.
- Updated the PWA manifest, icon and offline cache list, including the campaign image.

## Preserved
- Existing age and consent acknowledgements.
- Original 20 prompt-backed game modes, scores, history, favourites, custom prompt storage, housemates and backup import/export.
- Existing local-first data key, so browser progress from the earlier show page remains readable.

## Validation
- `node --check app.js`
- `node smoke-test.cjs`
- Asset references and service-worker cache list reviewed.
- Real-device Android/browser deployment testing must still be completed after GitHub Pages publishes the commit.
