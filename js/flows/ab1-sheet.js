/* A/B Test 1 · Variante A — Bottom sheet */

const S = { cfg: { ...T1.defaults }, chosenRef: null, cfgOpened: false };

window.addEventListener('DOMContentLoaded', () => {
  bindShell();
  t1Context(afterContext);
});

async function afterContext() {
  Screen.set('config');
  await Chat.bot(COPY.bridge, { ms: 900 });
  guidedReply('Abre el panel inferior para ver las opciones. También puedes escribirme.');
  setTimeout(tryOpenCfgSheet, 1200);
  setTimeout(tryOpenCfgSheet, 30000);
}

function tryOpenCfgSheet() {
  if (!S.cfgOpened && !Sheet.isOpen) openCfgSheet();
}

function showReopenChips(which) {
  Chat.chips([
    { label: 'Mostrar recomendación', action: 'showReco', value: which === 'price' ? 'price' : 'cfg' },
    { label: 'Ver características', action: 'showReco', value: 'cfg' }
  ]);
  guidedReply('Toca uno de los botones de arriba para reabrir el panel.');
}

Actions.showReco = v => {
  if (v === 'price') openPriceSheet();
  else openCfgSheet();
};

function cfgGroupsHtml() {
  const group = (label, items, field) =>
    `<div class="cfg-group"><div class="cfg-label">${label}</div><div class="chips-row">` +
    items.map(i =>
      `<button class="chip${String(S.cfg[field]) === String(i.value) ? ' is-selected' : ''}" data-action="cfgPick" data-value="${field}:${i.value}">${i.label}</button>`
    ).join('') +
    `</div></div>`;

  return (
    group('Color', T1.colors.map(c => ({ label: c.name, value: c.id })), 'color') +
    group('Material', T1.materials.map(m => ({ label: m.name, value: m.id })), 'material') +
    group('Espesor', T1.thickness.map(t => ({ label: t + ' mm', value: t })), 'thickness') +
    group('Dimensión', T1.dims.map(d => ({ label: d.label, value: d.id })), 'dimension')
  );
}

function renderCfgSheet() {
  const sh = Sheet.top;
  sh.querySelector('.js-groups').innerHTML = cfgGroupsHtml();
  const minPrice = Math.min(...T1.refs(S.cfg).map(r => r.price));
  sh.querySelector('.js-price').textContent = Format.money(minPrice);
}

function openCfgSheet() {
  S.cfgOpened = true;
  Screen.set('config');
  guidedReply('Completa tu selección en el panel inferior.');
  Actions.cfgPick = v => {
    const [field, val] = v.split(':');
    S.cfg[field] = field === 'thickness' ? parseInt(val, 10) : val;
    renderCfgSheet();
  };
  S.advancing = false;
  Actions.cfgBack = () => Sheet.close();
  Actions.cfgContinue = () => { S.advancing = true; Sheet.close(); openPriceSheet(); };

  Sheet.open(`
    <div class="sheet-scroll">
      <div class="sheet-head">
        <button class="sh-back" data-action="cfgBack">${Icon.back}</button>
        <div class="sheet-title">
          <h3>Para tu mueble de TV</h3>
          <div class="sh-sub">Te recomiendo estas características</div>
        </div>
      </div>
      <div class="js-groups" style="display:flex;flex-direction:column;gap:18px"></div>
    </div>
    <div class="sheet-footer">
      <div class="sf-price"><div class="sf-label">Precios desde</div><div class="sf-value js-price"></div></div>
      <button class="btn btn-primary" data-action="cfgContinue">Continuar</button>
    </div>`,
    {
      tall: true,
      onClose: () => { if (!S.advancing) showReopenChips('cfg'); }
    });
  renderCfgSheet();
}

function openPriceSheet() {
  S.chosenRef = null;
  Screen.set('precio');
  guidedReply('Elige un tablero en el panel inferior con «Elegir».');

  const render = () => {
    const sh = Sheet.top;
    const refs = T1.refs(S.cfg);
    const card = r => `
      <div class="prod-card${S.chosenRef === r.id ? ' is-selected' : ''}" style="flex-direction:row">
        <div class="pc-img" style="flex:0 0 116px;height:auto">${Icon.img}</div>
        <div class="pc-body" style="flex:1">
          <div><div class="pc-name">${r.name}</div><div class="pc-brand">${r.brand}</div></div>
          <div class="pc-pricing"><span class="pc-off">-${r.off}%</span><span class="pc-tagline">Precio Internet</span></div>
          <div class="pc-pricing"><span class="pc-price">${Format.money(r.price)}</span><span class="pc-old">${Format.money(r.oldPrice)}</span></div>
          <button class="pc-cta" data-action="refPick" data-value="${r.id}">Elegir</button>
          <button class="pc-link" data-action="toast" data-value="Detalle de producto (demo)">Ver detalles</button>
        </div>
      </div>`;
    sh.querySelector('.js-refs').innerHTML =
      `<div class="reco-head">${Icon.puzzle} Te recomiendo este tablero:</div>` + card(refs[0]) +
      `<div class="alt-label">También disponible en:</div>` + refs.slice(1).map(card).join('');

    const continueBtn = sh.querySelector('[data-action="refContinue"]');
    if (S.chosenRef) {
      const chosen = refs.find(r => r.id === S.chosenRef);
      sh.querySelector('.js-price').textContent = Format.money(chosen.price);
      continueBtn.textContent = `Continuar con ${chosen.brand}`;
      continueBtn.classList.remove('is-disabled');
    } else {
      sh.querySelector('.js-price').textContent = '—';
      continueBtn.textContent = 'Continuar con Tablemac';
      continueBtn.classList.add('is-disabled');
    }
  };

  Actions.refPick = v => { S.chosenRef = v; render(); };
  S.advancing = false;
  Actions.refBack = () => { S.advancing = true; Sheet.close(); openCfgSheet(); };
  Actions.refContinue = async () => {
    if (!S.chosenRef) return;
    S.advancing = true;
    Sheet.close();
    Chat.user(`Continuar con Tablemac · ${T1.colorName(S.chosenRef).split(' ')[0]}`);
    await t1Complete(S.cfg, S.chosenRef);
  };

  Sheet.open(`
    <div class="sheet-scroll">
      <div class="sheet-head">
        <button class="sh-back" data-action="refBack">${Icon.back}</button>
        <div class="sheet-title">
          <h3>Para tu mueble de TV</h3>
          <div class="sh-sub">te recomiendo esta referencia</div>
        </div>
      </div>
      <div class="js-refs" style="display:flex;flex-direction:column;gap:12px"></div>
    </div>
    <div class="sheet-footer">
      <div class="sf-price"><div class="sf-label">Precio Internet</div><div class="sf-value js-price"></div></div>
      <button class="btn btn-primary is-disabled" data-action="refContinue">Continuar con Tablemac</button>
    </div>`,
    {
      tall: true,
      onClose: () => { if (!S.advancing) showReopenChips('price'); }
    });
  render();
}
