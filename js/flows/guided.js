/* Patrones de input conversacional — compartidos Test 1 & 2 */

function guidedReply(nudge) {
  Chat.setInput({
    placeholder: 'Escribe tu respuesta aquí…',
    persistent: true,
    onSend: async text => {
      Chat.user(text);
      await Chat.bot(nudge, { charMs: 8 });
    }
  });
}

function guidedChoice({ nudge, resolve, onResolved }) {
  Chat.setInput({
    placeholder: 'Escribe tu respuesta aquí…',
    persistent: true,
    onSend: async text => {
      Chat.user(text);
      const value = resolve(text);
      if (value != null) {
        Chat.clearChips();
        Chat.stopInput();
        await onResolved(value);
        return;
      }
      await Chat.bot(nudge, { charMs: 8 });
    }
  });
}

function guidedFree(onSend) {
  Chat.setInput({
    placeholder: 'Escribe tu respuesta aquí…',
    onSend
  });
}
