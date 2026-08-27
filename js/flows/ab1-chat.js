/* A/B Test 1 · Variante B — Chat paso a paso + cards */

const S = { cfg: { ...T1.defaults } };

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t1Context(afterContext);
});

async function afterContext() {
  Screen.set('material');
  await Chat.bot(COPY.t1MaterialIntro, { ms: 900 });
  Chat.chips([
    { label: 'Melamina', action: 'material', value: 'melamina' },
    { label: 'Triplex enchapado', action: 'material', value: 'triplex' }
  ]);
  guidedChoice({
    nudge: '¿Melamina o triplex? Cuéntame cuál prefieres o elige arriba.',
    resolve: t => /melamina|mdp/i.test(t) ? 'melamina' : /triplex|enchapado/i.test(t) ? 'triplex' : null,
    onResolved: v => Actions.material(v, null)
  });
}

Actions.material = async (v, btn) => {
  if (btn) Chat.commitChip(btn, v === 'melamina' ? 'Melamina' : 'Triplex enchapado');
  else Chat.user(v === 'melamina' ? 'Melamina' : 'Triplex enchapado');
  S.cfg.material = v;
  await Chat.bot(
    `Me gusta. Para ese material manejamos estos espesores:` +
    `<p>15 mm → ligero, ideal para muebles de TV<br>18 mm → más firme, aguanta más peso</p>` +
    `<p>¿Cuál prefieres? Te recomiendo 18 mm si tu TV es de más de 20 kg</p>`
  );
  Screen.set('espesor');
  Chat.chips(T1.thickness.map(t => ({
    label: t + ' mm',
    action: 'thickness',
    value: t
  })));
  guidedChoice({
    nudge: '¿15 mm o 18 mm? Escríbeme o elige arriba.',
    resolve: t => {
      if (/15|quince/.test(t)) return '15';
      if (/18|dieciocho/.test(t)) return '18';
      return null;
    },
    onResolved: v => Actions.thickness(v, null)
  });
};

Actions.thickness = async (v, btn) => {
  if (btn) Chat.commitChip(btn, v + ' mm');
  else Chat.user(v + ' mm');
  S.cfg.thickness = parseInt(v, 10);
  await Chat.bot(
    `Con ${T1.matLabel(S.cfg.material).toLowerCase()} de ${v} mm, los tonos café disponibles son:` +
    `<ul><li><span class="b">Roble</span> (claro, vetas suaves)</li><li><span class="b">Nogal Ceniza</span> (medio, veta marcada)</li><li><span class="b">Wengue</span> (oscuro, elegante)</li></ul>` +
    `<p>¿Cuál se acerca más al café que tienes en mente?</p>`
  );
  Screen.set('color');
  Chat.chips(T1.colors.map(c => ({
    label: c.name === 'Nogal ceniza' ? 'Nogal Ceniza' : c.name,
    action: 'color',
    value: c.id,
    swatch: c.swatch
  })));
  guidedChoice({
    nudge: '¿Roble, Nogal Ceniza o Wengue? Escríbeme o elige arriba.',
    resolve: t => {
      const s = t.toLowerCase();
      if (/nogal|ceniza/.test(s)) return 'nogal';
      if (/roble/.test(s)) return 'roble';
      if (/wengue|wenge/.test(s)) return 'wengue';
      return null;
    },
    onResolved: v => Actions.color(v, null)
  });
};

Actions.color = async (v, btn) => {
  if (btn) Chat.commitChip(btn, T1.colorName(v));
  else Chat.user(T1.colorName(v));
  S.cfg.color = v;
  await Chat.bot(
    `${T1.colorName(v)}, excelente elección 👌` +
    `<p>Para ${T1.boardTypeLabel(S.cfg)} ${T1.colorName(v)} de ${S.cfg.thickness} mm, estas son las dimensiones de tablero disponibles:</p>` +
    `<p>● <span class="b">2440 × 1220 mm</span> → la más común<br>` +
    `● <span class="b">2440 × 1830 mm</span> → más ancho<br>` +
    `● <span class="b">1830 × 2500 mm</span> → formato XL</p>` +
    `<p>¿Cuál se ajusta mejor a tu mueble de TV?</p>`
  );
  Screen.set('dimension');
  Chat.chips(T1.dims.map(d => ({
    label: d.label,
    action: 'dimension',
    value: d.id
  })));
  guidedChoice({
    nudge: '¿Cuál dimensión prefieres? Escríbeme o elige arriba.',
    resolve: t => {
      const s = t.replace(/\s/g, '');
      if (/2440.?1220|1220.?2440/.test(s)) return 'd1';
      if (/2440.?1830|1830.?2440/.test(s)) return 'd2';
      if (/1830.?2500|2500.?1830/.test(s)) return 'd3';
      if (/común|comun|estándar|standard|2440/.test(t.toLowerCase())) return 'd1';
      return null;
    },
    onResolved: v => Actions.dimension(v, null)
  });
};

Actions.dimension = async (v, btn) => {
  if (btn) Chat.commitChip(btn, T1.dimLabel(v));
  else Chat.user(T1.dimLabel(v));
  S.cfg.dimension = v;
  await Chat.bot(
    `Perfecto, ya tenemos tu selección:` +
    `<ul><li>Material: ${T1.matLabel(S.cfg.material)}</li><li>Espesor: ${S.cfg.thickness} mm</li><li>Color: ${T1.colorName(S.cfg.color)}</li><li>Dimensiones: ${T1.dimLabel(v)}</li></ul>` +
    `<p>Estos son los tableros que tenemos disponibles con esas características:</p>`
  );
  Screen.set('tableros');
  const refs = T1.refs(S.cfg);
  Chat.block(
    `<div class="reco-head">${Icon.puzzle} Te recomiendo estos tableros:</div>` +
    `<div class="reco-sub">${refs.length} opciones encontradas</div>` +
    `<div class="stacked">${refs.map(r =>
      Render.prodCard(
        { id: r.id, name: r.name, brand: r.brand, price: r.price, off: r.off, oldPrice: r.oldPrice },
        { action: 'refPick' }
      )
    ).join('')}</div>` +
    Render.feedbackRow()
  );
  guidedReply('Toca «Elegir» en uno de los tableros, o dime cuál prefieres.');
};

Actions.refPick = async v => {
  Chat.stopInput();
  const ref = T1.ref(S.cfg, v);
  Chat.user(`Elegir · ${ref.brand}`);
  await t1Complete(S.cfg, v);
};
