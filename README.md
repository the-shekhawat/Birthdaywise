# 🎂 Happy Birthday Website — React + Tailwind CSS

A single-page, scrollable birthday experience: loading screen → landing page
→ curtain-opening intro → a long story made of interactive sections (hero,
countdown, timeline, letter, flip-card reasons, photo gallery, blow-out-the-
candles cake, gift boxes, quiz, scratch card, balloon pop, secret password,
guest wish wall, love meter, and a fireworks finale).

## 1. Install & run

You need [Node.js](https://nodejs.org) 18+ installed. Then, inside this
`client` folder:

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build a production version:

```bash
npm run build     # outputs to /dist
npm run preview   # preview the production build locally
```

Deploy the `dist` folder to any static host (Vercel, Netlify, GitHub Pages,
Cloudflare Pages, etc).

## 2. Make it about your person

Everything you'll actually want to change lives in **`src/config.js`**:

- `personName`, `age`, `birthdayDate`, `tagline`
- `letter` — the full birthday letter text
- `timeline` — the "our story" milestones
- `reasons` — the flip-card list of reasons
- `quiz`, `gifts`, `scratchCard`, `secretPassword`, `wishWallSeed`
- `musicSrc` — set to `/song.mp3` (place the file in `public/`) to enable the
  background-music toggle button. Leave `null` to hide it.

## 3. Add real photos

`src/components/Hero.jsx` and `src/components/Gallery.jsx` currently use
emoji placeholders so the site works instantly with zero setup. To use real
photos:

1. Drop image files into `public/photos/`.
2. In `Gallery.jsx`, replace an entry's `emoji` with
   `src: '/photos/your-file.jpg'`, and swap the emoji `<div>` for an
   `<img src={p.src} className="h-24 w-full object-cover sm:h-32" />`.
3. Do the same in `Hero.jsx` for the hero photo.

## 4. Persisting the Wish Wall

The guest **Wish Wall** currently stores messages only in memory (they reset
on refresh), since a static React app has no database. To make wishes
permanent, connect any small backend — a good beginner-friendly option is
[Firebase Firestore](https://firebase.google.com/docs/firestore) or a
[Supabase](https://supabase.com) table — and swap the `useState` in
`WishWall.jsx` for reads/writes against it.

## 5. Project structure

```
client/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── public/
│   └── cake.svg
└── src/
    ├── main.jsx
    ├── App.jsx           # orchestrates loader → landing → transition → sections
    ├── index.css         # Tailwind directives + a few base styles
    ├── config.js         # <- edit this to personalize the whole site
    └── components/
        ├── StarsBackground.jsx
        ├── CursorTrail.jsx
        ├── Loader.jsx
        ├── Landing.jsx
        ├── WelcomeTransition.jsx
        ├── MusicToggle.jsx
        ├── SectionHeading.jsx
        ├── Hero.jsx
        ├── Countdown.jsx
        ├── Timeline.jsx
        ├── Letter.jsx
        ├── Reasons.jsx
        ├── Gallery.jsx
        ├── Cake.jsx
        ├── GiftBoxes.jsx
        ├── Quiz.jsx
        ├── ScratchCard.jsx
        ├── BalloonPop.jsx
        ├── SecretUnlock.jsx
        ├── WishWall.jsx
        ├── LoveMeter.jsx
        └── Finale.jsx
```

## 6. Design notes

The visual direction is a warm "midnight celebration": a deep indigo night
sky (`night-*` colors) with twinkling stars, gold candle-light accents
(`gold-*`), and a soft rose glow (`rose-*`) — paired with Playfair Display
for headings, Quicksand for body text, and Caveat as a handwritten accent for
the letter and notes. All of this lives in `tailwind.config.js` if you want
to shift the palette.
