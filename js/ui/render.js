const Render = {
  specTable(rows) {
    return `<div class="spec-table">${rows.map(([k, v]) =>
      `<div class="spec-row"><span class="k">${k}</span><span class="v">${v}</span></div>`
    ).join('')}</div>`;
  },

  prodCard(p, opts = {}) {
    const off = p.off ? `<span class="pc-off">-${p.off}%</span><span class="pc-tagline">Precio Internet</span>` : '';
    const old = p.oldPrice ? `<span class="pc-old">${Format.money(p.oldPrice)}</span>` : '';
    const selected = !!opts.selected;
    return `<div class="prod-card">
      <div class="pc-img">${Icon.img}</div>
      <div class="pc-body">
        <div><div class="pc-name">${p.name}</div><div class="pc-brand">${p.brand}</div></div>
        <div class="pc-pricing">${off}</div>
        <div class="pc-pricing"><span class="pc-price">${Format.money(p.price)}${p.unit || ''}</span>${old}</div>
        <button class="pc-cta${selected ? ' is-selected' : ''}" data-action="${opts.action}" data-value="${p.id}">${selected ? 'Seleccionado' : 'Elegir'}</button>
        <button class="pc-link" data-action="toast" data-value="Detalle de producto (demo)">Ver detalles</button>
      </div>
    </div>`;
  },

  feedbackRow(label = 'Califica las recomendaciones') {
    return `<div class="feedback-row">
      <button data-action="fb" data-value="up">${Icon.thumbU}</button>
      <button data-action="fb" data-value="down">${Icon.thumbD}</button>
      <span>${label}</span>
    </div>`;
  },

  boardSummary(b) {
    return `<div class="board-card">
      <div class="bc-fig">${Icon.furniture(64)}</div>
      ${this.specTable([
        ['Tablero', b.name],
        ['Marca', b.brand],
        ['Espesor', b.thickness + ' mm'],
        ['Dimensiones', b.dimension],
        ['Precio', Format.money(b.price)]
      ])}
    </div>`;
  },

  /* Tarjeta de corte — Test 2 (sheet + inline) */
  cutCard(piece, num, canDelete, removeAction) {
    const delAttrs = canDelete
      ? `data-action="${removeAction}" data-value="${piece.id}"`
      : 'disabled aria-disabled="true"';
    return `<div class="cut-card" data-piece-id="${piece.id}">
      <div class="ck-head">
        <h4>Pieza ${num}</h4>
        <button type="button" class="ck-del${canDelete ? '' : ' is-disabled'}" ${delAttrs}>${Icon.trash} Eliminar</button>
      </div>
      <div class="ck-grid">
        <div class="field">
          <label>Ancho (cm)</label>
          <input type="number" inputmode="numeric" class="js-w" value="${piece.w}" aria-label="Ancho en centímetros" />
        </div>
        <div class="field">
          <label>Alto (cm)</label>
          <input type="number" inputmode="numeric" class="js-h" value="${piece.h}" aria-label="Alto en centímetros" />
        </div>
        <div class="field qty">
          <label>Cant.</label>
          <input type="number" inputmode="numeric" class="js-qty" value="${piece.qty}" min="1" aria-label="Cantidad" />
        </div>
      </div>
    </div>`;
  },

  /* Carousel de piezas — Test 2 variante B (inline) */
  pieceCarouselCard(piece, num, total, canDelete, removeAction) {
    const delAttrs = canDelete
      ? `data-action="${removeAction}" data-value="${piece.id}"`
      : 'disabled aria-disabled="true"';
    return `<div class="piece-card" data-piece-id="${piece.id}">
      <div class="pcd-top">
        <div class="pcd-eyebrow">Pieza ${num} de ${total}</div>
        <button type="button" class="pcd-del${canDelete ? '' : ' is-disabled'}" ${delAttrs}>${Icon.trash} Eliminar</button>
      </div>
      <h4>Define las medidas de tu pieza</h4>
      <div class="pcd-grid">
        <div class="field">
          <label>Ancho (cm)</label>
          <input type="number" inputmode="numeric" class="js-w" value="${piece.w}" aria-label="Ancho en centímetros" />
        </div>
        <div class="field">
          <label>Largo (cm)</label>
          <input type="number" inputmode="numeric" class="js-h" value="${piece.h}" aria-label="Largo en centímetros" />
        </div>
      </div>
      <div class="pcd-qty">
        <span>Cantidad:</span>
        <div class="stepper">
          <button type="button" data-action="inlineQty" data-value="${piece.id}:-1" aria-label="Disminuir cantidad">−</button>
          <span class="stv js-qty">${piece.qty}</span>
          <button type="button" data-action="inlineQty" data-value="${piece.id}:1" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
    </div>`;
  },

  carouselDots(count, activeIndex = 0) {
    return `<div class="dots js-dots" aria-hidden="true">${
      Array.from({ length: count }, (_, i) =>
        `<i class="${i === activeIndex ? 'is-on' : ''}" data-index="${i}"></i>`
      ).join('')
    }</div>`;
  },

  taskDone() {
    return `<div class="task-done">✓ Tarea completada — ¡gracias!</div>`;
  }
};
