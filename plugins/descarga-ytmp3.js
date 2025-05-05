import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Oh no... ¡necesito un enlace de YouTube!*\n\nEjemplo: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];
  try {
    await conn.reply(m.chat, `${emoji} *Dame un momento, estoy preparando tu canción con mucho cariño...*`, m);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`);
    const data = await res.json();

    if (!data.status || !data.download) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio del video.*\nDetalles: ${data.message || 'Error desconocido'}`, m);
    }

    const audioURL = data.download;
    const title = data.title || 'audio.mp3';

    await conn.sendFile(m.chat, audioURL, 'audio.mp3', `${emoji} *Listo, aquí tienes tu canción!* ♪\n\n*Título:* ${title}\n*Formato:* MP3`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `⚠️ *¡Ups! Algo salió mal.*\nDetalles: ${error.message}`, m);
  }
};

handler.help = ['ytmp3'].map((v) => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
