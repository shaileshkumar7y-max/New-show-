# BLACKED Show Update — Phone se upload karne ka tarika

Ye ZIP **existing** `Vikas915577/Couple-game-` repository ke liye update package hai. Is ZIP ko kisi naye blank repository mein upload mat karna.

## Android phone se

1. ZIP download karke Files app mein **Extract** karo.
2. Extracted folder ke andar `index.html`, `classic.html`, `manifest.json`, `icon.svg`, `sw.js` aur docs milenge.
3. GitHub par `Vikas915577/Couple-game-` repository kholo aur `main` branch select karo.
4. Repository ke root (top-level) mein jao. Extracted files ko root mein upload/replace karo. GitHub par ZIP ko as-is upload karne se website update nahi hoti; ZIP pehle extract karna zaroori hai.
5. Existing `app.js` aur `styles.css` ko **delete ya replace mat karna**. `classic.html` in dono files se purana YaarJam Arcade kholta hai.
6. Changes commit karo. GitHub Pages agar `main` branch / root se publish hota hai, toh deployment complete hone ke baad website kholo.
7. Pehle incognito/private tab mein test karo. Purana page ya design dikhe toh site data/cache clear karke reload karo; service worker update hone ke liye ek extra reload lag sakta hai.

## ZIP ke andar kya hai

- `index.html` — naya BLACKED show home + 20 playable modes.
- `classic.html` — purana YaarJam interface alag page par preserve.
- `manifest.json`, `icon.svg`, `sw.js` — PWA title/icon/offline cache update.
- `RELEASE_NOTES.md`, `QA_CHECKLIST.md` — release notes aur test status.
- `smoke-test.cjs` — basic local smoke test (Node.js environment ke liye).

## Important

- Ye frontend-only/local-first release hai. Multiplayer cross-device sync, remote leaderboard, product checkout ya admin analytics add nahi kiye gaye.
- 18+ screen self-attestation hai, verified identity/age-check service nahi.
- Names, scores, favourite prompts aur history browser ke local storage mein rehte hain. Browser data clear karne se pehle Profile se backup export karo.
