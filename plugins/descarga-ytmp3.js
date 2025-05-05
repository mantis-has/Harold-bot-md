import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Necesito un link de YouTube para convertirlo a MP3.*\n\nUso: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];

  try {
    await conn.reply(m.chat, `${emoji} *Convirtiendo magia de YouTube a MP3... espera un poco, ¡está en proceso!*`, m);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`);
    const data = await res.json();

    if (!data.status || !data.download) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio.*\nRazón: ${data.message || 'desconocida'}`, m);
    }

    const audioRes = await fetch(data.download);
    const audioBuffer = await audioRes.buffer();

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: `${(data.title || 'audio')}.mp3`,
      mimetype: 'audio/mp3',
      ptt: false // true si lo quieres como nota de voz
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, `⚠️ *Oops! Falló la conversión.*\nDetalles: ${error.message}`, m);
  }
};

handler.help = ['ytmp3'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
