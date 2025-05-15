const ro = 30;

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  const tiempoCooldown = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
  const now = Date.now();

  if (user.lastrob2 && now - user.lastrob2 < tiempoCooldown) {
    const timeLeft = msToTime(user.lastrob2 + tiempoCooldown - now);
    conn.reply(m.chat, `${emoji3} Debes esperar ${timeLeft} para usar *#rob* de nuevo.`, m);
    return;
  }

  let who;
  if (m.isGroup) {
    who = m.mentionedJid && m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : null;
  } else {
    who = m.chat;
  }

  if (!who) {
    conn.reply(m.chat, `${emoji} Debes mencionar a alguien para intentar robarle.`, m);
    return;
  }

  if (!(who in global.db.data.users)) {
    conn.reply(m.chat, `${emoji2} El usuario no se encuentra en mi base de datos.`, m);
    return;
  }

  const target = global.db.data.users[who];
  const rob = Math.floor(Math.random() * ro);

  if (target.coin < rob) {
    conn.reply(m.chat, `${emoji2} @${who.split`@`[0]} no tiene suficientes *${moneda}* fuera del banco como para que valga la pena intentar robar.`, m, { mentions: [who] });
    return;
  }

  user.coin += rob;
  target.coin -= rob;
  user.lastrob2 = now;

  conn.reply(m.chat, `${emoji} Le robaste *${rob}* ${moneda} a @${who.split`@`[0]} 💸`, m, { mentions: [who] });
};

handler.help = ['rob'];
handler.tags = ['rpg'];
handler.command = ['robar', 'steal', 'rob'];
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  return `${hours} Hora(s) ${minutes} Minuto(s) ${seconds} Segundo(s)`;
}
