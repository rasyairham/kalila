import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ==========================================================================
   DATA & KONFIGURASI
   ========================================================================== */
const AUDIO_SRC = "/music/kereta_kencan_hivi.mp3";
const SONG_TITLE = "Kereta Kencan";
const SONG_ARTIST = "HiVi";

const INTRO_MS = 10000; // durasi mutlak halaman 1
const INTRO_FADE_MS = 800; // fade-out terjadi di 800ms terakhir

// Letakkan video lokal di public/videos/saat-menjadi-kita.mp4
const VIDEO_SRC = "../../public/videos/saat-menjadi-kita.mp4";
const VIDEO_POSTER = "";

// Placeholder Unsplash. Ganti dengan foto kalian sendiri (mis. "/photos/kencan-1.jpg").
const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTO = {
  m1a: unsplash("photo-1529333166437-7750a6dd5a70"),
  m1b: unsplash("photo-1518199266791-5375a83190b7"),
  m2a: unsplash("photo-1516589178581-6cd7833ae3b2"),
  m2b: unsplash("photo-1522673607200-164d1b6ce486"),
  m4a: unsplash("photo-1519741497674-611481863552"),
  m4b: unsplash("photo-1465495976277-4387d4b0b4c6"),
  m4c: unsplash("photo-1494774157365-9e04c6720e47"),
  m5a: unsplash("photo-1474552226712-ac0f0961a954", 1000),
  m5b: unsplash("photo-1511988617509-a57c8a288659"),
  m5c: unsplash("photo-1501901609772-df0848060b33"),
  m5d: unsplash("photo-1523438885200-e635ba2c371e"),
  m5e: unsplash("photo-1469371670807-013ccf25f16a", 600),
};

const MOMENTS = [
  {
    id: 1,
    tab: "Awal Cerita",
    date: "Awal cerita",
    title: "Hari yang sangat canggung",
    story:
      "Hanya obrolan sederhana, tapi terasa seperti suatu hal yang membuat hari demi hari terasa lebih indah. Dari sana, hari-hari kita mulai terasa lebih indah dari sebelumnya.",
  },
  {
    id: 2,
    tab: "First Date",
    date: "5 Oktober 2024",
    title: "First Date",
    story:
      "Hari itu terasa sangat canggung, rasanya seperti sedang interview kerja karna hadap hadapan. Tapi, dari situ kita lebih sering bersama.",
  },
  {
    id: 3,
    tab: "Saat Menjadi Kita",
    date: "Hari yang kita ingat",
    title: "Saat Menjadi Kita",
    story:
      "Tidak ada yang terlalu besar atau terlalu sempurna. Yang ada hanyalah rasa yang mulai terasa akrab dan tenang. Dan dari situlah semuanya jadi lebih nyata.",
  },
  {
    id: 4,
    tab: "Tahun Pertama",
    date: "Tahun pertama",
    title: "Hari-hari yang terasa lebih ringan",
    story:
      "Kami tidak memerlukan rencana yang rumit. Yang penting adalah ada waktu, ada tawa, dan ada rasa tenang saat kami berada di sana bersama.",
  },
  {
    id: 5,
    tab: "Hari Ini",
    date: "Hari ini",
    title: "Dua tahun dan masih menyenangkan",
    story:
      "Dua tahun bukan tentang angka yang besar, melainkan tentang bagaimana hari-hari terasa lebih tenang, lebih indah, dan lebih berarti karena ada kamu di dalamnya.",
  },
];

/* ==========================================================================
   TEKSTUR (data-URI SVG, tanpa file gambar)
   ========================================================================== */
// kertas craft putih terang
const CRAFT_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .42 0 0 0 0 .36 0 0 0 0 .28 .55 0 0 0 -.17'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const CRAFT_FIBER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012 .07' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .44 0 0 0 0 .34 0 .6 0 0 -.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")";
const CHALK_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .9 0 0 0 -.36'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E\")";
// bintang-bintang kecil untuk halaman navy
const STAR_DOTS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cg fill='white'%3E%3Ccircle cx='20' cy='30' r='1.1' fill-opacity='.7'/%3E%3Ccircle cx='90' cy='12' r='.8' fill-opacity='.5'/%3E%3Ccircle cx='160' cy='48' r='1.3' fill-opacity='.65'/%3E%3Ccircle cx='200' cy='120' r='.9' fill-opacity='.5'/%3E%3Ccircle cx='60' cy='110' r='1' fill-opacity='.55'/%3E%3Ccircle cx='130' cy='160' r='1.2' fill-opacity='.6'/%3E%3Ccircle cx='30' cy='190' r='.8' fill-opacity='.45'/%3E%3Ccircle cx='180' cy='200' r='1' fill-opacity='.55'/%3E%3C/g%3E%3C/svg%3E\")";
// alas meja bermotif (beige + bunga teal) seperti pada referensi
const TABLE_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect width='72' height='72' fill='%23d9c7a6'/%3E%3Cg fill='%2352b4c6' fill-opacity='.8'%3E%3Ccircle cx='18' cy='12' r='5'/%3E%3Ccircle cx='18' cy='24' r='5'/%3E%3Ccircle cx='12' cy='18' r='5'/%3E%3Ccircle cx='24' cy='18' r='5'/%3E%3Ccircle cx='54' cy='48' r='5'/%3E%3Ccircle cx='54' cy='60' r='5'/%3E%3Ccircle cx='48' cy='54' r='5'/%3E%3Ccircle cx='60' cy='54' r='5'/%3E%3C/g%3E%3Cg fill='%23d9c7a6'%3E%3Ccircle cx='18' cy='18' r='2.4'/%3E%3Ccircle cx='54' cy='54' r='2.4'/%3E%3C/g%3E%3C/svg%3E\")";

/* ==========================================================================
   STYLE GLOBAL — font, keyframes (kupu-kupu, lilin, flip 3D), tekstur kertas
   ========================================================================== */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Sacramento&family=Permanent+Marker&display=swap');

      html, body { margin: 0; padding: 0; display: block; min-height: 100%; background: #0d0a10; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
      #root { max-width: none !important; width: 100%; margin: 0 !important; padding: 0 !important; border: 0 !important; text-align: initial !important; }
      * { box-sizing: border-box; }
      button { font: inherit; }
      .font-hand { font-family: 'Caveat', 'Segoe Print', cursive; }
      .font-script { font-family: 'Sacramento', 'Caveat', cursive; }
      .font-display { font-family: 'Sacramento', 'Caveat', cursive; }
      .font-marker { font-family: 'Permanent Marker', 'Caveat', cursive; }

      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
      .anim-fade-in { animation: fadeIn 1.1s ease both; }

      /* ================= INTRO: LATAR ================= */
      .intro-grain { background-image: ${CHALK_NOISE}; opacity: .09; mix-blend-mode: screen; }
      .intro-vignette { background: radial-gradient(120% 90% at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,.62) 100%); }

      /* ================= INTRO: LILIN ================= */
      .candle-wrap {
        position: relative; height: min(62dvh, 560px); aspect-ratio: 300 / 480;
        transform-origin: 50% 100%; animation: candleSway 7s ease-in-out infinite;
      }
      @keyframes candleSway { 0%, 100% { transform: rotate(-.7deg); } 50% { transform: rotate(.7deg); } }
      .candle-wrap svg.candle-art { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

      .flame-anchor { position: absolute; left: 50%; top: 26%; width: 0; height: 0; }
      .glow {
        position: absolute; left: 0; top: 0; width: min(130vw, 130vh); aspect-ratio: 1; border-radius: 50%;
        transform: translate(-50%, -50%); pointer-events: none;
        background: radial-gradient(circle, rgba(255,176,70,.5) 0%, rgba(255,120,50,.2) 26%, rgba(255,90,60,.06) 46%, transparent 62%);
        animation: glowPulse 3.1s ease-in-out infinite;
      }
      .glow-front {
        width: min(46vw, 46vh); mix-blend-mode: screen; opacity: .6;
        background: radial-gradient(circle, rgba(255,200,110,.6) 0%, rgba(255,150,60,.2) 40%, transparent 68%);
        animation-duration: 2.3s;
      }
      @keyframes glowPulse {
        0%, 100% { opacity: .82; transform: translate(-50%, -50%) scale(.97); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.04); }
      }
      .flame {
        position: absolute; left: 39%; width: 22%; aspect-ratio: 80 / 140; bottom: calc(100% - 28.4%);
        transform-origin: 50% 92%; animation: flameSway 2.7s ease-in-out infinite; will-change: transform;
      }
      .flame-in { width: 100%; height: 100%; transform-origin: 50% 100%; animation: flameFlicker .38s ease-in-out infinite alternate; }
      .flame svg { display: block; width: 100%; height: 100%; overflow: visible; }
      @keyframes flameSway {
        0%, 100% { transform: rotate(-3deg) skewX(-2deg); }
        35% { transform: rotate(2.6deg) skewX(2deg); }
        65% { transform: rotate(-1.6deg) skewX(-1deg); }
      }
      @keyframes flameFlicker { 0% { transform: scale(1, 1); } 100% { transform: scale(.95, 1.08); } }

      .mote {
        position: absolute; left: 0; top: 0; width: 4px; height: 4px; border-radius: 50%; background: #ffd9a0;
        box-shadow: 0 0 8px 2px rgba(255,170,70,.7); opacity: 0;
        animation: moteRise var(--d, 5s) ease-out infinite; animation-delay: var(--dl, 0s);
      }
      @keyframes moteRise {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        12% { opacity: .95; }
        100% { transform: translate(var(--dx, 0px), -38vh) scale(.25); opacity: 0; }
      }

      /* ================= INTRO: KUPU-KUPU ================= */
      .fly {
        position: absolute; left: 0; top: 0; will-change: transform;
        animation-duration: var(--dur, 10s); animation-delay: var(--delay, 0s);
        animation-timing-function: cubic-bezier(.37, 0, .63, 1);
        animation-iteration-count: infinite; animation-fill-mode: both;
      }
      .fly-a { animation-name: flyA; } .fly-b { animation-name: flyB; } .fly-c { animation-name: flyC; }
      .fly-d { animation-name: flyD; } .fly-e { animation-name: flyE; }

      @keyframes flyA {
        0% { transform: translate(-18vw, 72vh) rotate(55deg); }
        20% { transform: translate(14vw, 50vh) rotate(25deg); }
        40% { transform: translate(36vw, 60vh) rotate(80deg); }
        60% { transform: translate(60vw, 32vh) rotate(35deg); }
        80% { transform: translate(84vw, 40vh) rotate(75deg); }
        100% { transform: translate(118vw, 14vh) rotate(50deg); }
      }
      @keyframes flyB {
        0% { transform: translate(116vw, 18vh) rotate(-60deg); }
        25% { transform: translate(84vw, 34vh) rotate(-95deg); }
        50% { transform: translate(52vw, 22vh) rotate(-40deg); }
        75% { transform: translate(24vw, 52vh) rotate(-100deg); }
        100% { transform: translate(-20vw, 66vh) rotate(-70deg); }
      }
      @keyframes flyC {
        0% { transform: translate(22vw, 112vh) rotate(-5deg); }
        30% { transform: translate(30vw, 70vh) rotate(25deg); }
        55% { transform: translate(18vw, 44vh) rotate(-30deg); }
        80% { transform: translate(34vw, 18vh) rotate(20deg); }
        100% { transform: translate(28vw, -14vh) rotate(0deg); }
      }
      @keyframes flyD {
        0% { transform: translate(78vw, -14vh) rotate(180deg); }
        30% { transform: translate(70vw, 26vh) rotate(150deg); }
        60% { transform: translate(84vw, 52vh) rotate(205deg); }
        100% { transform: translate(72vw, 112vh) rotate(170deg); }
      }
      @keyframes flyE {
        0% { transform: translate(calc(50vw - 40vmin), 50vh) rotate(0deg); }
        25% { transform: translate(50vw, calc(50vh - 34vmin)) rotate(90deg); }
        50% { transform: translate(calc(50vw + 40vmin), 50vh) rotate(180deg); }
        75% { transform: translate(50vw, calc(50vh + 30vmin)) rotate(270deg); }
        100% { transform: translate(calc(50vw - 40vmin), 50vh) rotate(360deg); }
      }

      .bf { position: relative; width: 100%; aspect-ratio: 1 / .9; perspective: 320px; }
      .bf-wing { position: absolute; top: 0; width: 50%; height: 100%; will-change: transform; }
      .bf-wing svg { display: block; width: 100%; height: 100%; overflow: visible; }
      .bf-wing-l { left: 0; transform-origin: 100% 50%; animation: flapL var(--flap, .42s) ease-in-out infinite; }
      .bf-wing-l svg { transform: scaleX(-1); }
      .bf-wing-r { right: 0; transform-origin: 0% 50%; animation: flapR var(--flap, .42s) ease-in-out infinite; }
      .bf-body { position: absolute; left: 50%; top: -6%; height: 104%; width: 18%; transform: translateX(-50%); }
      .bf-body svg { display: block; width: 100%; height: 100%; overflow: visible; }
      @keyframes flapL { 0%, 100% { transform: rotateY(4deg); } 50% { transform: rotateY(72deg); } }
      @keyframes flapR { 0%, 100% { transform: rotateY(-4deg); } 50% { transform: rotateY(-72deg); } }

      .intro-line { animation: introLine 10s linear forwards; }
      @keyframes introLine {
        0%, 20% { opacity: 0; transform: translateY(8px); }
        30%, 78% { opacity: 1; transform: none; }
        90%, 100% { opacity: 0; transform: none; }
      }
      .intro-progress { transform-origin: 0 50%; animation: introProgress ${INTRO_MS}ms linear forwards; }
      @keyframes introProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .hint-pulse { animation: hintPulse 2.4s ease-in-out infinite; }
      @keyframes hintPulse { 0%, 100% { opacity: .45; } 50% { opacity: .95; } }

      /* ================= BUKU: LATAR & UKURAN ================= */
      /* rasio halaman 0.68 (25.16em x 37em) untuk mode dua halaman maupun satu halaman */
      .stage-spread {
        --ph: min(78dvh, calc(46vw / .68)); --pw: calc(var(--ph) * .68);
      }
      .stage-single {
        --pw: min(90vw, calc(70dvh * .68)); --ph: calc(var(--pw) / .68);
      }
      .stage { --u: calc(var(--ph) / 37); }

      .book-shift { position: relative; transition: transform .95s cubic-bezier(.45, .05, .2, 1); }
      .book { position: relative; height: var(--ph); perspective: 2600px; }
      .stage-spread .book { width: calc(var(--pw) * 2); }
      .stage-single .book { width: var(--pw); }

      .leaf {
        position: absolute; top: 0; width: var(--pw); height: var(--ph);
        transform-origin: left center; transform-style: preserve-3d;
        transition: transform .95s cubic-bezier(.45, .05, .2, 1), z-index 0s linear .47s, visibility 0s linear 0s;
      }
      .stage-spread .leaf { left: 50%; }
      .stage-single .leaf { left: 0; }
      .leaf.is-dragging { transition: none; visibility: visible !important; }
      .stage-single .leaf.is-flipped {
        visibility: hidden;
        transition: transform .95s cubic-bezier(.45, .05, .2, 1), z-index 0s linear .47s, visibility 0s linear .95s;
      }
      .stage-single .leaf.is-flipped.is-dragging { visibility: visible; }

      .face {
        position: absolute; inset: 0; overflow: hidden; font-size: var(--u);
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
      }
      .face.back { transform: rotateY(180deg); }

      /* sisi terang: kertas craft putih */
      .paper {
        background-color: #f7f3ea;
        background-image:
          ${CRAFT_FIBER}, ${CRAFT_NOISE},
          radial-gradient(120% 90% at 50% 35%, rgba(255,255,255,.7), rgba(255,255,255,0) 62%),
          radial-gradient(140% 120% at 50% 50%, rgba(0,0,0,0) 62%, rgba(120,95,60,.2) 100%);
      }
      /* sisi gelap: navy pekat berbintang */
      .navy {
        background-color: #0e1a31;
        background-image:
          ${STAR_DOTS},
          ${CHALK_NOISE},
          radial-gradient(100% 60% at 30% 0%, rgba(48,92,160,.4), rgba(48,92,160,0) 65%),
          radial-gradient(140% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.5) 100%);
        background-blend-mode: normal, soft-light, normal, normal;
      }
      .cloth {
        background-color: #5b2133;
        background-image:
          ${CHALK_NOISE},
          repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 .12em, transparent .12em .24em),
          repeating-linear-gradient(-45deg, rgba(0,0,0,.14) 0 .12em, transparent .12em .24em),
          radial-gradient(120% 100% at 50% 30%, rgba(255,170,190,.16), transparent 60%),
          radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,.42) 100%);
      }
      .cloth::before { content: ""; position: absolute; inset: 0; background: ${CHALK_NOISE}; opacity: .05; mix-blend-mode: overlay; pointer-events: none; }

      .gutter { position: absolute; top: 0; bottom: 0; width: 14%; pointer-events: none; }
      .gutter-r { left: 0; background: linear-gradient(to right, rgba(60,35,10,.38), rgba(60,35,10,.12) 42%, transparent); }
      .gutter-l { right: 0; background: linear-gradient(to left, rgba(60,35,10,.38), rgba(60,35,10,.12) 42%, transparent); }
      .navy .gutter-r { background: linear-gradient(to right, rgba(0,0,0,.6), rgba(0,0,0,.18) 42%, transparent); }
      .navy .gutter-l { background: linear-gradient(to left, rgba(0,0,0,.6), rgba(0,0,0,.18) 42%, transparent); }

      .page-no { position: absolute; left: 0; right: 0; bottom: .9em; text-align: center; font-family: 'Caveat', cursive; font-size: 1.15em; color: rgba(58,42,34,.45); pointer-events: none; }
      .navy .page-no { color: rgba(255,255,255,.4); }

      /* bayangan saat halaman membalik */
      .shade { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .95s ease; }
      .face.front .shade { background: linear-gradient(to right, rgba(10,4,0,.7), rgba(10,4,0,.08)); }
      .face.back .shade { background: linear-gradient(to left, rgba(10,4,0,.7), rgba(10,4,0,.08)); }
      .leaf.is-flipped .face.front .shade { opacity: .6; }
      .leaf:not(.is-flipped) .face.back .shade { opacity: .6; }
      .leaf.is-dragging .face.front .shade { opacity: calc(var(--p, 0) * .6); transition: none; }
      .leaf.is-dragging .face.back .shade { opacity: calc((1 - var(--p, 0)) * .6); transition: none; }

      .book-shadow { position: absolute; bottom: -2.6%; height: 7%; filter: blur(10px); background: radial-gradient(ellipse at center, rgba(40,25,10,.6), transparent 70%); transition: opacity .6s ease; pointer-events: none; }
      .stage-spread .book-shadow-l { left: 0; width: 50%; }
      .stage-spread .book-shadow-r { left: 50%; width: 50%; }
      .stage-single .book-shadow-r { left: 0; width: 100%; }
      .stage-single .book-shadow-l { display: none; }

      /* pojok kertas (klik untuk membalik) */
      .dogear { position: absolute; bottom: 0; width: 3.6em; height: 3.6em; padding: 0; border: 0; cursor: pointer; z-index: 6; transition: width .3s ease, height .3s ease; filter: drop-shadow(0 0 .25em rgba(60,35,10,.4)); }
      .dogear:hover, .dogear:focus-visible { width: 5em; height: 5em; outline: none; }
      .dogear-br { right: 0; background: linear-gradient(135deg, transparent 50%, #b9a889 50%, #f1eadb 64%, #d9cfb8 100%); }
      .dogear-bl { left: 0; background: linear-gradient(225deg, transparent 50%, #b9a889 50%, #f1eadb 64%, #d9cfb8 100%); }
      .navy .dogear-br { background: linear-gradient(135deg, transparent 50%, #23345a 50%, #6a7fae 64%, #3f5382 100%); }
      .navy .dogear-bl { background: linear-gradient(225deg, transparent 50%, #23345a 50%, #6a7fae 64%, #3f5382 100%); }

      /* ================= DEKORASI SCRAPBOOK ================= */
      .tape {
        position: absolute; width: 6.5em; height: 1.9em; opacity: .9; z-index: 4; pointer-events: none;
        background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.3) 0 .5em, transparent .5em 1em);
        clip-path: polygon(0 0, 3% 12%, 0 25%, 3% 38%, 0 50%, 3% 62%, 0 75%, 3% 88%, 0 100%, 100% 100%, 97% 88%, 100% 75%, 97% 62%, 100% 50%, 97% 38%, 100% 25%, 97% 12%, 100% 0);
      }
      .tape-rose { background-color: #e48aa5; }
      .tape-teal { background-color: #6fb7b1; }
      .tape-sage { background-color: #9bb58a; }
      .tape-clear { background-color: rgba(255,255,255,.55); background-image: none; }
      .tape-mustard { background-color: #e5b84e; background-image: radial-gradient(rgba(255,255,255,.55) .15em, transparent .16em); background-size: .9em .9em; }

      /* teks tulisan tangan dengan sorot putih per baris (seperti referensi) */
      .strip {
        background: #fff; color: #17120f; font-weight: 600; line-height: 1.75;
        padding: .08em .4em; box-decoration-break: clone; -webkit-box-decoration-break: clone;
      }

      /* bingkai foto: bayangan tipis agar terlihat menempel di kertas */
      .print-shadow { box-shadow: 0 .12em .35em rgba(20,12,4,.35), 0 .02em .06em rgba(20,12,4,.45); }

      .anim-nudge { animation: nudge 2.4s ease-in-out infinite; }
      @keyframes nudge { 0%, 100% { transform: translateY(0); opacity: .75; } 50% { transform: translateY(-.25em); opacity: 1; } }
      .anim-book-in { animation: fadeIn 1.2s ease both; }

      /* slider lagu */
      .seek {
        -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 9999px; outline: none; cursor: pointer;
        background: linear-gradient(to right, #fb7185 var(--p, 0%), rgba(255,255,255,.16) var(--p, 0%));
      }
      .seek:disabled { cursor: default; opacity: .6; }
      .seek::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; border: 0; background: #ffe4e6; box-shadow: 0 0 0 4px rgba(251,113,133,.22); }
      .seek::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; border: 0; background: #ffe4e6; box-shadow: 0 0 0 4px rgba(251,113,133,.22); }
      .seek:focus-visible { box-shadow: 0 0 0 3px rgba(251,113,133,.45); }
      .vinyl-spin { animation: vinylSpin 5s linear infinite; }
      @keyframes vinylSpin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .fly { animation-duration: 40s !important; }
        .bf-wing { animation-duration: 1.4s !important; }
        .leaf, .book-shift { transition-duration: .01ms !important; }
        .candle-wrap, .anim-nudge, .hint-pulse { animation: none !important; }
      }
    `}</style>
  );
}

/* ==========================================================================
   FILTER SVG "HAND-DRAWN" (dipakai semua ilustrasi lewat url(#rough) / url(#wash))
   ========================================================================== */
function SketchDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        {/* garis tinta yang sedikit bergetar seperti digambar tangan */}
        <filter id="rough" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* warna pensil/cat air: tepi bergelombang + butiran kertas */}
        <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -.45" result="ga" />
          <feComposite in="d" in2="ga" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/* ==========================================================================
   DOODLE KECIL (sketsa tangan)
   ========================================================================== */
const HeartDoodle = ({ className = "", color = "#d9567a" }) => (
  <svg viewBox="0 0 100 90" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 84 C18 60 8 38 18 22 C28 8 46 12 50 28 C54 12 74 8 84 24 C94 40 80 62 50 84 Z" fill={color} fillOpacity=".22" />
      <path d="M26 24 C30 18 38 18 42 24" strokeWidth="2" opacity=".7" />
    </g>
  </svg>
);

const SparkleDoodle = ({ className = "", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path
      filter="url(#rough)"
      d="M50 4 C53 34 66 47 96 50 C66 53 53 66 50 96 C47 66 34 53 4 50 C34 47 47 34 50 4 Z"
      fill={color}
    />
  </svg>
);

const Squiggle = ({ className = "", color = "#c2476a" }) => (
  <svg viewBox="0 0 120 14" className={className} aria-hidden="true" fill="none">
    <path
      filter="url(#rough)"
      d="M2 8 C14 0 22 14 34 7 S56 1 66 8 S90 14 102 6 S114 4 118 8"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowDoodle = ({ className = "", color = "#3a2a22" }) => (
  <svg viewBox="0 0 100 80" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 70 C30 70 60 50 84 18" />
      <path d="M84 18 L66 22" />
      <path d="M84 18 L82 36" />
    </g>
  </svg>
);

const FlowerDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 100 110" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 54 C48 76 52 92 50 108" stroke="#6c9a62" strokeWidth="3.4" />
      <path d="M50 88 C62 78 72 80 78 74 C70 70 58 74 50 88 Z" fill="#8fbf8a" stroke="#6c9a62" strokeWidth="2" />
      {[
        [50, 22],
        [76, 40],
        [66, 70],
        [34, 70],
        [24, 40],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y - 4} r="17" fill="#f3a3b8" fillOpacity=".8" stroke="#c2476a" strokeWidth="2.2" />
      ))}
      <circle cx="50" cy="46" r="11" fill="#f0b73a" stroke="#a9701b" strokeWidth="2.2" />
    </g>
  </svg>
);

/* klip kertas */
const PaperClip = ({ className = "" }) => (
  <svg viewBox="0 0 40 100" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 72 V28 a8 8 0 0 1 16 0 V80 a12 12 0 0 1 -24 0 V22 a16 16 0 0 1 32 0 V72" stroke="#6f7787" strokeWidth="4" />
      <path d="M12 72 V28 a8 8 0 0 1 16 0 V80 a12 12 0 0 1 -24 0 V22 a16 16 0 0 1 32 0 V72" stroke="#d4dae6" strokeWidth="1.4" />
    </g>
  </svg>
);

/* paku payung / peniti tempel */
const Pushpin = ({ className = "" }) => (
  <svg viewBox="0 0 40 50" className={className} aria-hidden="true">
    <g filter="url(#rough)">
      <ellipse cx="22" cy="44" rx="9" ry="3" fill="rgba(0,0,0,.25)" />
      <path d="M20 30 L20 46" stroke="#8a8f99" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="20" cy="30" rx="13" ry="5" fill="#a8223c" />
      <path d="M10 28 C10 10 30 10 30 28 Z" fill="#d93a56" stroke="#7d1428" strokeWidth="1.6" />
      <path d="M14 22 C15 16 20 13 24 14" stroke="#ffd2da" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

/* tumpukan gabus anggur (ornamen seperti pada referensi) */
const Cork = ({ className = "" }) => (
  <svg viewBox="0 0 150 120" className={className} aria-hidden="true">
    <g filter="url(#rough)" strokeLinejoin="round" strokeLinecap="round">
      {[
        [6, 74, -8, 1],
        [20, 38, 14, 0.95],
        [60, 78, 4, 1],
        [72, 22, -18, 0.9],
        [96, 56, 22, 1],
        [92, 94, -6, 0.9],
      ].map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <rect x="0" y="0" width="52" height="22" rx="7" fill="#c9985c" stroke="#7a5128" strokeWidth="2" />
          <ellipse cx="6" cy="11" rx="4" ry="9.5" fill="#dcb47e" stroke="#7a5128" strokeWidth="1.6" />
          <path d="M16 7 H40 M16 15 H34" stroke="#8a2f3c" strokeWidth="2" opacity=".55" />
          <circle cx="45" cy="6" r="1.2" fill="#7a5128" />
          <circle cx="47" cy="15" r="1" fill="#7a5128" />
          <circle cx="12" cy="4" r="1" fill="#7a5128" />
        </g>
      ))}
    </g>
  </svg>
);

/* ---------- doodle garis putih (untuk halaman navy) ---------- */
const TentDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 260 130" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M110 10 L12 112 L236 120 Z" />
      <path d="M110 10 C104 48 98 84 100 114" />
      <path d="M110 10 C120 44 140 84 160 117" />
      <path d="M12 112 L2 123" strokeDasharray="2 7" />
      <path d="M236 120 L252 126" strokeDasharray="2 7" />
      <path d="M2 128 C60 132 180 132 258 128" strokeWidth="2" strokeDasharray="2 9" opacity=".8" />
    </g>
  </svg>
);

const DashedPath = ({ className = "" }) => (
  <svg viewBox="0 0 220 90" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 66 C40 4 84 104 122 40 S186 8 206 52" strokeDasharray="3 10" />
      <path d="M206 52 L190 50" />
      <path d="M206 52 L204 68" />
    </g>
  </svg>
);

const MoonLine = ({ className = "" }) => (
  <svg viewBox="0 0 80 90" className={className} aria-hidden="true" fill="none">
    <g filter="url(#rough)" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 6 A38 38 0 1 0 74 74 A30 30 0 1 1 52 6 Z" fill="#ffffff" fillOpacity=".1" />
    </g>
  </svg>
);

const Tape = ({ color = "rose", className = "", style }) => (
  <span aria-hidden="true" className={`tape tape-${color} ${className}`} style={style} />
);

/* ==========================================================================
   FOTO & VIDEO
   ========================================================================== */
function Photo({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-rose-200 via-amber-100 to-rose-300 ${className}`}
      >
        <HeartDoodle className="w-1/3" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      style={{ filter: "saturate(.95) sepia(.08)" }}
    />
  );
}

/* foto latar samar untuk halaman navy */
function NightBg({ src }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.2]"
      style={{ filter: "grayscale(.4) blur(1px)" }}
    />
  );
}

const ActiveContext = createContext(true);

function VideoSlot({ src, poster, className = "" }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const active = useContext(ActiveContext);

  // jeda video saat halamannya tidak sedang terlihat
  useEffect(() => {
    if (!active && ref.current) ref.current.pause();
  }, [active]);

  if (failed) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#2a211c] px-[1em] text-center text-amber-100/70 ${className}`}>
        <span className="font-hand text-[1.3em] leading-tight">
          Letakkan video di <br />
          public/videos/saat-menjadi-kita.mp4
        </span>
      </div>
    );
  }
  return (
    <video
      ref={ref}
      src={src}
      poster={poster || undefined}
      controls
      muted
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      className={`bg-black object-cover ${className}`}
    />
  );
}

/* Foto polaroid (variant="polaroid") atau cetakan foto tipis (variant="print") */
function Polaroid({
  src,
  alt,
  caption,
  date,
  rot = 0,
  ratio = "aspect-[4/5]",
  tape = "rose",
  clip = false,
  variant = "polaroid",
  className = "",
}) {
  const isPrint = variant === "print";
  return (
    <figure
      className={`print-shadow absolute m-0 bg-[#fdfcf9] ${isPrint ? "p-[.4em]" : "p-[.6em] pb-[.4em]"} ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      {tape && tape !== "none" && (
        <Tape color={tape} style={{ top: "-.9em", left: "50%", marginLeft: "-3.25em", transform: "rotate(-3deg)" }} />
      )}
      <Photo src={src} alt={alt} className={`w-full ${ratio}`} />
      {!isPrint && (caption || date) && (
        <figcaption className="px-[.2em] pb-[.1em] pt-[.25em] text-[#2a1f19]">
          {caption && <span className="font-script block text-[2em] leading-[1.05]">{caption}</span>}
          {date && <span className="font-hand block text-[1.1em] leading-none text-[#2a1f19]/60">{date}</span>}
        </figcaption>
      )}
      {clip && <PaperClip className="absolute -top-[1.8em] right-[1.2em] h-[4.4em]" />}
    </figure>
  );
}

/* catatan tulisan tangan: sorot putih di halaman terang, teks putih di halaman navy */
const Note = ({ children, rot = 0, dark = false, className = "" }) => (
  <p
    className={`font-hand absolute m-0 text-[1.4em] leading-[1.75] ${dark ? "text-white" : ""} ${className}`}
    style={{ transform: `rotate(${rot}deg)` }}
  >
    {dark ? children : <span className="strip">{children}</span>}
  </p>
);

const PageTag = ({ children, className = "", rot = -2 }) => (
  <span
    className={`font-marker absolute z-[3] inline-block bg-[#fbf3d9] px-[.7em] py-[.15em] text-[1.05em] text-[#6b3b2c] shadow-[0_0.1em_0.3em_rgba(60,35,10,0.28)] ${className}`}
    style={{ transform: `rotate(${rot}deg)` }}
  >
    {children}
  </span>
);

/* ==========================================================================
   KONTEKS BUKU (aksi dari dalam halaman)
   ========================================================================== */
const BookContext = createContext({
  next: () => {},
  prev: () => {},
  goToSpread: () => {},
  restart: () => {},
});

/* ==========================================================================
   ISI HALAMAN BUKU (14 halaman: P0 sampul … P13 sampul belakang)
   Dirancang pada kotak 25.16em x 37em; em = tinggi halaman / 37.
   Halaman ganjil = kertas craft putih (kiri), halaman genap = navy pekat (kanan).
   ========================================================================== */
function CoverPage() {
  const { next } = useContext(BookContext);
  return (
    <button
      type="button"
      onClick={next}
      aria-label="Buka buku"
      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60"
    >
      <span className="pointer-events-none absolute inset-[1.2em] rounded-[0.4em] border-[0.14em] border-dashed border-amber-100/45" />
      <span className="pointer-events-none absolute inset-[2em] rounded-[0.3em] border-[0.07em] border-amber-100/25" />
      <SparkleDoodle className="absolute left-[3em] top-[3em] w-[2em] text-amber-200/80" />
      <SparkleDoodle className="absolute bottom-[3.4em] right-[3em] w-[1.6em] text-amber-200/70" />
      <SparkleDoodle className="absolute right-[4em] top-[4.6em] w-[1.1em] text-rose-200/70" />

      <span
        className="paper print-shadow relative flex w-[18.5em] flex-col items-center px-[1.2em] pb-[1.7em] pt-[1.8em]"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        <Tape color="rose" style={{ top: "-.8em", left: "-1.6em", transform: "rotate(-38deg)" }} />
        <Tape color="teal" style={{ bottom: "-.8em", right: "-1.6em", transform: "rotate(-38deg)" }} />
        <span className="font-hand text-[1.8em] leading-none text-rose-800/85">Happy</span>
        <span className="font-script mt-[.05em] text-center text-[4.1em] leading-[.9] text-[#2a1f19]">Two Years of Us</span>
        <Squiggle className="mt-[.5em] w-[7em]" />
        <HeartDoodle className="mt-[.5em] w-[2.4em]" />
      </span>

      <span className="font-hand anim-nudge mt-[1.8em] text-[1.45em] text-amber-100/85">Ketuk untuk membuka buku</span>
    </button>
  );
}

/* P1 — terang */
function DedicationPage() {
  return (
    <div className="absolute inset-0">
      <Tape color="mustard" style={{ top: "1.6em", left: "50%", marginLeft: "-3.25em", transform: "rotate(2deg)" }} />
      <PaperClip className="absolute right-[2.6em] top-[.6em] h-[4.6em] rotate-[12deg]" />
      <div className="absolute inset-x-[2.4em] top-[3.4em] text-center">
        <p className="font-hand text-[1.6em] leading-none text-rose-800/85">Untuk kamu,</p>
        <h2 className="font-script mt-[.05em] text-[3.6em] leading-[.92] text-[#2a1f19]">Dua tahun, banyak cerita</h2>
        <Squiggle className="mx-auto mt-[.3em] w-[8em]" />
        <p className="font-hand mt-[.6em] text-[1.4em] leading-[1.75]">
          <span className="strip">Buku kecil ini menyimpan potongan hari-hari kita. Balik halamannya pelan-pelan, ya.</span>
        </p>
      </div>
     <Polaroid 
        src="../public/images/dua-tahun.jpeg" 
        alt="Dua tahun" 
        ratio="aspect-square" 
        caption="dua tahun" 
        date="Hari ini" 
        rot={-4} 
        tape="rose" 
        className="left-[2.6em] top-[21em] w-[10.5em]" 
      />
      <Polaroid 
      variant="print" 
      src="../public/images/dua-tahun1.jpeg" 
      alt="Kenangan kecil" 
      ratio="aspect-[4/3]" 
      rot={5} 
      tape="teal" 
      className="right-[2em] top-[22.4em] w-[9.4em]" 
      />
      <Cork className="absolute -bottom-[.4em] right-[1.4em] w-[7.6em]" />
    </div>
  );
}

/* P2 — navy */
function ContentsPage() {
  const { goToSpread } = useContext(BookContext);
  return (
    <div className="absolute inset-0 flex flex-col px-[2.4em] pb-[3em] pt-[3.2em] text-white">
      <Pushpin className="absolute left-1/2 top-[.8em] h-[2.8em] -translate-x-1/2" />
      <MoonLine className="absolute right-[2.4em] top-[2.6em] w-[2.6em] opacity-90" />
      <h2 className="font-script mt-[.4em] text-[3.4em] leading-none">Isi cerita</h2>
      <Squiggle className="mt-[.3em] w-[7em]" color="#ffffff" />
      <ol className="m-0 mt-[1em] flex list-none flex-col gap-[.65em] p-0">
        {MOMENTS.map((m, i) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => goToSpread(i + 2)}
              className="group flex w-full cursor-pointer items-center gap-[.8em] border-0 bg-transparent p-0 text-left text-white outline-none"
            >
              <span className="font-hand flex h-[1.9em] w-[1.9em] shrink-0 items-center justify-center rounded-full border-[0.09em] border-dashed border-white/70 text-[1.3em] leading-none transition group-hover:bg-white/15 group-focus-visible:bg-white/15">
                {i + 1}
              </span>
              <span className="flex flex-col">
                <span className="font-hand text-[1.55em] leading-none group-hover:underline">{m.tab}</span>
                <span className="font-hand text-[1.15em] leading-tight text-white/55">{m.date}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <TentDoodle className="mx-auto mt-auto w-[8.4em]" />
      <p className="font-hand mt-[.4em] text-center text-[1.15em] text-white/50">ketuk judul untuk loncat ke ceritanya</p>
    </div>
  );
}

/* halaman cerita generik — tone "paper" (terang) atau "navy" (gelap) */
function StoryPage({ moment, tone = "paper", deco = "heart", note, tape = "rose", clip = false }) {
  const dark = tone === "navy";
  return (
    <div className="absolute inset-0 flex flex-col px-[2.4em] pb-[3.2em] pt-[3.4em]">
      <Tape color={tape} style={{ top: "1em", left: "2.6em", transform: "rotate(-4deg)" }} />
      {clip && <PaperClip className="absolute right-[2.6em] top-[.4em] h-[5em] rotate-[8deg]" />}
      {dark && <SparkleDoodle className="absolute right-[2.6em] top-[1.8em] w-[1.5em] text-white/80" />}
      <p className={`font-hand text-[1.4em] leading-none ${dark ? "text-sky-200/85" : "text-rose-800/85"}`}>{moment.date}</p>
      <h2 className={`font-script mt-[.15em] text-[3.2em] leading-[.92] ${dark ? "text-white" : "text-[#2a1f19]"}`}>{moment.title}</h2>
      <Squiggle className="mt-[.4em] w-[8em]" color={dark ? "#ffffff" : "#c2476a"} />
      <p className={`font-hand mt-[.8em] text-[1.4em] leading-[1.75] ${dark ? "text-white/95" : ""}`}>
        {dark ? moment.story : <span className="strip">{moment.story}</span>}
      </p>

      <div className="mt-auto flex items-center justify-center gap-[.8em]">
        {deco === "heart" && <HeartDoodle className="w-[2.8em]" color={dark ? "#ffffff" : "#d9567a"} />}
        {deco === "flower" && <FlowerDoodle className="w-[2.8em]" />}
        {deco === "sparkle" && <SparkleDoodle className={`w-[2.4em] ${dark ? "text-white/85" : "text-amber-600/70"}`} />}
        {deco === "tent" && <TentDoodle className="w-[7em]" />}
        {note && <p className={`font-hand text-[1.35em] ${dark ? "text-white/75" : "text-[#2a1f19]/65"}`}>{note}</p>}
      </div>
    </div>
  );
}

const M1StoryPage = () => <StoryPage moment={MOMENTS[0]} tone="navy" deco="heart" note="dari sinilah semuanya dimulai" tape="clear" />;
const M2StoryPage = () => <StoryPage moment={MOMENTS[1]} tone="paper" deco="flower" note="satu malam, banyak senyum" tape="teal" clip />;
const M3StoryPage = () => <StoryPage moment={MOMENTS[2]} tone="navy" deco="sparkle" note="akhirnya jadi kita" tape="clear" />;
const M4StoryPage = () => <StoryPage moment={MOMENTS[3]} tone="navy" deco="tent" note="hari-hari yang ringan" tape="clear" />;

/* P3 — terang (kolase seperti halaman kiri pada referensi) */
function M1PhotosPage() {
  return (
    <div className="absolute inset-0">
      <PageTag className="right-[2em] top-[1.4em]" rot={2}>Awal Cerita</PageTag>
      <Polaroid variant="print" src="../../public/images/parkiran.jpeg" alt="Awal cerita, foto pertama" ratio="aspect-[4/3]" rot={-3} tape="rose" className="left-[1.8em] top-[3.6em] w-[14.4em]" />
      <Polaroid src="../../public/images/ekara.jpeg" alt="Awal cerita, foto kedua" caption="hari kita" date="Awal cerita" rot={3} clip tape="teal" className="right-[1.6em] top-[9.4em] w-[10.4em]" />
      <Note rot={-1.5} className="left-[2.2em] top-[16.4em] w-[11em]">
        Satu obrolan sederhana, lalu semuanya terasa indah.
      </Note>
      <Polaroid variant="print" src="../../public/images/jalan.jpeg" alt="Awal cerita, foto ketiga" ratio="aspect-[4/3]" rot={-4} tape="mustard" className="right-[2.6em] top-[26.6em] w-[9.4em]" />
      <HeartDoodle className="absolute left-[3.4em] top-[28em] w-[2.6em] -rotate-12" />
      <Cork className="absolute -bottom-[.4em] -left-[.6em] w-[9em]" />
    </div>
  );
}

/* P6 — navy (kolase seperti halaman kanan pada referensi) */
function M2PhotosPage() {
  return (
    <div className="absolute inset-0 text-white">
      <NightBg src={PHOTO.m4b} />
      <PageTag className="right-[2em] top-[1.4em]" rot={2}>First Date</PageTag>
      <Polaroid variant="print" src="../../public/images/ekara1.jpeg" alt="Kencan pertama, foto pertama" tape="none" rot={0} className="left-[2em] top-[4.2em] w-[11.4em]" />
      <Polaroid variant="print" src="../../public/images/dua-tahun2.jpeg" alt="Kencan pertama, foto kedua" ratio="aspect-[4/5]" tape="none" rot={0} className="right-[2em] top-[19.2em] w-[10.6em]" />
      <Note dark rot={-2} className="left-[2.4em] top-[20.6em] w-[9.6em] font-semibold">
        Lain kali, kita pergi lagi ke sana, ya.
      </Note>
      <DashedPath className="absolute bottom-[3.8em] left-[2.4em] w-[9.4em]" />
      <SparkleDoodle className="absolute bottom-[8em] left-[12em] w-[1.6em] text-white/85" />
      <SparkleDoodle className="absolute right-[3em] top-[3em] w-[1.1em] text-white/70" />
    </div>
  );
}

/* P7 — terang */
function M3VideoPage() {
  return (
    <div className="absolute inset-0">
      <PageTag className="left-[2em] top-[2em]">Saat Menjadi Kita</PageTag>
      <figure
        className="print-shadow absolute left-[1.7em] top-[6.4em] m-0 w-[21.6em] bg-[#fdfcf9] p-[.8em] pb-[.5em]"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        <Tape color="teal" style={{ top: "-.9em", left: "-1.4em", transform: "rotate(-36deg)" }} />
        <Tape color="rose" style={{ top: "-.9em", right: "-1.4em", transform: "rotate(36deg)" }} />
        <VideoSlot src={VIDEO_SRC} poster={VIDEO_POSTER} className="aspect-[16/10] w-full" />
        <figcaption className="px-[.2em] pt-[.2em] text-[#2a1f19]">
          <span className="font-script block text-[2.1em] leading-[1.05]">video kecil kita</span>
          <span className="font-hand block text-[1.1em] leading-none text-[#2a1f19]/60">Hari yang kita ingat</span>
        </figcaption>
      </figure>
      <Pushpin className="absolute right-[3.4em] top-[4.4em] h-[3em]" />
      <Note rot={-2} className="left-[2.6em] top-[24.2em] w-[12em]">
        Tekan ▶ untuk memutar. Suaranya menyusul dari lagu di pojok.
      </Note>
      <ArrowDoodle className="absolute left-[15.6em] top-[22.4em] w-[4em] -rotate-[30deg]" />
      <Cork className="absolute -bottom-[.4em] -right-[.4em] w-[8.4em]" />
      <HeartDoodle className="absolute bottom-[4.2em] left-[3.4em] w-[3em] rotate-[10deg]" />
    </div>
  );
}

/* P9 — terang */
function M4PhotosPage() {
  return (
    <div className="absolute inset-0">
      <PageTag className="right-[2em] top-[1.4em]" rot={2}>Tahun Pertama</PageTag>
      <Polaroid src="../../public/images/1.jpeg" alt="Tahun pertama, foto pertama" caption="tanpa rencana" date="Tahun pertama" rot={-5} tape="sage" className="left-[1.8em] top-[3.8em] w-[10.4em]" />
      <Polaroid src="../../public/images/3.jpeg" alt="Tahun pertama, foto kedua" caption="ada tawa" date="Suatu sore" rot={4} clip tape="rose" className="right-[1.8em] top-[8.4em] w-[10.4em]" />
      <Polaroid src="../../public/images/2.jpeg" alt="Tahun pertama, foto ketiga" caption="dan tenang" date="Akhir pekan" rot={-2} ratio="aspect-[4/3]" tape="mustard" className="left-[4.6em] top-[23.4em] w-[11em]" />
      <Cork className="absolute -bottom-[.4em] -right-[.6em] w-[7.4em]" />
    </div>
  );
}

function GalleryShot({ src, alt, className = "", rot = 0, tape = "rose" }) {
  return (
    <div
      className={`print-shadow relative bg-[#fdfcf9] p-[.45em] ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <Tape color={tape} style={{ top: "-.8em", left: "50%", marginLeft: "-3.25em", transform: "rotate(-2deg)" }} />
      <Photo src={src} alt={alt} className="h-full w-full" />
    </div>
  );
}

/* P11 — terang */
function M5GalleryPage() {
  return (
    <div className="absolute inset-0 px-[2em] pt-[2.6em]">
      <PageTag className="left-[2em] top-[1.6em]">Hari Ini</PageTag>
      <h2 className="font-script mt-[1.6em] text-[3.2em] leading-none text-[#2a1f19]">Galeri kita</h2>
      <div className="mx-auto mt-[.6em] grid w-[21em] grid-cols-2 gap-[.9em]">
        <GalleryShot src="../../public/images/33.jpeg" alt="Galeri, foto besar" rot={-1} tape="rose" className="col-span-2 h-[11.2em]" />
        <GalleryShot src="../../public/images/11.jpeg" alt="Galeri, foto kedua" rot={1.5} tape="teal" className="h-[9.8em]" />
        <GalleryShot src="../../public/images/22.jpeg" alt="Galeri, foto ketiga" rot={-1.5} tape="mustard" className="h-[9.8em]" />
      </div>
      <Cork className="absolute -bottom-[.4em] -left-[.6em] w-[8em]" />
    </div>
  );
}

/* P12 — navy */
function FinalPage() {
  const m = MOMENTS[4];
  return (
    <div className="absolute inset-0 flex flex-col px-[2.4em] pb-[3.2em] pt-[3.4em] text-white">
      <NightBg src={PHOTO.m5a} />
      <Tape color="clear" style={{ top: "1em", right: "2.6em", transform: "rotate(4deg)" }} />
      <SparkleDoodle className="absolute left-[2.4em] top-[1.6em] w-[1.4em] text-white/80" />
      <p className="font-hand relative text-[1.4em] leading-none text-sky-200/85">{m.date}</p>
      <h2 className="font-script relative mt-[.15em] text-[3.2em] leading-[.92]">{m.title}</h2>
      <Squiggle className="relative mt-[.4em] w-[8em]" color="#ffffff" />
      <p className="font-hand relative mt-[.8em] text-[1.4em] leading-[1.75] text-white/95">{m.story}</p>

      <div className="relative mt-auto flex flex-col items-center text-center">
        <p className="font-hand text-[1.5em] leading-none text-white/85">Terima kasih sudah ada,</p>
        <div className="mt-[.4em] flex items-center gap-[.6em]">
          <HeartDoodle className="w-[1.8em]" color="#ffffff" />
          <HeartDoodle className="w-[2.6em]" color="#f2a5b8" />
          <HeartDoodle className="w-[1.8em]" color="#ffffff" />
        </div>
      </div>
    </div>
  );
}

function BackCoverPage() {
  const { restart } = useContext(BookContext);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1.1em] px-[2em] text-center">
      <span className="pointer-events-none absolute inset-[1.2em] rounded-[0.4em] border-[0.14em] border-dashed border-amber-100/45" />
      <HeartDoodle className="w-[3.4em]" color="#f0c6a0" />
      <p className="font-hand text-[1.8em] leading-tight text-amber-100/90">Sampai jumpa di cerita berikutnya.</p>
      <button
        type="button"
        onClick={restart}
        className="font-hand cursor-pointer rounded-full border-[0.09em] border-amber-100/50 bg-white/5 px-[1.2em] py-[.3em] text-[1.45em] text-amber-50 transition hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/50"
      >
        Baca lagi dari awal
      </button>
    </div>
  );
}

const PAGES = [
  CoverPage, // 0  sampul
  DedicationPage, // 1  terang
  ContentsPage, // 2  navy
  M1PhotosPage, // 3  terang
  M1StoryPage, // 4  navy
  M2StoryPage, // 5  terang
  M2PhotosPage, // 6  navy
  M3VideoPage, // 7  terang
  M3StoryPage, // 8  navy
  M4PhotosPage, // 9  terang
  M4StoryPage, // 10 navy
  M5GalleryPage, // 11 terang
  FinalPage, // 12 navy
  BackCoverPage, // 13 sampul belakang
];
const LAST_PAGE = PAGES.length - 1;

// jenis kertas per halaman: ganjil = craft putih, genap = navy
const kindOf = (i) => (i === 0 || i === LAST_PAGE ? "cloth" : i % 2 === 1 ? "paper" : "navy");

function pageLabel(p) {
  if (p <= 0) return "Sampul";
  if (p === 1) return "Untuk kamu";
  if (p === 2) return "Isi cerita";
  if (p >= LAST_PAGE) return "Selesai";
  return MOMENTS[Math.floor((p - 3) / 2)].tab;
}

/* ==========================================================================
   FACE (satu sisi lembar kertas)
   ========================================================================== */
function Face({ kind, side, role, active, corner, pageNo, children }) {
  const { next, prev } = useContext(BookContext);
  const setRef = useCallback(
    (el) => {
      if (!el) return;
      if (active) el.removeAttribute("inert");
      else el.setAttribute("inert", "");
    },
    [active]
  );
  const radius =
    side === "left" ? "rounded-l-[0.5em] rounded-r-[0.15em]" : "rounded-r-[0.5em] rounded-l-[0.15em]";

  return (
    <div ref={setRef} className={`face ${role} ${kind} ${radius}`}>
      <ActiveContext.Provider value={active}>{children}</ActiveContext.Provider>
      {kind !== "cloth" && <span className={`gutter ${side === "left" ? "gutter-l" : "gutter-r"}`} />}
      {pageNo != null && <span className="page-no">{pageNo}</span>}
      {(corner === "next" || corner === "both") && (
        <button type="button" className="dogear dogear-br" aria-label="Halaman berikutnya" onClick={next} />
      )}
      {(corner === "prev" || corner === "both") && (
        <button type="button" className="dogear dogear-bl" aria-label="Halaman sebelumnya" onClick={prev} />
      )}
      <span className="shade" />
    </div>
  );
}

/* ==========================================================================
   MODE LAYAR: dua halaman (desktop) atau satu halaman (HP)
   ========================================================================== */
function useSpreadMode() {
  const query = "(min-width: 820px) and (min-height: 520px)";
  const [spread, setSpread] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setSpread(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return spread;
}

/* ==========================================================================
   HALAMAN 2 — FLIPBOOK 3D SCRAPBOOK
   Navigasi: tombol, pojok kertas, keyboard ← →, serta swipe/drag
   (onTouchStart/Move/End untuk HP, onMouseDown/Move/Up untuk desktop).
   ========================================================================== */
function BookScene() {
  const spread = useSpreadMode();
  const leafCount = spread ? 7 : 14;
  const maxF = spread ? 7 : 13;

  const [f, setF] = useState(0); // jumlah lembar yang sudah dibalik
  const [drag, setDrag] = useState(null); // { leaf, angle }
  const fRef = useRef(0);
  const stepRef = useRef(null);
  const modeRef = useRef(spread);
  const bookRef = useRef(null);
  const gestureRef = useRef(null);
  const lastTouchRef = useRef(0);
  const suppressClickRef = useRef(false);

  const commit = useCallback((v) => {
    fRef.current = v;
    setF(v);
  }, []);
  const stopSteps = useCallback(() => {
    if (stepRef.current) clearInterval(stepRef.current);
    stepRef.current = null;
  }, []);
  useEffect(() => stopSteps, [stopSteps]);

  // jaga posisi bacaan saat layar berpindah mode
  useEffect(() => {
    if (modeRef.current === spread) return;
    modeRef.current = spread;
    stopSteps();
    const cur = fRef.current;
    commit(spread ? Math.ceil(cur / 2) : Math.min(13, cur * 2));
  }, [spread, commit, stopSteps]);

  const next = useCallback(() => {
    stopSteps();
    commit(Math.min(maxF, fRef.current + 1));
  }, [maxF, commit, stopSteps]);
  const prev = useCallback(() => {
    stopSteps();
    commit(Math.max(0, fRef.current - 1));
  }, [commit, stopSteps]);
  const goTo = useCallback(
    (target) => {
      stopSteps();
      stepRef.current = setInterval(() => {
        const cur = fRef.current;
        if (cur === target) {
          stopSteps();
          return;
        }
        commit(cur + (target > cur ? 1 : -1));
      }, 190);
    },
    [commit, stopSteps]
  );
  const goToSpread = useCallback((j) => goTo(spread ? j : 2 * j - 1), [goTo, spread]);
  const restart = useCallback(() => goTo(0), [goTo]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ---------- gesture bersama (dipakai oleh touch DAN mouse) ---------- */
  const beginGesture = (x, y, target) => {
    if (target && target.closest && target.closest("video, input, [data-noflip]")) return;
    gestureRef.current = { x, y, t: performance.now(), active: false, p: 0, lastX: x, dir: null, leaf: 0, span: 400 };
  };

  const moveGesture = (x, y) => {
    const g = gestureRef.current;
    if (!g) return;
    const dx = x - g.x;
    const dy = y - g.y;

    if (!g.active) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      // geser ke kiri (dx < 0) = halaman berikutnya; ke kanan (dx > 0) = sebelumnya
      const dir = dx < 0 ? "next" : "prev";
      const cur = fRef.current;
      if ((dir === "next" && cur >= maxF) || (dir === "prev" && cur <= 0)) {
        gestureRef.current = null;
        return;
      }
      g.active = true;
      g.dir = dir;
      g.leaf = dir === "next" ? cur : cur - 1;
      const leafEl = bookRef.current && bookRef.current.querySelector(".leaf");
      g.span = (leafEl ? leafEl.offsetWidth : 400) * 0.9;
      stopSteps();
    }

    const signed = g.dir === "next" ? -dx : dx;
    const p = Math.max(0, Math.min(1, signed / g.span));
    g.p = p;
    g.lastX = x;
    const angle = g.dir === "next" ? -180 * p : -180 * (1 - p);
    setDrag({ leaf: g.leaf, angle });
  };

  const finishGesture = (cancelled) => {
    const g = gestureRef.current;
    gestureRef.current = null;
    if (!g || !g.active) return;
    // cegah klik "hantu" pada tombol/pojok setelah drag selesai
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 80);
    const dt = Math.max(1, performance.now() - g.t);
    const dist = Math.abs(g.lastX - g.x);
    const fast = dist / dt > 0.5 && dist > 30;
    const shouldCommit = !cancelled && (g.p > 0.28 || fast);
    setDrag(null);
    if (shouldCommit) commit(fRef.current + (g.dir === "next" ? 1 : -1));
  };

  /* ---------- handler touch (HP) ---------- */
  const onTouchStart = (e) => {
    lastTouchRef.current = Date.now();
    const t = e.touches[0];
    if (t) beginGesture(t.clientX, t.clientY, e.target);
  };
  const onTouchMove = (e) => {
    lastTouchRef.current = Date.now();
    const t = e.touches[0];
    if (t) moveGesture(t.clientX, t.clientY);
  };
  const onTouchEnd = () => {
    lastTouchRef.current = Date.now();
    finishGesture(false);
  };
  const onTouchCancel = () => finishGesture(true);

  /* ---------- handler mouse (desktop) ---------- */
  const fromTouch = () => Date.now() - lastTouchRef.current < 700; // abaikan mouse emulasi setelah sentuhan
  const onMouseDown = (e) => {
    if (fromTouch() || e.button !== 0) return;
    beginGesture(e.clientX, e.clientY, e.target);
  };
  const onMouseMove = (e) => {
    if (fromTouch() || !gestureRef.current) return;
    if ((e.buttons & 1) === 0) {
      finishGesture(false);
      return;
    }
    moveGesture(e.clientX, e.clientY);
  };
  const onMouseUp = () => {
    if (fromTouch()) return;
    finishGesture(false);
  };
  const onMouseLeave = () => {
    if (fromTouch()) return;
    finishGesture(false);
  };
  const onClickCapture = (e) => {
    if (suppressClickRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  /* ---------- render ---------- */
  const leftActive = spread ? 2 * f - 1 : -1;
  const rightActive = spread ? 2 * f : f;

  const shift = spread ? (f === 0 ? "-25%" : f === maxF ? "25%" : "0%") : "0%";

  const leaves = useMemo(() => Array.from({ length: leafCount }, (_, k) => k), [leafCount]);

  const cornerFor = (i, isSpread) => {
    if (i === 0 || i === LAST_PAGE) return null;
    if (isSpread) return i % 2 === 0 ? "next" : "prev";
    return "both";
  };

  const FrontPage = (i) => {
    const Page = PAGES[i];
    return <Page />;
  };

  return (
    <div
      className={`stage ${spread ? "stage-spread" : "stage-single"} anim-book-in font-hand fixed inset-0 flex touch-pan-y cursor-grab select-none flex-col items-center justify-center gap-[2.4dvh] overflow-hidden text-[#3a2a1c] active:cursor-grabbing`}
      style={{ backgroundColor: "#d9c7a6", backgroundImage: TABLE_PATTERN }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClickCapture={onClickCapture}
    >
      {/* vignet lembut di tepi meja */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(60,40,15,.3) 100%)" }}
      />

      <BookContext.Provider value={{ next, prev, goToSpread, restart }}>
        <div className="book-shift relative z-10" style={{ transform: `translateX(${shift})` }}>
          <div className="book" ref={bookRef}>
            <div className="book-shadow book-shadow-l" style={{ opacity: spread && f > 0 ? 1 : 0 }} />
            <div className="book-shadow book-shadow-r" style={{ opacity: f < maxF ? 1 : 0 }} />

            {leaves.map((k) => {
              const flipped = k < f;
              const dragging = drag && drag.leaf === k;
              const angle = dragging ? drag.angle : flipped ? -180 : 0;
              const z = dragging ? 80 : flipped ? k : leafCount - k;

              const frontIdx = spread ? 2 * k : k;
              const backIdx = spread ? 2 * k + 1 : null;

              return (
                <div
                  key={k}
                  className={`leaf ${flipped ? "is-flipped" : ""} ${dragging ? "is-dragging" : ""}`}
                  style={{
                    transform: `rotateY(${angle}deg)`,
                    zIndex: z,
                    "--p": dragging ? Math.abs(angle) / 180 : undefined,
                  }}
                >
                  <Face
                    role="front"
                    kind={kindOf(frontIdx)}
                    side="right"
                    active={frontIdx === rightActive}
                    corner={cornerFor(frontIdx, spread)}
                    pageNo={frontIdx > 0 && frontIdx < LAST_PAGE ? frontIdx : null}
                  >
                    {FrontPage(frontIdx)}
                  </Face>

                  {spread ? (
                    <Face
                      role="back"
                      kind={kindOf(backIdx)}
                      side="left"
                      active={backIdx === leftActive}
                      corner={cornerFor(backIdx, true)}
                      pageNo={backIdx > 0 && backIdx < LAST_PAGE ? backIdx : null}
                    >
                      {FrontPage(backIdx)}
                    </Face>
                  ) : (
                    <Face role="back" kind="paper" side="left" active={false} corner={null} pageNo={null} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* kontrol bawah */}
        <div className="relative z-10 flex flex-col items-center gap-[.6dvh]" data-noflip>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={f === 0}
              aria-label="Halaman sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4a3a28]/30 bg-white/60 text-[#3a2a1c] outline-none transition hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <span className="min-w-[9rem] text-center text-2xl font-semibold text-[#3a2a1c]" aria-live="polite">
              {pageLabel(spread ? (f === 0 ? 0 : f === maxF ? LAST_PAGE : 2 * f) : f)}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={f === maxF}
              aria-label="Halaman berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4a3a28]/30 bg-white/60 text-[#3a2a1c] outline-none transition hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <p className="text-lg text-[#3a2a1c]/65">geser halaman, klik pojok kertas, atau tekan ← →</p>
        </div>
      </BookContext.Provider>
    </div>
  );
}

/* ==========================================================================
   FLOATING MUSIC PLAYER (halaman 2)
   ========================================================================== */
function formatTime(s) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

function MusicPlayer({ playing, current, duration, blocked, onToggle, onSeek }) {
  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;
  return (
    <aside
      data-noflip
      aria-label="Pemutar musik"
      className="fixed right-3 top-3 z-[120] flex w-[15.5rem] items-center gap-3 rounded-full border border-white/10 bg-[#1a1412]/80 py-2 pl-2 pr-3 text-amber-50 shadow-xl shadow-black/50 backdrop-blur-md md:bottom-5 md:right-5 md:top-auto"
    >
      <div
        className={`relative h-11 w-11 shrink-0 rounded-full ring-1 ring-white/10 transition-shadow duration-700 ${
          playing ? "shadow-[0_0_18px_rgba(251,113,133,0.4)]" : ""
        }`}
      >
        <div
          className="vinyl-spin h-full w-full rounded-full"
          style={{
            animationPlayState: playing ? "running" : "paused",
            background: "repeating-radial-gradient(circle at center, #0a0a0b 0 2px, #1c1c20 2px 3px)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 20deg, transparent 0 18%, rgba(255,255,255,.14) 25%, transparent 32% 68%, rgba(255,255,255,.1) 75%, transparent 82%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-300 to-rose-500">
            <span className="absolute left-1/2 top-[2px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-rose-950/60" />
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0c0c0e]" />
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[12px] font-semibold leading-tight">{SONG_TITLE}</p>
        <p className="truncate font-sans text-[11px] leading-tight text-amber-50/50">
          {blocked && !playing ? "Ketuk ▶ untuk memutar" : SONG_ARTIST}
        </p>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(current, duration || 0)}
          onChange={onSeek}
          disabled={!duration}
          aria-label="Posisi lagu"
          className="seek mt-1.5"
          style={{ "--p": `${pct}%` }}
        />
        <div className="mt-0.5 flex justify-between font-sans text-[9px] tabular-nums text-amber-50/40">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Jeda lagu" : "Putar lagu"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-400 text-zinc-950 outline-none transition hover:scale-105 hover:bg-rose-300 focus-visible:ring-4 focus-visible:ring-rose-300/50 ${
          blocked && !playing ? "animate-pulse" : ""
        }`}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </aside>
  );
}

/* ==========================================================================
   HALAMAN 1 — INTRO LILIN & KUPU-KUPU (sketsa hand-drawn full warna)
   ========================================================================== */
const Leaf = ({ x, y, r = 0, s = 1, fill = "#8fbf8a", stroke = "#5d8f58" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C10 -14 26 -14 36 0 C26 14 10 14 0 0 Z" fill={fill} stroke={stroke} strokeWidth="2" />
    <path d="M4 0 L30 0" stroke={stroke} strokeWidth="1.4" opacity=".7" />
  </g>
);

const sparklePath = (x, y, r) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

function IntroBackdrop() {
  const sparkles = [
    [330, 120, 16, "#f6e7b4"],
    [520, 70, 10, "#f2a5b8"],
    [700, 140, 14, "#bfe3f5"],
    [860, 90, 18, "#f6e7b4"],
    [420, 230, 9, "#d7c3f3"],
    [800, 260, 11, "#f2a5b8"],
    [90, 330, 12, "#bfe3f5"],
    [930, 380, 10, "#f6e7b4"],
    [250, 440, 8, "#f2a5b8"],
  ];
  return (
    <svg
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
      aria-hidden="true"
    >
      <g filter="url(#wash)">
        {/* bulan sabit */}
        <path d="M150 70 A62 62 0 1 0 214 176 A48 48 0 1 1 150 70 Z" fill="#f4e3a6" stroke="#e8c86a" strokeWidth="3" />
        <path d="M128 110 C122 130 124 150 134 166" stroke="#d8b650" strokeWidth="2" fill="none" />
        <path d="M140 100 C132 124 134 150 146 172" stroke="#d8b650" strokeWidth="1.4" fill="none" opacity=".7" />

        {/* bintang-bintang */}
        {sparkles.map(([x, y, r, c], i) => (
          <path key={i} d={sparklePath(x, y, r)} fill={c} stroke={c} strokeWidth="1.5" />
        ))}

        {/* rasi bintang garis putus-putus */}
        <path d="M330 120 L420 230 L520 70 L700 140 L860 90" fill="none" stroke="#c9c2e8" strokeWidth="1.6" strokeDasharray="4 10" opacity=".6" />

        {/* sulur kiri bawah */}
        <path d="M0 800 C60 700 120 640 90 560 C70 500 110 450 160 420" fill="none" stroke="#7fae7a" strokeWidth="5" strokeLinecap="round" />
        <Leaf x={70} y={700} r={-60} s={1.2} />
        <Leaf x={100} y={650} r={20} s={1.1} fill="#a9d49a" />
        <Leaf x={96} y={598} r={-70} s={1} />
        <Leaf x={110} y={540} r={15} s={1.1} fill="#a9d49a" />
        <Leaf x={142} y={470} r={-45} s={.9} />
        {[
          [160, 418, "#f3a3b8"],
          [64, 612, "#f9d77e"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 11} cy={y + Math.sin((a * Math.PI) / 180) * 11} r="8" fill={c} stroke="#c2476a" strokeWidth="1.4" />
            ))}
            <circle cx={x} cy={y} r="6" fill="#f0b73a" stroke="#a9701b" strokeWidth="1.4" />
          </g>
        ))}

        {/* sulur kanan bawah */}
        <path d="M1000 800 C940 710 900 650 930 580 C950 520 910 470 860 440" fill="none" stroke="#7fae7a" strokeWidth="5" strokeLinecap="round" />
        <Leaf x={940} y={700} r={-120} s={1.2} />
        <Leaf x={906} y={652} r={-200} s={1.1} fill="#a9d49a" />
        <Leaf x={930} y={596} r={-110} s={1} />
        <Leaf x={916} y={540} r={-190} s={1.1} fill="#a9d49a" />
        <Leaf x={880} y={470} r={-130} s={.9} />
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={858 + Math.cos((a * Math.PI) / 180) * 11} cy={438 + Math.sin((a * Math.PI) / 180) * 11} r="8" fill="#c9b5f0" stroke="#7a56c2" strokeWidth="1.4" />
          ))}
          <circle cx="858" cy="438" r="6" fill="#f0b73a" stroke="#a9701b" strokeWidth="1.4" />
        </g>

        {/* hati kecil */}
        <path d="M820 200 C800 184 798 164 812 158 C820 156 826 160 828 166 C832 158 842 158 846 166 C852 178 838 192 820 200 Z" fill="#f2a5b8" stroke="#d9567a" strokeWidth="2" />
        <path d="M200 560 C186 548 184 534 194 530 C200 528 204 531 205 536 C208 530 216 530 218 536 C222 545 212 555 200 560 Z" fill="#f2a5b8" stroke="#d9567a" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* lilin menyala */
function Candle() {
  const hatchRight = Array.from({ length: 16 }, (_, i) => ({ x: 176 + (i % 4) * 5, y: 172 + i * 15 }));
  const hatchPlate = Array.from({ length: 18 }, (_, i) => 40 + i * 12.5);
  const motes = Array.from({ length: 9 }, (_, i) => ({
    dx: `${(i % 2 ? 1 : -1) * (6 + ((i * 13) % 34))}px`,
    d: `${4 + (i % 4) * 1.1}s`,
    dl: `${-(i * 0.9)}s`,
    left: `${(i % 3) * 6 - 6}px`,
  }));

  return (
    <div className="candle-wrap">
      <div className="flame-anchor" aria-hidden="true">
        <div className="glow" />
      </div>

      <svg className="candle-art" viewBox="0 0 300 480" aria-label="Lilin yang menyala" role="img">
        {/* warna (pensil / cat air) */}
        <g filter="url(#wash)">
          <ellipse cx="150" cy="434" rx="128" ry="30" fill="#b9802f" />
          <ellipse cx="150" cy="426" rx="108" ry="20" fill="#e2b45a" />
          <ellipse cx="150" cy="424" rx="70" ry="10" fill="#c79a40" />
          <path d="M104 150 C101 240 100 340 104 424 C128 436 172 436 196 424 C200 340 199 240 196 150 Z" fill="#f4e3bb" />
          <path d="M112 160 C110 250 110 340 113 418 L126 420 C124 340 124 250 126 160 Z" fill="#fff8e6" />
          <path d="M172 156 C176 250 177 340 176 428 C186 428 192 426 196 424 C200 340 199 240 196 150 Z" fill="#dfb985" />
          <path d="M103 360 C130 372 170 372 197 360 L196 424 C172 436 128 436 104 424 Z" fill="#f0a9b3" opacity=".6" />
          <ellipse cx="150" cy="150" rx="46" ry="13" fill="#fff2cf" />
          <ellipse cx="150" cy="151" rx="30" ry="7" fill="#f9d98f" opacity=".85" />
          <path d="M112 156 C110 190 112 214 120 214 C128 214 128 192 126 160 Z" fill="#fff0c8" />
          <path d="M158 162 C158 196 160 238 168 238 C176 238 176 200 172 164 Z" fill="#fff0c8" />
          <path d="M184 156 C186 176 188 190 193 190 C197 190 196 170 194 154 Z" fill="#fff0c8" />
        </g>

        {/* garis tinta + arsiran */}
        <g filter="url(#rough)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="#4a2e1f" strokeWidth="2.6">
            <path d="M104 150 C101 240 100 340 104 424 C128 436 172 436 196 424 C200 340 199 240 196 150" />
            <ellipse cx="150" cy="150" rx="46" ry="13" />
            <path d="M112 156 C110 190 112 214 120 214 C128 214 128 192 126 160" strokeWidth="2" />
            <path d="M158 162 C158 196 160 238 168 238 C176 238 176 200 172 164" strokeWidth="2" />
            <path d="M184 156 C186 176 188 190 193 190 C197 190 196 170 194 154" strokeWidth="2" />
            <ellipse cx="150" cy="434" rx="128" ry="30" />
            <ellipse cx="150" cy="426" rx="108" ry="20" strokeWidth="1.8" />
            <path d="M262 424 C290 414 300 440 278 450 C268 454 258 448 258 440" strokeWidth="3" stroke="#7a5320" />
          </g>
          <path d="M106 152 C103 242 102 342 106 426" stroke="#4a2e1f" strokeWidth="1.2" opacity=".45" />
          <g stroke="#9a6a3c" strokeWidth="1.3" opacity=".55">
            {hatchRight.map((h, i) => (
              <path key={i} d={`M${h.x} ${h.y} l-9 22`} />
            ))}
          </g>
          <g stroke="#8a5a1c" strokeWidth="1.3" opacity=".5">
            {hatchPlate.map((x, i) => (
              <path key={i} d={`M${x} 448 l8 -10`} />
            ))}
          </g>
          <g stroke="#d9567a" strokeWidth="1.4" opacity=".45">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M${112 + i * 11} 372 l-6 24`} />
            ))}
          </g>
          {/* sumbu */}
          <path d="M150 148 C147 136 150 128 153 122" stroke="#2b1b14" strokeWidth="3.6" />
        </g>
      </svg>

      <div className="flame-anchor" aria-hidden="true" style={{ top: "22%" }}>
        {motes.map((m, i) => (
          <span key={i} className="mote" style={{ "--dx": m.dx, "--d": m.d, "--dl": m.dl, left: m.left }} />
        ))}
      </div>

      {/* api */}
      <div className="flame" aria-hidden="true">
        <div className="flame-in">
          <svg viewBox="0 0 80 140">
            <g filter="url(#wash)">
              <path d="M40 6 C58 40 72 62 66 92 C62 120 48 132 40 132 C32 132 18 120 14 92 C8 62 24 38 40 6 Z" fill="#ff9a1f" />
              <path d="M40 36 C52 60 60 78 56 98 C53 116 46 124 40 124 C34 124 27 116 24 98 C20 78 30 58 40 36 Z" fill="#ffd23f" />
              <path d="M40 70 C47 84 50 96 46 108 C44 116 42 118 40 118 C38 118 36 116 34 108 C30 96 33 84 40 70 Z" fill="#fff7c9" />
              <ellipse cx="40" cy="114" rx="7" ry="10" fill="#7fb2ff" opacity=".7" />
            </g>
            <g filter="url(#rough)" fill="none" stroke="#b34a12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 6 C58 40 72 62 66 92 C62 120 48 132 40 132 C32 132 18 120 14 92 C8 62 24 38 40 6 Z" />
              <path d="M40 36 C52 60 60 78 56 98" strokeWidth="1.2" opacity=".6" />
            </g>
          </svg>
        </div>
      </div>

      <div className="flame-anchor" aria-hidden="true">
        <div className="glow glow-front" />
      </div>
    </div>
  );
}

/* satu kupu-kupu: sayap & badan dibuat sebagai elemen terpisah agar animasinya halus */
function WingSvg({ c1, c2, c3 }) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true">
      <g filter="url(#wash)">
        <path d="M0 44 C4 22 20 6 40 4 C54 3 60 10 57 22 C54 34 36 46 16 50 C8 52 2 50 0 48 Z" fill={c1} />
        <path d="M0 52 C14 54 36 54 46 64 C54 72 50 88 38 92 C26 96 12 82 6 68 C3 62 1 56 0 54 Z" fill={c1} />
        <path d="M18 14 C30 8 46 8 52 16 C48 26 34 34 20 38 C14 30 12 20 18 14 Z" fill={c2} opacity=".85" />
        <path d="M16 62 C28 62 40 66 42 74 C40 84 30 86 22 80 C16 74 14 68 16 62 Z" fill={c2} opacity=".85" />
      </g>
      <g filter="url(#rough)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 44 C4 22 20 6 40 4 C54 3 60 10 57 22 C54 34 36 46 16 50 C8 52 2 50 0 48" stroke="#2a1a18" strokeWidth="1.5" />
        <path d="M0 52 C14 54 36 54 46 64 C54 72 50 88 38 92 C26 96 12 82 6 68 C3 62 1 56 0 54" stroke="#2a1a18" strokeWidth="1.5" />
        <path d="M2 48 C16 38 30 24 50 10 M2 48 C18 44 36 38 54 28 M2 54 C16 60 30 70 40 84 M2 52 C20 56 34 60 46 66" stroke="#2a1a18" strokeWidth=".9" opacity=".45" />
        <circle cx="47" cy="14" r="2.6" fill={c3} stroke="none" />
        <circle cx="52" cy="24" r="2" fill={c3} stroke="none" />
        <circle cx="40" cy="78" r="2.6" fill={c3} stroke="none" />
        <circle cx="30" cy="86" r="1.8" fill={c3} stroke="none" />
      </g>
    </svg>
  );
}

function BodySvg() {
  return (
    <svg viewBox="0 0 20 100" aria-hidden="true">
      <g filter="url(#rough)" fill="#2b1b18" stroke="#2b1b18" strokeLinecap="round">
        <ellipse cx="10" cy="68" rx="4" ry="26" />
        <ellipse cx="10" cy="34" rx="5" ry="11" />
        <circle cx="10" cy="20" r="4.2" />
        <path d="M8 17 C5 8 2 4 1 1 M12 17 C15 8 18 4 19 1" fill="none" strokeWidth="1" />
        <path d="M7 60 H13 M7 68 H13 M7 76 H13" stroke="#8a6a58" strokeWidth=".9" fill="none" />
      </g>
    </svg>
  );
}

function Butterfly({ c1, c2, c3, flap }) {
  return (
    <div className="bf" style={{ "--flap": flap }}>
      <div className="bf-wing bf-wing-l">
        <WingSvg c1={c1} c2={c2} c3={c3} />
      </div>
      <div className="bf-wing bf-wing-r">
        <WingSvg c1={c1} c2={c2} c3={c3} />
      </div>
      <div className="bf-body">
        <BodySvg />
      </div>
    </div>
  );
}

const BUTTERFLIES = [
  { path: "a", size: 9.5, dur: "9.5s", delay: "-3s", flap: ".42s", c: ["#e8557f", "#ffc2d4", "#fff6f0"] },
  { path: "b", size: 7.5, dur: "10s", delay: "-6s", flap: ".5s", c: ["#27a79c", "#b9f0e8", "#ffffff"] },
  { path: "c", size: 8.5, dur: "11s", delay: "-1s", flap: ".38s", c: ["#f2a516", "#ffe08a", "#7a3b12"] },
  { path: "d", size: 6.5, dur: "9s", delay: "-5s", flap: ".46s", c: ["#8a5cd0", "#dcc8ff", "#ffffff"] },
  { path: "e", size: 7, dur: "10s", delay: "0s", flap: ".4s", c: ["#ef6a3a", "#ffd0b8", "#fff4e6"] },
  { path: "a", size: 5.2, dur: "12s", delay: "-9s", flap: ".34s", c: ["#3f78e0", "#c4dbff", "#ffffff"] },
  { path: "b", size: 5.6, dur: "11s", delay: "-2s", flap: ".36s", c: ["#e0b030", "#fff0b0", "#8a4a10"] },
];

function IntroPage({ leaving, blocked }) {
  return (
    <main
      className="fixed inset-0 z-50 overflow-hidden bg-[#0d0a10] transition-opacity ease-in-out"
      style={{ opacity: leaving ? 0 : 1, transitionDuration: `${INTRO_FADE_MS}ms` }}
    >
      <IntroBackdrop />
      <div className="intro-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* cahaya lantai di bawah lilin */}
      <div
        className="pointer-events-none absolute bottom-[4%] left-1/2 h-[18vh] w-[70vmin] -translate-x-1/2 rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(255,160,70,.35), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center pb-[6dvh]">
        <Candle />
      </div>

      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          className={`fly fly-${b.path}`}
          style={{ width: `clamp(34px, ${b.size}vmin, 110px)`, "--dur": b.dur, "--delay": b.delay }}
          aria-hidden="true"
        >
          <Butterfly c1={b.c[0]} c2={b.c[1]} c3={b.c[2]} flap={b.flap} />
        </div>
      ))}

      <div className="intro-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <p className="intro-line font-hand pointer-events-none absolute inset-x-0 bottom-[9dvh] px-6 text-center text-[clamp(1.5rem,4.2vmin,2.4rem)] text-amber-100/90">
        Pejamkan mata, buat satu harapan…
      </p>

      {blocked && (
        <p className="hint-pulse font-hand pointer-events-none absolute inset-x-0 top-[4dvh] px-6 text-center text-xl text-amber-100/80">
          Ketuk layar untuk menyalakan lagu
        </p>
      )}

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5" aria-hidden="true">
        <div className="intro-progress h-full w-full bg-gradient-to-r from-amber-300/70 via-rose-300/80 to-rose-400/80" />
      </div>
    </main>
  );
}

/* ==========================================================================
   APP — intro 10 detik → fade → flipbook
   ========================================================================== */
export default function App() {
  const [page, setPage] = useState("intro"); // "intro" | "book"
  const [leaving, setLeaving] = useState(false);

  const audioRef = useRef(null);
  const gestureStartRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [blocked, setBlocked] = useState(false);

  /* Timer intro: tepat 10 detik. Fade-out di 800ms terakhir, lalu langsung ganti halaman. */
  useEffect(() => {
    if (page !== "intro") return undefined;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= INTRO_MS - INTRO_FADE_MS) setLeaving(true);
      if (elapsed >= INTRO_MS) {
        clearInterval(id);
        setPage("book");
        setLeaving(false);
      }
    }, 50);
    return () => clearInterval(id);
  }, [page]);

  /* Autoplay lagu begitu komponen terbuka.
     Browser bisa menolak autoplay bersuara sebelum ada interaksi;
     jika ditolak, lagu mulai pada sentuhan/klik/tombol pertama. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const events = ["pointerdown", "keydown", "touchstart"];
    const detach = () => events.forEach((ev) => window.removeEventListener(ev, onGesture));
    function onGesture() {
      gestureStartRef.current = Date.now();
      audio
        .play()
        .then(detach)
        .catch(() => {});
    }
    audio.play().catch(() => {
      setBlocked(true);
      events.forEach((ev) => window.addEventListener(ev, onGesture));
    });
    return detach;
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // abaikan klik yang baru saja dipakai untuk membuka blokir autoplay
    if (Date.now() - gestureStartRef.current < 400) return;
    if (audio.paused) audio.play().catch(() => setBlocked(true));
    else audio.pause();
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrent(t);
  };

  return (
    <>
      <GlobalStyles />
      <SketchDefs />

      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="auto"
        loop
        onPlay={() => {
          setPlaying(true);
          setBlocked(false);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

      {page === "intro" ? (
        <IntroPage leaving={leaving} blocked={blocked && !playing} />
      ) : (
        <>
          <BookScene />
          <MusicPlayer
            playing={playing}
            current={current}
            duration={duration}
            blocked={blocked}
            onToggle={togglePlay}
            onSeek={seek}
          />
        </>
      )}
    </>
  );
}