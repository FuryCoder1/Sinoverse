/* ============================================================
   Sinoverse — interactive comparative vocabulary prototype
   Vanilla JS. Data-driven; ready to swap JSON fetch for an API.
   ============================================================ */

(() => {
  "use strict";

  /* ---------------- Language registry ----------------
     Single source of truth for the six Sino-Xenic languages.
     Colors are used for chips, dots and table accents.      */
  const LANGUAGES = [
    { code: "zh",  name: "Chinese / Mandarin", native: "中文",   short: "ZH",  color: "#ffd479" },
    { code: "yue", name: "Cantonese",          native: "粵語",   short: "YUE", color: "#ff9d6c" },
    { code: "nan", name: "Hokkien",            native: "閩南語", short: "NAN", color: "#ff7ac8" },
    { code: "ja",  name: "Japanese",           native: "日本語", short: "JA",  color: "#8b7bff" },
    { code: "ko",  name: "Korean",             native: "한국어", short: "KO",  color: "#5db2ff" },
    { code: "vi",  name: "Vietnamese",         native: "Tiếng Việt", short: "VI", color: "#4fe3c1" }
  ];

  const LATIN_LANGS = new Set(["vi"]); // scripts that are romanized already

  /* ---------------- App state ---------------- */
  const state = {
    query: "",
    activeLangs: new Set(LANGUAGES.map((l) => l.code)),
    entries: [],
    openEntryId: null,
    lastFocused: null
  };

  /* ---------------- DOM refs ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const els = {
    searchInput: $("#search-input"),
    searchClear: $("#search-clear"),
    resultCount: $("#result-count"),
    langBar: $("#lang-bar"),
    grid: $("#word-grid"),
    emptyState: $("#empty-state"),
    overlay: $("#modal-overlay"),
    modal: $("#modal"),
    liveRegion: $("#live-region"),
    toast: $("#toast")
  };

  /* ---------------- Utilities ---------------- */

  /** Normalize text: lowercase + strip diacritics (NFD trick). */
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  /** Escape HTML for safe interpolation. */
  const esc = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let toastTimer = null;
  function announce(message) {
    if (els.liveRegion) els.liveRegion.textContent = message;
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  /* ---------------- Search / filtering ---------------- */

  /** Flatten everything searchable about an entry into one normalized string. */
  function buildSearchBlob(entry) {
    const parts = [entry.main, entry.alt, entry.meaning, entry.note, entry.confidence];
    (entry.tags || []).forEach((t) => parts.push(t));
    LANGUAGES.forEach(({ code }) => {
      const form = entry.forms[code];
      if (form) parts.push(form.native, form.roman);
    });
    return normalize(parts.filter(Boolean).join(" \u0001 "));
  }

  function filterEntries() {
    const q = normalize(state.query.trim());
    if (!q) return state.entries.slice();
    return state.entries.filter((e) => e._blob.includes(q));
  }

  /* ---------------- Rendering: language chips ---------------- */

  function renderChips() {
    els.langBar.innerHTML = `
      <p class="lang-bar-label" id="lang-filter-label">Compare languages</p>
      ${LANGUAGES.map(
        (l) => `
        <button type="button" class="chip" role="button" aria-pressed="true"
                data-lang="${l.code}" style="--chip-color:${l.color}">
          <span class="chip-dot" aria-hidden="true"></span>
          <span class="chip-native">${esc(l.native)}</span>
          <span class="hide-mobile">${esc(l.name)}</span>
          <span class="visually-hidden">toggle ${esc(l.name)}</span>
        </button>`
      ).join("")}
      <span class="chip-actions">
        <button type="button" class="mini-btn" data-action="all">Show all</button>
        <button type="button" class="mini-btn" data-action="core">Mandarin only</button>
      </span>`;

    els.langBar.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => toggleLanguage(chip.dataset.lang, chip));
    });
    els.langBar.querySelectorAll(".mini-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "all") {
          LANGUAGES.forEach((l) => state.activeLangs.add(l.code));
        } else {
          state.activeLangs.clear();
          state.activeLangs.add("zh");
        }
        syncChipStates();
        renderGrid();
        announce(
          btn.dataset.action === "all"
            ? "Showing all six languages."
            : "Showing Chinese / Mandarin only."
        );
      });
    });
  }

  function syncChipStates() {
    els.langBar.querySelectorAll(".chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", state.activeLangs.has(chip.dataset.lang) ? "true" : "false");
    });
  }

  function toggleLanguage(code, chipEl) {
    if (state.activeLangs.has(code)) {
      if (state.activeLangs.size === 1) {
        announce("At least one language must stay visible.");
        shake(chipEl);
        return;
      }
      state.activeLangs.delete(code);
    } else {
      state.activeLangs.add(code);
    }
    chipEl.setAttribute("aria-pressed", state.activeLangs.has(code) ? "true" : "false");
    renderGrid();
    const label = LANGUAGES.find((l) => l.code === code)?.name || code;
    announce(`${label} ${state.activeLangs.has(code) ? "shown" : "hidden"}.`);
  }

  function shake(el) {
    if (prefersReducedMotion() || !el.animate) return;
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 320, easing: "ease-out" }
    );
  }

  /* ---------------- Rendering: cards ---------------- */

  function visibleForms(entry) {
    return LANGUAGES
      .filter((l) => state.activeLangs.has(l.code) && entry.forms[l.code])
      .map((l) => ({ lang: l, ...entry.forms[l.code] }));
  }

  function cardHTML(entry) {
    const forms = visibleForms(entry);
    const confClass = `confidence-${(entry.confidence || "low").toLowerCase()}`;
    const rows = forms
      .map(
        (f) => `
        <li class="form-row">
          <span class="form-lang" style="color:${f.lang.color}">${f.lang.short}</span>
          <span class="form-native${LATIN_LANGS.has(f.lang.code) ? " latin" : ""}">${esc(f.native)}</span>
          <span class="form-roman">${esc(f.roman)}</span>
        </li>`
      )
      .join("");

    return `
      <li>
        <article class="card" tabindex="0" role="button"
                 aria-label="${esc(entry.main)} — ${esc(entry.meaning)}. Open comparison details."
                 data-id="${entry.id}">
          <span class="card-glyph-bg" aria-hidden="true">${esc(entry.main.charAt(0))}</span>
          <header class="card-head">
            <div>
              <span class="card-main">${esc(entry.main)}</span>
              ${entry.alt && entry.alt !== entry.main
                ? `<span class="card-alt" title="alternate / simplified form">· ${esc(entry.alt)}</span>`
                : ""}
            </div>
            <span class="confidence ${confClass}">${esc(entry.confidence)} match</span>
          </header>
          <p class="card-meaning">${esc(entry.meaning)}</p>
          <ul class="card-forms" aria-label="Language forms">${rows}</ul>
          <footer class="card-foot">
            <span>${forms.length} of 6 languages shown</span>
            <span class="card-open-hint">Compare <span aria-hidden="true">→</span></span>
          </footer>
        </article>
      </li>`;
  }

  function renderGrid() {
    const results = filterEntries();
    els.grid.innerHTML = results.map(cardHTML).join("");

    const none = results.length === 0;
    els.emptyState.classList.toggle("visible", none);
    els.grid.style.display = none ? "none" : "";
    els.resultCount.textContent = `${results.length} word${results.length === 1 ? "" : "s"}`;

    els.grid.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id, card));
      card.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          openModal(card.dataset.id, card);
        }
      });
    });
  }

  /* ---------------- Modal / detail view ---------------- */

  const speakerSVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
      <path d="M19 5a9 9 0 0 1 0 14"></path>
    </svg>`;

  function tableHTML(entry) {
    const rows = visibleForms(entry)
      .map((f) => {
        const key = f.pronunciationKey;
        const canSpeak = Boolean(key) && "speechSynthesis" in window;
        return `
          <tr>
            <td>
              <span class="td-lang" style="color:${f.lang.color}">
                <span class="dot" aria-hidden="true" style="background:${f.lang.color}"></span>
                <span style="color:var(--ink-0)">${esc(f.lang.name)}</span>
              </span>
            </td>
            <td class="td-native${LATIN_LANGS.has(f.lang.code) ? " latin" : ""}">${esc(f.native)}</td>
            <td class="td-roman">${esc(f.roman)}</td>
            <td>
              <button type="button" class="audio-btn"
                      data-speak="${esc(f.native)}" data-lang-key="${esc(key || "")}"
                      ${canSpeak ? "" : "disabled"}
                      aria-label="Hear pronunciation in ${esc(f.lang.name)}">
                ${speakerSVG}
              </button>
            </td>
          </tr>`;
      })
      .join("");

    if (!rows) {
      return `<div class="modal-empty-langs">Enable at least one language to see the comparison.</div>`;
    }

    return `
      <table class="compare-table">
        <caption>Cross-language comparison</caption>
        <thead>
          <tr>
            <th scope="col">Language</th>
            <th scope="col">Native form</th>
            <th scope="col">Romanization</th>
            <th scope="col"><span class="visually-hidden">Audio</span>🔊</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function openModal(entryId, triggerEl) {
    const entry = state.entries.find((e) => e.id === entryId);
    if (!entry) return;
    state.openEntryId = entryId;
    state.lastFocused = triggerEl || document.activeElement;

    els.modal.innerHTML = `
      <button type="button" class="modal-close" aria-label="Close comparison view">✕</button>
      <header class="modal-head">
        <span class="modal-glyph" aria-hidden="true">${esc(entry.main)}</span>
        <div>
          <h2 class="modal-title">${esc(entry.meaning)}</h2>
          <p class="modal-sub">
            ${entry.alt && entry.alt !== entry.main ? `Variants: ${esc(entry.main)} · ${esc(entry.alt)} — ` : ""}
            cognate confidence: ${esc(entry.confidence)}
          </p>
        </div>
      </header>
      <aside class="modal-note">
        <strong>Usage &amp; semantic notes</strong>
        ${esc(entry.note)}
      </aside>
      ${tableHTML(entry)}
      <footer class="modal-tags" aria-label="Tags">
        ${(entry.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}
      </footer>`;

    els.overlay.classList.add("open");
    els.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = els.modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", closeModal);
    bindAudioButtons();

    requestAnimationFrame(() => closeBtn.focus());
    announce(`Opened comparison for ${entry.main}, ${entry.meaning}.`);
  }

  function closeModal() {
    if (!els.overlay.classList.contains("open")) return;
    stopSpeech();
    els.overlay.classList.remove("open");
    els.overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.openEntryId = null;
    if (state.lastFocused && document.contains(state.lastFocused)) {
      state.lastFocused.focus();
    }
  }

  /* Simple focus trap inside the modal. */
  function trapFocus(ev) {
    if (ev.key !== "Tab") return;
    const focusables = els.modal.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  /* ---------------- Audio (Web Speech API) ---------------- */

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    els.modal?.querySelectorAll(".audio-btn.speaking").forEach((b) => b.classList.remove("speaking"));
  }

  function speak(btn) {
    if (!("speechSynthesis" in window)) {
      announce("Speech synthesis is not supported in this browser.");
      return;
    }
    const synth = window.speechSynthesis;
    const wasSpeaking = btn.classList.contains("speaking");
    stopSpeech();
    if (wasSpeaking) return; // toggle off

    const text = btn.dataset.speak;
    const langKey = btn.dataset.langKey;
    if (!text || !langKey) {
      announce("No audio mapping available for this form yet (Hokkien coming soon).");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langKey;
    utter.rate = 0.85;
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(langKey.toLowerCase().slice(0, 2)));
    if (match) utter.voice = match;
    utter.onend = () => btn.classList.remove("speaking");
    utter.onerror = () => btn.classList.remove("speaking");
    btn.classList.add("speaking");
    synth.speak(utter);
  }

  function bindAudioButtons() {
    els.modal.querySelectorAll(".audio-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => speak(btn));
    });
  }

  /* ---------------- Search wiring ---------------- */

  let debounceId = null;
  function onSearchInput() {
    state.query = els.searchInput.value;
    els.searchClear.classList.toggle("visible", state.query.length > 0);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      renderGrid();
      const n = filterEntries().length;
      announce(n === 0 ? "No matches found." : `${n} match${n === 1 ? "" : "es"} found.`);
    }, 160);
  }

  function wireSearch() {
    els.searchInput.addEventListener("input", onSearchInput);
    els.searchClear.addEventListener("click", () => {
      els.searchInput.value = "";
      state.query = "";
      els.searchClear.classList.remove("visible");
      renderGrid();
      els.searchInput.focus();
    });
    els.searchInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && els.searchInput.value) {
        els.searchInput.value = "";
        state.query = "";
        els.searchClear.classList.remove("visible");
        renderGrid();
      }
      // "/" focuses search globally; Enter jumps to first result
      if (ev.key === "Enter") {
        const first = els.grid.querySelector(".card");
        if (first) first.focus();
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "/" && document.activeElement !== els.searchInput && !state.openEntryId) {
        ev.preventDefault();
        els.searchInput.focus();
        els.searchInput.select();
      }
      if (ev.key === "Escape" && state.openEntryId) closeModal();
      if (ev.key === "Tab" && state.openEntryId) trapFocus(ev);
    });

    els.overlay.addEventListener("click", (ev) => {
      if (ev.target === els.overlay) closeModal();
    });
  }

  /* ---------------- Data loading ----------------
     Tries the JSON file first (works over http://). Falls back to a
     bundled subset so the prototype also works from file://.           */

  async function loadEntries() {
    try {
      const res = await fetch("data/words.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.entries || [];
    } catch (err) {
      console.warn("Sinoverse: could not fetch data/words.json, using inline fallback.", err);
      return window.SINOVERSE_FALLBACK_ENTRIES || [];
    }
  }

  /* ---------------- Boot ---------------- */

  async function init() {
    const entries = await loadEntries();
    entries.forEach((e) => (e._blob = buildSearchBlob(e)));
    state.entries = entries;

    renderChips();
    wireSearch();
    renderGrid();

    // Warm up voice list (some browsers populate it asynchronously).
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
