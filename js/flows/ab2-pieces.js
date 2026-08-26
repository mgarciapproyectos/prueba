/* Test 2 — lista de piezas compartida (sheet + inline) */

const PieceList = {
  syncFromDOM(root) {
    return Array.from(root.querySelectorAll('.cut-card')).map((card, i) => ({
      id: card.dataset.pieceId || S2.pieces[i]?.id || i + 1,
      ...readPieceForm(card)
    }));
  },

  syncFromCarousel(root) {
    return Array.from(root.querySelectorAll('.piece-card')).map((card, i) => ({
      id: card.dataset.pieceId || S2.pieces[i]?.id || i + 1,
      ...readPieceForm(card)
    }));
  },

  renderCards(pieces, removeAction) {
    const canDelete = pieces.length > 1;
    return pieces.map((p, i) => Render.cutCard(p, i + 1, canDelete, removeAction)).join('');
  },

  renderCarousel(pieces, removeAction, activeIndex = 0) {
    const total = pieces.length;
    const canDelete = total > 1;
    const singleClass = total === 1 ? ' is-single' : '';
    const cards = pieces.map((p, i) =>
      Render.pieceCarouselCard(p, i + 1, total, canDelete, removeAction)
    ).join('');
    const dots = total > 1 ? Render.carouselDots(total, activeIndex) : '';
    return `<div class="pieces-carousel js-carousel${singleClass}">${cards}</div>${dots}`;
  },

  addPiece(pieces) {
    return [...pieces, { id: Date.now(), w: 100, h: 120, qty: 1 }];
  },

  removePiece(pieces, id) {
    if (pieces.length <= 1) return pieces;
    return pieces.filter(p => String(p.id) !== String(id));
  },

  confirmLabel(pieces) {
    if (pieces.length === 1) {
      const p = pieces[0];
      return `Confirmar pieza · ${p.w} × ${p.h} cm · ${p.qty} ud.`;
    }
    return `Confirmar ${pieces.length} piezas`;
  }
};
