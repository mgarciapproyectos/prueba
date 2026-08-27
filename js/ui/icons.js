const Icon = {
  back: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2.8 13.5 8l5.7.6-4.3 3.8 1.2 5.6L11 15.1 5.9 18l1.2-5.6L2.8 8.6 8.5 8 11 2.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.2" stroke="currentColor" stroke-width="1.6"/><path d="m12.2 12.2 3.4 3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  send: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13V4M5.5 7.5L9 4l3.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  scan: '<svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect x="1" y="1" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 4.5v7M8 4.5v7M11 4.5v7M14.5 4.5v7" stroke="currentColor" stroke-width="1.3"/></svg>',
  mic: '<svg width="16" height="20" viewBox="0 0 16 20" fill="none"><rect x="5" y="1.5" width="6" height="10" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 9.5a5.5 5.5 0 0 0 11 0M8 15v3.5M5.5 18.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M7 5V3.5A1 1 0 0 1 8 2.5h2a1 1 0 0 1 1 1V5m2.5 0-.7 9.5a1.5 1.5 0 0 1-1.5 1.4H6.7a1.5 1.5 0 0 1-1.5-1.4L4.5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v11M2.5 8h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  img: '<svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="3" y="4.5" width="24" height="21" rx="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="10.5" cy="11.5" r="2.4" stroke="currentColor" stroke-width="1.5"/><path d="m5.5 23 6.5-6.5 4 4 4.5-4.5 4 4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  puzzle: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M10 3a2 2 0 0 1 4 0v1h4a1 1 0 0 1 1 1v4h1a2 2 0 0 1 0 4h-1v4a1 1 0 0 1-1 1h-4v1a2 2 0 0 1-4 0v-1H6a1 1 0 0 1-1-1v-4H4a2 2 0 0 1 0-4h1V5a1 1 0 0 1 1-1h4V3z" fill="#111"/></svg>',
  thumbU: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M6 9.5v7H3.5v-7H6zm0 0 3-5.7a1.6 1.6 0 0 1 3 .8v3h3.5a1.5 1.5 0 0 1 1.5 1.8l-1 5.3a1.5 1.5 0 0 1-1.5 1.3H6" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  thumbD: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" style="transform:rotate(180deg)"><path d="M6 9.5v7H3.5v-7H6zm0 0 3-5.7a1.6 1.6 0 0 1 3 .8v3h3.5a1.5 1.5 0 0 1 1.5 1.8l-1 5.3a1.5 1.5 0 0 1-1.5 1.3H6" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  furniture(size = 86) {
    return `<svg width="${size}" height="${Math.round(size * 1.25)}" viewBox="0 0 88 110" fill="none">
      <rect x="8" y="8" width="72" height="88" rx="4" stroke="#111" stroke-width="2.6"/>
      <path d="M16 14h56" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="18" y="26" width="52" height="24" rx="2" stroke="#111" stroke-width="2.2"/>
      <rect x="38" y="36" width="12" height="4" rx="2" stroke="#111" stroke-width="1.8"/>
      <rect x="18" y="58" width="52" height="24" rx="2" stroke="#111" stroke-width="2.2"/>
      <rect x="38" y="68" width="12" height="4" rx="2" stroke="#111" stroke-width="1.8"/>
      <rect x="14" y="96" width="7" height="8" stroke="#111" stroke-width="2"/>
      <rect x="67" y="96" width="7" height="8" stroke="#111" stroke-width="2"/>
    </svg>`;
  }
};
