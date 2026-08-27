/* Pantallas clave para Maze — ?step= en la URL (pushState) */

const Screen = {
  set(step, opts = {}) {
    if (!step) return;
    const url = new URL(window.location.href);
    url.searchParams.set('step', step);
    const state = { step };
    if (opts.replace) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  },

  init(step = 'inicio') {
    const url = new URL(window.location.href);
    if (!url.searchParams.get('step')) this.set(step, { replace: true });
  }
};
