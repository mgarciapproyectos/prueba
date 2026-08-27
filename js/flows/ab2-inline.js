/* A/B Test 2 · Variante B — Carousel inline en el chat */

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t2Start(showInlineForm);
});

function showInlineForm() {
  S2.resetPieces();
  let activeIndex = 0;
  Screen.set('formulario');
  guidedReply('Ingresa las medidas en el formulario y toca «Confirmar pieza».');

  const getWrap = () => Chat.body.querySelector('.js-inline-pieces');

  const renderCarousel = (scrollToIndex = null) => {
    const wrap = getWrap();
    if (!wrap) return;
    const slot = wrap.querySelector('.js-carousel-slot');
    slot.innerHTML = PieceList.renderCarousel(S2.pieces, 'inlineRemovePiece', activeIndex);
    bindCarouselScroll(wrap);
    if (scrollToIndex !== null) scrollCarouselTo(wrap, scrollToIndex);
  };

  Chat.block(`
    <div class="pieces-wrap js-inline-pieces">
      <div class="js-carousel-slot"></div>
      <div class="pieces-actions">
        <button type="button" class="btn btn-primary" data-action="inlineConfirm">Confirmar pieza</button>
        <button type="button" class="btn btn-ghost" data-action="inlineAddPiece">${Icon.plus} Agregar pieza</button>
      </div>
    </div>`);

  Actions.inlineQty = (v) => {
    const [id, delta] = v.split(':');
    const card = getWrap()?.querySelector(`.piece-card[data-piece-id="${id}"]`);
    if (!card) return;
    const span = card.querySelector('.js-qty');
    let qty = parseInt(span.textContent, 10);
    qty = Math.max(1, qty + parseInt(delta, 10));
    span.textContent = qty;
  };

  Actions.inlineAddPiece = () => {
    const wrap = getWrap();
    const root = wrap.querySelector('.js-carousel');
    S2.pieces = PieceList.syncFromCarousel(root);
    S2.pieces = PieceList.addPiece(S2.pieces);
    activeIndex = S2.pieces.length - 1;
    renderCarousel(activeIndex);
  };

  Actions.inlineRemovePiece = id => {
    if (S2.pieces.length <= 1) return;
    const wrap = getWrap();
    const root = wrap.querySelector('.js-carousel');
    S2.pieces = PieceList.syncFromCarousel(root);
    const idx = S2.pieces.findIndex(p => String(p.id) === String(id));
    S2.pieces = PieceList.removePiece(S2.pieces, id);
    activeIndex = Math.max(0, Math.min(activeIndex, S2.pieces.length - 1));
    if (idx <= activeIndex && activeIndex > 0) activeIndex--;
    renderCarousel(activeIndex);
  };

  Actions.inlineConfirm = async () => {
    const wrap = getWrap();
    const root = wrap.querySelector('.js-carousel');
    S2.pieces = PieceList.syncFromCarousel(root);
    wrap.classList.add('is-done');
    wrap.querySelectorAll('button, input').forEach(el => { el.disabled = true; });
    Chat.stopInput();
    Chat.user(PieceList.confirmLabel(S2.pieces));
    await t2Complete(S2.pieces);
  };

  renderCarousel(0);
}

function bindCarouselScroll(wrap) {
  const carousel = wrap.querySelector('.js-carousel');
  const dots = wrap.querySelectorAll('.js-dots i');
  if (!carousel || !dots.length) return;

  carousel.addEventListener('scroll', () => {
    const cards = carousel.querySelectorAll('.piece-card');
    const mid = carousel.scrollLeft + carousel.clientWidth / 2;
    let active = 0;
    cards.forEach((card, i) => {
      const cx = card.offsetLeft + card.offsetWidth / 2;
      if (Math.abs(cx - mid) < card.offsetWidth / 2) active = i;
    });
    dots.forEach((d, i) => d.classList.toggle('is-on', i === active));
  }, { passive: true });
}

function scrollCarouselTo(wrap, index) {
  requestAnimationFrame(() => {
    const carousel = wrap.querySelector('.js-carousel');
    const card = carousel?.querySelectorAll('.piece-card')[index];
    if (card) carousel.scrollTo({ left: card.offsetLeft - 14, behavior: 'smooth' });
  });
}
