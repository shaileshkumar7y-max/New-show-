# QA Checklist — BLACKED Show Update

## Automated local checks
- [x] `node --check app.js` passes.
- [x] `node smoke-test.cjs` passes.
- [x] All 23 game IDs launch and complete a round in the local runtime smoke test.
- [x] Score totals and completed-round history persist in local storage.
- [x] House, Games, Task Arena, Ranks, Spin, BLACKED Fashion and Profile views render.
- [x] Housemate add, custom challenge save, comfort-level save and favourites work.
- [x] Pause/resume, safe skip, Secret Joker, wheel spin and off-camera exit work.
- [x] Local CSS, JS, icon, manifest, service worker and campaign image paths exist.
- [x] ZIP integrity check passes.

## Deployment checks still required
- [ ] Confirm GitHub Pages has published the new main-branch files.
- [ ] Run the page on a physical Android phone after deployment.
- [ ] Confirm the service worker refreshes the previous cache and the campaign image loads over GitHub Pages.
- [ ] Re-test the age/consent gate, a complete round, skip, pause/resume and reload persistence on the published URL.

The 18+ entry check is self-attestation, not verified age assurance. All challenges are optional and must stop immediately when any player says stop.
