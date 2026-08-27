/* A/B Test 1 — contexto compartido */

async function t1Context(onDone) {
  Screen.init('inicio');
  await Chat.bot(COPY.welcome);
  Chat.chips([{ label: 'Necesito ayuda', action: 't1Help' }]);
  Chat.setInput({
    placeholder: COPY.t1UserPrompt,
    onSend: t => t1Describe(t, onDone)
  });
  Actions.t1Help = async (v, btn) => {
    Chat.commitChip(btn, 'Necesito ayuda');
    await Chat.bot('Cuéntame qué quieres construir, para qué espacio, y te ayudo a elegir el tablero ideal.');
    Chat.setInput({
      placeholder: COPY.t1UserPrompt,
      onSend: t => t1Describe(t, onDone)
    });
  };
}

async function t1Describe(text, onDone) {
  Chat.user(text);
  Chat.clearChips();
  Chat.stopInput();
  await onDone();
}

async function t1Complete(cfg, brandId) {
  const ref = T1.ref(cfg, brandId);
  await Chat.bot(
    `✅ <span class="b">¡Excelente elección! Tu tablero quedó seleccionado:</span>` +
    Render.specTable([
      ['Tablero', ref.name],
      ['Marca', ref.brand],
      ['Espesor', cfg.thickness + ' mm'],
      ['Dimensiones', T1.dimLabel(cfg.dimension)],
      ['Precio', Format.money(ref.price)]
    ]),
    { wide: true, stream: false }
  );
  Chat.append(Chat.el(Render.taskDone()));
  Chat.setDone();
  Screen.set('completado');
  toast('Tarea completada');
}
