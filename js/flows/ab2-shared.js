/* A/B Test 2 — contexto compartido (tablero ya seleccionado) */

const S2 = {
  pieces: [],

  resetPieces() {
    S2.pieces = [{ id: 1, w: T2.piece.w, h: T2.piece.h, qty: T2.piece.qty }];
  }
};

async function t2Start(onMeasuresSent) {
  await Chat.bot(COPY.t2Ask);
  Chat.setInput({
    placeholder: 'Escribe las medidas de tu pieza…',
    onSend: text => t2UserMeasures(text, onMeasuresSent)
  });
}

async function t2UserMeasures(text, onMeasuresSent) {
  Chat.user(text);
  S2.resetPieces();
  await Chat.bot(COPY.t2Confirm);
  onMeasuresSent();
}

async function t2Complete(pieces) {
  const list = Array.isArray(pieces) ? pieces : [pieces];
  const rows = list.length === 1
    ? [
        ['Pieza', 'Pieza 1'],
        ['Ancho', list[0].w + ' cm'],
        ['Alto', list[0].h + ' cm'],
        ['Cantidad', String(list[0].qty)]
      ]
    : list.map((p, i) => [`Pieza ${i + 1}`, `${p.w} × ${p.h} cm · ${p.qty} ud.`]);

  await Chat.bot(
    `✅ <span class="b">Medidas confirmadas</span>` + Render.specTable(rows),
    { wide: true }
  );
  Chat.append(Chat.el(Render.taskDone()));
  Chat.setInput({ placeholder: 'Tarea finalizada', onSend: null });
  toast('Tarea completada');
}
