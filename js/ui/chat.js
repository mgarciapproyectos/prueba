const Chat = {
  _min: 0,
  onSend: null,
  persistentSend: false,
  get body() { return document.getElementById('chatBody'); },

  stamp() {
    const total = 630 + this._min;
    if (Math.random() > 0.55) this._min++;
    const h = Math.floor(total / 60);
    const m = String(total % 60).padStart(2, '0');
    return `${h}:${m}`;
  },

  scroll() {
    requestAnimationFrame(() => { this.body.scrollTop = this.body.scrollHeight; });
  },

  el(html) {
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  },

  append(node) {
    this.body.appendChild(node);
    this.scroll();
    return node;
  },

  async typing(ms = 700) {
    const t = this.append(this.el('<div class="typing"><i></i><i></i><i></i></div>'));
    await new Promise(r => setTimeout(r, ms));
    t.remove();
  },

  async bot(html, opts = {}) {
    if (!opts.instant) await this.typing(opts.ms || 650);
    const wide = opts.wide ? ' msg-wide' : '';
    return this.append(this.el(
      `<div class="msg msg-bot${wide}"><div class="bubble">${html}<span class="stamp">${this.stamp()}</span></div></div>`
    ));
  },

  user(html, opts = {}) {
    const wide = opts.wide ? ' msg-wide' : '';
    return this.append(this.el(
      `<div class="msg msg-user${wide}"><div class="bubble">${html}<span class="stamp">${this.stamp()}</span></div></div>`
    ));
  },

  block(html) { return this.append(this.el(`<div class="chips-block">${html}</div>`)); },

  chips(items, opts = {}) {
    const eyebrow = opts.eyebrow ? `<div class="chips-eyebrow">${opts.eyebrow}</div>` : '';
    const html = items.map(i => {
      const sw = i.swatch ? `<span class="swatch" style="background:${i.swatch}"></span>` : '';
      const cls = ['chip', i.disabled ? 'is-disabled' : ''].filter(Boolean).join(' ');
      return `<button class="${cls}" data-action="${i.action}" data-value="${i.value ?? i.label}">${sw}${i.label}</button>`;
    }).join('');
    return this.append(this.el(`<div class="chips-block">${eyebrow}<div class="chips-row">${html}</div></div>`));
  },

  resolveChips(container, btn) {
    container.classList.add('is-done');
    if (btn) btn.classList.add('is-selected');
  },

  commitChip(btn, label) {
    const block = btn.closest('.chips-block');
    if (block) {
      block.querySelectorAll('.chip').forEach(c => c.classList.remove('is-selected'));
      btn.classList.add('is-selected');
    }
    block?.remove();
    if (label) this.user(label);
  },

  clearChips() {
    this.body.querySelectorAll('.chips-block').forEach(el => el.remove());
  },

  stopInput() {
    this.persistentSend = false;
    this.onSend = null;
    this.updateSendBtn();
  },

  setInput({ placeholder, hint, onSend, persistent } = {}) {
    const inp = document.getElementById('chatInput');
    if (placeholder !== undefined) inp.placeholder = placeholder;
    this.onSend = onSend || null;
    this.persistentSend = !!persistent && !!onSend;
    const hintEl = document.getElementById('inputHint');
    if (hintEl && hint !== undefined) hintEl.textContent = hint || '';
    this.updateSendBtn();
  },

  setDone(placeholder = 'Tarea finalizada') {
    this.persistentSend = false;
    this.onSend = null;
    const inp = document.getElementById('chatInput');
    inp.placeholder = placeholder;
    inp.value = '';
    const hintEl = document.getElementById('inputHint');
    if (hintEl) hintEl.textContent = '';
    this.updateSendBtn();
  },

  updateSendBtn() {
    const btn = document.getElementById('sendBtn');
    const inp = document.getElementById('chatInput');
    if (!btn || !inp) return;
    const active = !!this.onSend;
    const hasText = inp.value.trim().length > 0;
    btn.disabled = !active || !hasText;
    btn.classList.toggle('is-ready', active && hasText);
  },

  sendCurrent() {
    const inp = document.getElementById('chatInput');
    const text = inp.value.trim();
    if (!text || !this.onSend) return;
    inp.value = '';
    const fn = this.onSend;
    if (!this.persistentSend) this.onSend = null;
    this.updateSendBtn();
    fn(text);
  }
};
