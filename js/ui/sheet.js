const Sheet = {
  stack: [],

  open(html, opts = {}) {
    const phone = document.querySelector('.phone');
    const backdrop = Chat.el('<div class="sheet-backdrop"></div>');
    const tall = opts.tall ? ' sheet-tall' : '';
    const sheet = Chat.el(`<div class="sheet${tall}"><div class="sheet-handle"><i></i></div>${html}</div>`);
    phone.appendChild(backdrop);
    phone.appendChild(sheet);
    requestAnimationFrame(() => {
      backdrop.classList.add('is-on');
      sheet.classList.add('is-on');
    });
    const entry = { backdrop, sheet, onClose: opts.onClose || null };
    this.stack.push(entry);
    if (!opts.lockBackdrop) backdrop.addEventListener('click', () => this.close());
    return sheet;
  },

  close() {
    const entry = this.stack.pop();
    if (!entry) return;
    entry.backdrop.classList.remove('is-on');
    entry.sheet.classList.remove('is-on');
    setTimeout(() => {
      entry.backdrop.remove();
      entry.sheet.remove();
    }, 320);
    if (entry.onClose) entry.onClose();
  },

  closeAll() { while (this.stack.length) this.close(); },

  get top() { return this.stack[this.stack.length - 1]?.sheet || null; },

  get isOpen() { return this.stack.length > 0; }
};
