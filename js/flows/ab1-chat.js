/* A/B Test 1 · Variante B — Chat paso a paso + cards */

const S = { cfg: { ...T1.defaults } };

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t1Context(afterContext);
});

async function afterContext() {
  await Chat.bot(COPY.materialChoice, { ms: 900 });
  Chat.chips([
    { label: 'Melamina', action: 'material', value: 'melamina', primary: true },
    { label: 'Triplex enchapado', action: 'material', value: 'triplex' }
  ]);
}

Actions.material = async (v, btn) => {
  Chat.commitChip(btn, v === 'melamina' ? 'Melamina' : 'Triplex enchapado');
  S.cfg.material = 'melamina';
  if (v === 'triplex') {
    await Chat.bot('El triplex enchapado lo manejamos bajo pedido. Para este proyecto sigamos con melamina, que tenemos disponible de inmediato. 😉');
  }
  await Chat.bot(
    `Me gusta. Para ese material manejamos estos espesores:` +
    `<p>15 mm → ligero, ideal para muebles de TV<br>18 mm → más firme, aguanta más peso</p>` +
    `<p>¿Cuál prefieres? Te recomiendo 18 mm si tu TV es de más de 20 kg</p>`
  );
  Chat.chips(T1.thickness.map(t => ({
    label: t + ' mm',
    action: 'thickness',
    value: t,
    primary: t === 18
  })));
};

Actions.thickness = async (v, btn) => {
  Chat.commitChip(btn, v + ' mm');
  S.cfg.thickness = parseInt(v, 10);
  await Chat.bot(
    `Con melamina de ${v} mm, los tonos café disponibles son:` +
    `<ul><li><span class="b">Roble</span> (claro, vetas suaves)</li><li><span class="b">Nogal Ceniza</span> (medio, veta marcada)</li><li><span class="b">Wengue</span> (oscuro, elegante)</li></ul>` +
    `<p>¿Cuál se acerca más al café que tienes en mente?</p>`
  );
  Chat.chips(T1.colors.map(c => ({
    label: c.name === 'Nogal ceniza' ? 'Nogal Ceniza' : c.name,
    action: 'color',
    value: c.id,
    swatch: c.swatch,
    primary: c.id === 'nogal'
  })));
};

Actions.color = async (v, btn) => {
  Chat.commitChip(btn, T1.colorName(v));
  S.cfg.color = v;
  await Chat.bot(
    `${T1.colorName(v)}, excelente elección 👌` +
    `<p>Para MDP Melamina ${T1.colorName(v)} de ${S.cfg.thickness} mm, estas son las dimensiones de tablero disponibles:</p>` +
    `<p>● <span class="b">2440 × 1220 mm</span> → la más común<br>` +
    `● <span class="b">2440 × 1830 mm</span> → más ancho<br>` +
    `● <span class="b">1830 × 2500 mm</span> → formato XL</p>` +
    `<p>¿Cuál se ajusta mejor a tu mueble de TV?</p>`
  );
  Chat.chips(T1.dims.map(d => ({
    label: d.label,
    action: 'dimension',
    value: d.id,
    primary: d.id === 'd1'
  })));
};

Actions.dimension = async (v, btn) => {
  Chat.commitChip(btn, T1.dimLabel(v));
  S.cfg.dimension = v;
  await Chat.bot(
    `Perfecto, ya tenemos tu selección:` +
    `<ul><li>Material: Melamina</li><li>Espesor: ${S.cfg.thickness} mm</li><li>Color: ${T1.colorName(S.cfg.color)}</li><li>Dimensiones: ${T1.dimLabel(v)}</li></ul>` +
    `<p>Estos son los tableros que tenemos disponibles con esas características:</p>`
  );
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
};

Actions.refPick = async v => {
  Chat.user(`Elegir · ${T1.colorName(v).split(' ')[0]}`);
  await t1Complete(S.cfg, v);
};
