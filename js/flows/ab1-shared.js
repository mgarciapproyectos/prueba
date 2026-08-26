/* A/B Test 1 — contexto compartido */

async function t1Context(onDone) {
  await Chat.bot(COPY.welcome);
  Chat.chips([{ label: 'Necesito ayuda', action: 't1Help', primary: true }]);
  Chat.setInput({
    placeholder: 'Escribe tu respuesta aquí…',
    onSend: t => t1Describe(t, onDone)
  });
  Actions.t1Help = async (v, btn) => {
    Chat.commitChip(btn, 'Necesito ayuda');
    await Chat.bot('Cuéntame qué quieres construir, para qué espacio, y te ayudo a elegir el tablero ideal.');
    Chat.setInput({
      placeholder: 'Escribe tu respuesta aquí…',
      onSend: t => t1Describe(t, onDone)
    });
  };
}

async function t1Describe(text, onDone) {
  Chat.user(text);
  await Chat.bot(COPY.measureConfirm);
  Chat.chips([
    { label: 'Son las medidas de la pieza', action: 't1Measure', value: 'pieza', primary: true },
    { label: 'Son las del mueble armado', action: 't1Measure', value: 'mueble' }
  ]);
  Chat.setInput({ placeholder: 'Escribe tu respuesta aquí…', onSend: null });
  Actions.t1Measure = (v, btn) => {
    Chat.commitChip(btn, v === 'pieza' ? 'Son las medidas de la pieza' : 'Son las del mueble armado');
    onDone();
  };
}

async function t1Complete(cfg, refColorId) {
  const price = T1.price(cfg, refColorId);
  await Chat.bot(
    `✅ <span class="b">¡Excelente elección! Tu tablero quedó seleccionado:</span>` +
    Render.specTable([
      ['Tablero', `MDP Melamina · ${T1.colorName(refColorId).split(' ')[0]}`],
      ['Marca', 'Tablemac'],
      ['Espesor', cfg.thickness + ' mm'],
      ['Dimensiones', T1.dimLabel(cfg.dimension)],
      ['Precio', Format.money(price)]
    ]),
    { wide: true }
  );
  Chat.append(Chat.el(Render.taskDone()));
  Chat.setInput({ placeholder: 'Tarea finalizada', onSend: null });
  toast('Tarea completada');
}
