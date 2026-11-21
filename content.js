(() => {
  const api = typeof browser !== "undefined" ? browser : chrome;
  const root = document.documentElement;

  const DEFAULTS = { shorts: true, members: true };
  let settings = { ...DEFAULTS };

  function applySettings() {
    root.toggleAttribute("data-cy-shorts", settings.shorts);
    root.toggleAttribute("data-cy-members", settings.members);
    if (settings.shorts) redirectShorts();
    if (settings.members) scanMembers();
  }

  // --- Ajustes (se sincronizan con el popup en tiempo real) ---
  api.storage.local.get(DEFAULTS).then((s) => {
    settings = { ...DEFAULTS, ...s };
    applySettings();
  });
  api.storage.onChanged.addListener((changes) => {
    for (const k of Object.keys(changes)) settings[k] = changes[k].newValue;
    applySettings();
  });
  // Aplica los valores por defecto cuanto antes para evitar parpadeos
  applySettings();

  // --- Redirección /shorts/ID -> /watch?v=ID ---
  function redirectShorts() {
    if (!settings.shorts) return;
    const m = location.pathname.match(/^\/shorts\/([\w-]+)/);
    if (m) location.replace(`${location.origin}/watch?v=${m[1]}`);
  }
  window.addEventListener("yt-navigate-start", redirectShorts, true);
  window.addEventListener("yt-navigate-finish", redirectShorts, true);
  window.addEventListener("popstate", redirectShorts);

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      redirectShorts();
    }
  }, 500);

  // --- Detección de "Solo para miembros" por texto de la insignia ---
  const ITEM_SELECTOR = [
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-rich-item-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "yt-lockup-view-model",
  ].join(",");

  const BADGE_SELECTOR = [
    "ytd-badge-supported-renderer",
    "yt-badge-shape",
    "badge-shape",
    ".yt-badge-shape",
    ".badge-shape-wiz",
    "[class*='badge']",
  ].join(",");

  const MEMBERS_RE =
    /members only|members-only|solo para miembros|exclusivo para miembros|solo miembros|réservé aux membres|nur für mitglieder|solo per i membri|somente para membros|apenas para membros|alleen voor leden|tylko dla członków|только для участников|メンバー限定|회원 전용|仅限会员/i;

  function scanMembers() {
    if (!settings.members) return;
    document.querySelectorAll(`${ITEM_SELECTOR}:not([data-cy-checked])`).forEach((item) => {
      // Espera a que el elemento tenga contenido antes de darlo por revisado
      if (!item.querySelector("a, #video-title")) return;
      item.setAttribute("data-cy-checked", "1");
      for (const b of item.querySelectorAll(BADGE_SELECTOR)) {
        const text = `${b.getAttribute("aria-label") || ""} ${b.textContent || ""}`;
        if (MEMBERS_RE.test(text)) {
          item.setAttribute("data-cy-members-item", "1");
          break;
        }
      }
    });
  }

  let timer = null;
  const observer = new MutationObserver(() => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      scanMembers();
    }, 250);
  });
  function startObserver() {
    observer.observe(document.body || root, { childList: true, subtree: true });
  }
  if (document.body) startObserver();
  else document.addEventListener("DOMContentLoaded", startObserver, { once: true });
})();
