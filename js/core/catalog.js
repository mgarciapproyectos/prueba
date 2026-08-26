/* LEPTON figma-cursor · catálogo y copy compartido (A/B Test 1 & 2) */

const COPY = {
  bridge:
    '¡Perfecto! Para un mueble de TV de interior, el tono café con veta visible le da un aire cálido y elegante. Te muestro las opciones que mejor se ajustan a tu proyecto.',
  materialChoice:
    '¡Perfecto! Para un mueble de TV de interior, el tono café con veta visible le da un aire muy cálido y elegante.' +
    '<p>Para que elijas bien, de los materiales que manejamos, estos dos encajan con lo que buscas:</p>' +
    '<p><span class="b">Triplex enchapado</span> → la veta es real, única y natural. Pero necesita barniz o aceite para protegerlo.</p>' +
    '<p><span class="b">MDP melamínico texturado</span> → imita la veta, es resistente a rayones y no requiere mantenimiento. Ideal para un mueble de uso diario.</p>' +
    '<p>Mi recomendación: si quieres algo práctico y duradero, ve por el melamínico. Si buscas esa veta 100% auténtica, el triplex es tu opción.</p>' +
    '<p>¿Cuál prefieres?</p>',
  welcome:
    '¡Hola! Soy tu asistente de tableros. Te ayudo a elegir y dimensionar el tablero perfecto para tu proyecto. ¿Ya sabes qué tablero necesitas?',
  measureConfirm:
    '¡Me encanta esa elección! Antes de recomendarte materiales, quiero confirmar las medidas que mencionaste:' +
    '<p>📐 <span class="b">120 cm (alto) × 100 cm (ancho)</span></p>' +
    '<p>¿Estas son las medidas de la pieza que necesitas, o son las medidas del mueble armado? Esto es importante para calcular bien las piezas.</p>',
  t2Ask:
    'Ahora vamos con las medidas de tu pieza. ¿Cuánto mide la pieza que necesitas cortar?',
  t2Confirm:
    'Perfecto, entonces vamos directo. Tu pieza: <span class="b">120 × 100 cm</span>. Validé contra tu tablero de 2440 × 1220 mm y cabe sin problema. Valida las medidas de tu pieza.'
};

const T1 = {
  colors: [
    { id: 'nogal', name: 'Nogal ceniza', swatch: '#4a3628' },
    { id: 'roble', name: 'Roble', swatch: '#d9a05b' },
    { id: 'wengue', name: 'Wengue', swatch: '#3b2a20' }
  ],
  materials: [
    { id: 'mdf', name: 'MDF' },
    { id: 'melamina', name: 'Melamina' }
  ],
  thickness: [15, 18, 20],
  dims: [
    { id: 'd1', label: '2440 × 1220 mm', f: 1 },
    { id: 'd2', label: '2440 × 1830 mm', f: 1.35 },
    { id: 'd3', label: '1830 × 2500 mm', f: 1.55 }
  ],
  defaults: { color: 'nogal', material: 'melamina', thickness: 18, dimension: 'd1' },
  base: { nogal: 191900, roble: 234900, wengue: 249900 },
  thickDelta: { 15: -22000, 18: 0, 20: 18000 },
  matDelta: { melamina: 0, mdf: -12000 },

  price(cfg, colorId) {
    const f = this.dims.find(d => d.id === cfg.dimension).f;
    const raw = (this.base[colorId] + this.thickDelta[cfg.thickness] + this.matDelta[cfg.material]) * f;
    return Math.round(raw / 100) * 100;
  },

  colorName(id) { return this.colors.find(c => c.id === id)?.name || id; },
  matName(id) { return this.materials.find(m => m.id === id)?.name || id; },
  dimLabel(id) { return this.dims.find(d => d.id === id).label; },

  refs(cfg) {
    const other = cfg.color === 'nogal' ? 'roble' : 'nogal';
    const mk = (colorId, off) => {
      const price = this.price(cfg, colorId);
      return {
        id: colorId,
        name: `MDP Melamina · ${this.colorName(colorId).split(' ')[0]}`,
        brand: 'Tablemac',
        price,
        off,
        oldPrice: Math.round(price / (1 - off / 100) / 100) * 100
      };
    };
    return [mk(cfg.color, 15), mk(other, 10)];
  }
};

const T2 = {
  board: {
    name: 'Melamina · Nogal Ceniza',
    brand: 'Tablemac',
    thickness: 18,
    dimension: '2440 × 1220 mm',
    price: 191900
  },
  piece: { w: 100, h: 120, qty: 1, label: 'Pieza 1' }
};
