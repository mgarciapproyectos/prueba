/* Registro global de acciones — compartido entre todos los flujos */
const Actions = window.Actions || {};
window.Actions = Actions;

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('is-on'), 2200);
}

function bindShell() {
  document.getElementById('icBack').innerHTML = Icon.back;
  document.getElementById('icStar').innerHTML = Icon.star;
  document.getElementById('sendHit').innerHTML = Icon.search;
  document.getElementById('icScan').innerHTML = Icon.scan;
  document.getElementById('sendHit')?.addEventListener('click', () => Chat.sendCurrent());
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'toast') { toast(btn.dataset.value); return; }
  if (action === 'fb') {
    btn.closest('.feedback-row').querySelectorAll('button').forEach(b => b.classList.remove('is-on'));
    btn.classList.add('is-on');
    toast('¡Gracias por tu feedback!');
    return;
  }
  if (typeof Actions !== 'undefined' && Actions[action]) Actions[action](btn.dataset.value, btn);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'chatInput') Chat.sendCurrent();
});

function readPieceForm(root) {
  const w = parseInt(root.querySelector('.js-w').value, 10);
  const h = parseInt(root.querySelector('.js-h').value, 10);
  const qtyEl = root.querySelector('.js-qty');
  const qty = qtyEl.tagName === 'INPUT'
    ? parseInt(qtyEl.value, 10)
    : parseInt(qtyEl.textContent, 10);
  return { w, h, qty };
}

function bindQtyStepper(root, prefix, onChange) {
  Actions[`${prefix}Qty`] = (v, btn) => {
    const span = root.querySelector('.js-qty');
    let qty = parseInt(span.textContent, 10);
    qty = Math.max(1, qty + parseInt(v, 10));
    span.textContent = qty;
    if (onChange) onChange(readPieceForm(root));
  };
}
