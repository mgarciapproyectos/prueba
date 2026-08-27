/* A/B Test 1 — contexto compartido */

function t1ParseMeasure(text) {
  const t = text.toLowerCase();
  if (/pieza|solo la pieza|del corte|la pieza/.test(t)) return 'pieza';
  if (/mueble|armado|completo|terminado/.test(t)) return 'mueble';
  if (/^(sí|si|confirmo|correcto|exacto|así es)/.test(t)) return 'pieza';
  return null;
}

function t1GuidedMeasure(onDone) {
  Chat.setInput({
    placeholder: 'Escribe tu respuesta aquí…',
    persistent: true,
    onSend: async text => {
      Chat.user(text);
      const intent = t1ParseMeasure(text);
      if (intent) {
        Chat.clearChips();
        Chat.stopInput();
        onDone();
        return;
      }
      await Chat.bot(
        'Gracias. ¿Esas medidas son de la <span class="b">pieza</span> o del <span class="b">mueble armado</span>? ' +
        'Puedes escribirme o usar los botones de arriba.'
      );
    }
  });
}

async function t1Context(onDone) {
  Screen.init('inicio');
  await Chat.bot(COPY.welcome);
  Chat.chips([{ label: 'Necesito ayuda', action: 't1Help' }]);
  guidedFree(t => t1Describe(t, onDone));
  Actions.t1Help = async (v, btn) => {
    Chat.commitChip(btn, 'Necesito ayuda');
    await Chat.bot('Cuéntame qué quieres construir, para qué espacio, y te ayudo a elegir el tablero ideal.');
    guidedFree(t => t1Describe(t, onDone));
  };
}

async function t1Describe(text, onDone) {
  Chat.user(text);
  Screen.set('medidas');
  await Chat.bot(COPY.measureConfirm);
  Chat.chips([
    { label: 'Son las medidas de la pieza', action: 't1Measure', value: 'pieza' },
    { label: 'Son las del mueble armado', action: 't1Measure', value: 'mueble' }
  ]);
  t1GuidedMeasure(onDone);
  Actions.t1Measure = (v, btn) => {
    Chat.commitChip(btn, v === 'pieza' ? 'Son las medidas de la pieza' : 'Son las del mueble armado');
    Chat.stopInput();
    onDone();
  };
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
