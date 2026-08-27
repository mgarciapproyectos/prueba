/* A/B Test 2 · Variante A — Formulario en bottom sheet */

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t2Start(openMeasureSheet);
});

function openMeasureSheet() {
  S2.resetPieces();
  guidedReply('Ingresa las medidas en el panel inferior y toca «Confirmar pieza».');

  const renderPieces = () => {
    const root = Sheet.top.querySelector('.js-pieces');
    root.innerHTML = PieceList.renderCards(S2.pieces, 'sheetRemovePiece');
  };

  Actions.sheetBack = () => Sheet.close();

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
    { tall: true });

  renderPieces();
}
