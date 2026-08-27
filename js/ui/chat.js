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

  _wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  _htmlTokens(html) {
    const tokens = [];
    const re = /(<[^>]+>)|([^<]+)/g;
    let m;
    while ((m = re.exec(html))) tokens.push(m[1] || m[2]);
    return tokens;
  },

  async _streamHtml(el, html, opts = {}) {
    const plainLen = html.replace(/<[^>]+>/g, '').length;
    const charMs = opts.charMs ?? Math.max(10, Math.min(20, Math.round(1400 / Math.max(plainLen, 1))));
    const step = plainLen > 280 ? 3 : plainLen > 140 ? 2 : 1;
    let out = '';

    el.classList.add('is-streaming');
    for (const token of this._htmlTokens(html)) {
      if (token.startsWith('<')) {
        out += token;
        el.innerHTML = out;
        this.scroll();
        continue;
      }
      for (let i = 0; i < token.length; i += step) {
        out += token.slice(i, i + step);
        el.innerHTML = out;
        if (i % (step * 4) === 0) this.scroll();
        await this._wait(charMs);
      }
    }
    el.classList.remove('is-streaming');
    el.innerHTML = html;
    this.scroll();
  },

  async typing(ms = 700) {
    const t = this.append(this.el('<div class="typing"><i></i><i></i><i></i></div>'));
    await this._wait(ms);
    t.remove();
  },

  async bot(html, opts = {}) {
    if (!opts.instant) await this.typing(opts.ms || 650);
    const wide = opts.wide ? ' msg-wide' : '';
    const msg = this.append(this.el(
      `<div class="msg msg-bot${wide}">` +
      `<div class="bubble"><div class="js-stream"></div><span class="stamp is-pending">${this.stamp()}</span></div></div>`
    ));
    const target = msg.querySelector('.js-stream');
    const stamp = msg.querySelector('.stamp');

    if (opts.stream === false || opts.instant) {
      target.innerHTML = html;
    } else {
      await this._streamHtml(target, html, opts);
    }

    stamp.classList.remove('is-pending');
    this.scroll();
    return msg;
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
