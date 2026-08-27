/* A/B Test 2 · Variante A — Formulario en bottom sheet */

const S2Sheet = { advancing: false };

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t2Start(openMeasureSheet);
});

function showMeasureReopen() {
  Chat.chips([{ label: 'Ingresar medidas', action: 'sheetReopen' }]);
  guidedChoice({
    nudge: 'Toca «Ingresar medidas» arriba o escríbeme «abrir panel» para continuar.',
    resolve: t => /panel|medidas|abrir|formulario|de nuevo|otra vez/i.test(t) ? 'reopen' : null,
    onResolved: () => {
      Chat.user('Abrir panel');
      openMeasureSheet();
    }
  });
}

Actions.sheetReopen = (_v, btn) => {
  Chat.commitChip(btn, 'Ingresar medidas');
  Chat.stopInput();
  openMeasureSheet();
};

function openMeasureSheet() {
  if (Sheet.isOpen) return;

  S2Sheet.advancing = false;
  Screen.set('formulario');
  guidedReply('Ingresa las medidas en el panel inferior y toca «Confirmar pieza».');

  const renderPieces = () => {
    const root = Sheet.top.querySelector('.js-pieces');
    root.innerHTML = PieceList.renderCards(S2.pieces, 'sheetRemovePiece');
  };

  Actions.sheetBack = () => {
    const root = Sheet.top?.querySelector('.js-pieces');
    if (root) S2.pieces = PieceList.syncFromDOM(root);
    Sheet.close();
  };

  Actions.sheetAddPiece = () => {
    const root = Sheet.top.querySelector('.js-pieces');
    S2.pieces = PieceList.syncFromDOM(root);
    S2.pieces = PieceList.addPiece(S2.pieces);
    renderPieces();
  };

  Actions.sheetRemovePiece = id => {
    if (S2.pieces.length <= 1) return;
    const root = Sheet.top.querySelector('.js-pieces');
    S2.pieces = PieceList.syncFromDOM(root);
    S2.pieces = PieceList.removePiece(S2.pieces, id);
    renderPieces();
  };

  Actions.sheetConfirm = async () => {
    const root = Sheet.top.querySelector('.js-pieces');
    S2.pieces = PieceList.syncFromDOM(root);
    S2Sheet.advancing = true;
    Sheet.close();
    Chat.stopInput();
    Chat.user(PieceList.confirmLabel(S2.pieces));
    await t2Complete(S2.pieces);
  };

  Sheet.open(`
    <div class="sheet-scroll">
      <div class="sheet-head">
        <button class="sh-back" data-action="sheetBack">${Icon.back}</button>
        <div class="sheet-title">
          <h3>Para tu mueble de TV</h3>
          <div class="sh-sub">Ingresa los cortes de cada una de tus piezas</div>
        </div>
      </div>
      <div class="js-pieces pieces-stack"></div>
    </div>
    <div class="sheet-footer sf-stack">
      <button type="button" class="add-piece" data-action="sheetAddPiece">${Icon.plus} Agregar pieza</button>
      <button type="button" class="btn btn-primary" data-action="sheetConfirm">Confirmar pieza</button>
    </div>`,
    {
      tall: true,
      onClose: () => {
        if (!S2Sheet.advancing) showMeasureReopen();
      }
    });

  renderPieces();
}
