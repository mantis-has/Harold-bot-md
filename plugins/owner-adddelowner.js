const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  // Emojis por si no estaban definidos
  const emoji = '✅';
  const emoji2 = '❌';

  // Verifica a quién se quiere agregar o quitar
  const who = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false));
  if (!who) {
    return conn.reply(
      m.chat,
      `${emoji2} Por favor, menciona a un usuario para agregar o quitar como owner.`,
      m
    );
  }

  switch (command) {
    case 'addowner':
      // Evita agregar duplicados
      if (global.owner.some(([num]) => num === who)) {
        return conn.reply(m.chat, `${emoji2} Ese número ya está en la lista de owners.`, m);
      }

      global.owner.push([who]); // Añadir como array: [jid]
      await conn.reply(
        m.chat,
        `${emoji} Usuario agregado como owner correctamente.`,
        m
      );
      break;

    case 'delowner':
      const index = global.owner.findIndex(([num]) => num === who);
      if (index !== -1) {
        global.owner.splice(index, 1);
        await conn.reply(
          m.chat,
          `${emoji} Usuario eliminado de la lista de owners.`,
          m
        );
      } else {
        await conn.reply(
          m.chat,
          `${emoji2} Ese número no se encuentra en la lista de owners.`,
          m
        );
      }
      break;
  }
};

// Comandos que activa
handler.command = ['addowner', 'delowner'];
handler.rowner = true; // Solo los dueños pueden usar este comando
export default handler;
