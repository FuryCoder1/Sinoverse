# ✨ Sinoverse

**A universe of shared Sinitic words.** Sinoverse is an interactive comparative
vocabulary explorer for cognate and related words across **Chinese / Mandarin,
Cantonese, Hokkien, Japanese, Korean, and Vietnamese** — how 學 became *hok*,
*ha̍k*, *gaku*, *hak*, and *học*.

A polished static prototype built with **semantic HTML, CSS, and vanilla
JavaScript** — no build step, no dependencies.

---

## Run it

```bash
# any static server works; from the repo root:
python3 -m http.server 8099
# then open http://localhost:8099/index.html
```

Opening `index.html` directly via `file://` also works: the app falls back to a
bundled subset (`js/fallback-data.js`) when `fetch` of the JSON is blocked.

## Features

| Feature | Where |
|---|---|
| Search by meaning, character, romanization, or language form (case- and diacritic-insensitive) | `js/app.js` → `normalize()` + prebuilt search blobs |
| Instant language show/hide toggles (glass chips with per-language colors) | hero language bar |
| Comparison cards: main/alt form, meaning, all visible variants, confidence badge | `data/words.json` → card renderer |
| Detail modal: full comparison table (language · native form · romanization · audio · notes), tags | keyboard-openable (`Enter`/`Space`), focus-trapped, `Esc` closes |
| Audio pronunciation via Web Speech API (`zh-CN`, `zh-HK`, `ja-JP`, `ko-KR`, `vi-VN` voices where installed) | 🔊 buttons in the modal table |
| Animations: staggered card entrances, hover lift/glow, spring modal, chip micro-interactions, drifting starfield | `css/style.css`; fully disabled under `prefers-reduced-motion` |
| Accessibility: skip link, semantic landmarks, ARIA live region + toast, visible focus rings, keyboard-operable everything | `index.html` |
| Responsive: auto-fill grid on desktop → single column on mobile | media queries at 860px / 560px |

Keyboard shortcuts: `/` focuses search · `Esc` clears search / closes modal ·
`Tab` cycles results · `Enter` opens a card.

## Data model

Entries live in [`data/words.json`](data/words.json):

```jsonc
{
  "id": "w-xue",
  "main": "學",            // traditional / primary form
  "alt": "学",             // alternate / simplified form
  "meaning": "study; learn; learning",
  "note": "usage & semantic-shift note…",
  "confidence": "High",    // High | Medium | Low
  "tags": ["education", "verb"],
  "forms": {
    "zh":  { "native": "学习", "roman": "xuéxí", "pronunciationKey": "zh-CN" },
    "yue": { "native": "學習", "roman": "hok6 zaap6", "pronunciationKey": "zh-HK" },
    "nan": { "native": "學習", "roman": "ha̍k-si̍p / o̍h-si̍p", "pronunciationKey": null },
    "ja":  { "native": "学習", "roman": "gakushū (がくしゅう)", "pronunciationKey": "ja-JP" },
    "ko":  { "native": "학습", "roman": "hak-seup (학습)", "pronunciationKey": "ko-KR" },
    "vi":  { "native": "học tập", "roman": "học tập", "pronunciationKey": "vi-VN" }
  }
}
```

The shape is deliberately database-friendly: stable string `id`s, one row per
language form, and a `meta.languages` registry. Swapping the `fetch("data/words.json")`
call in `js/app.js` for an API endpoint (`GET /api/entries?q=…`) is the only
change needed to go dynamic.

## Project layout

```
index.html            semantic shell + modal + live regions
css/style.css         design tokens, glassmorphism, animations, responsive + reduced motion
js/app.js             state, search, chips, cards, modal, speech synthesis
js/fallback-data.js   inline subset for file:// usage
data/words.json       41 sample entries (the future DB seed)
```

## Future expansion (already scaffolded)

- **Audio**: swap/augment speech synthesis with uploaded MP3s per form (`forms.<lang>.audioUrl`).
- **Middle Chinese reconstructions & historical forms**: add sibling fields to each form object.
- **Semantic-shift timeline**: the `note` field can grow into structured shifts.
- **Confidence scoring**: `confidence` maps to a numeric scale later.
- **User contributions & API**: JSON schema matches a REST/Postgres model 1:1.

Prototype v0.1 — 漢字文化圈, one constellation at a time.
