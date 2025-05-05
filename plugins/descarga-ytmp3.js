import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Ingresa un link de YouTube para convertirlo a MP3.*\n\nUso: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];

  try {
    await conn.reply(m.chat, `${emoji} *Convirtiendo el video a audio mp3... por favor espera.*`, m);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`);
    const json = await res.json();

    if (!json.status || !json.download) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio.*\nRazón: ${json.message || 'desconocida'}`, m);
    }

    const audioResponse = await fetch(json.download);
    const audioBuffer = await audioResponse.buffer();

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mp4', // WhatsApp acepta más fácilmente este mimetype
      ptt: false, // false = se manda como música, true = como nota de voz
      fileName: `${json.title || 'audio'}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: json.title,
          body: 'Ruby Hoshino MP3 Bot ✨',
          thumbnailUrl: 'https://files.catbox.moe/e5801p.jpg', // Imagen decorativa (opcional)
          mediaType: 2,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ *Error inesperado.*\nMensaje: ${e.message}`, m);
  }
};

handler.help = ['ytmp3'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
