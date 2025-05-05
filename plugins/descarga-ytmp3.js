import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Por favor, ingresa un enlace válido de YouTube.*\n\nEjemplo: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];
  try {
    await conn.reply(m.chat, `${emoji} *Espérame tantito... estoy convirtiendo el video en mp3 para ti...*`, m);

    let res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`);
    let data = await res.json();

    if (!data || !data.result || !data.result.audio) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio del video.*`, m);
    }

    const audioURL = data.result.audio;
    const title = data.result.title || 'audio.mp3';

    await conn.sendFile(m.chat, audioURL, 'audio.mp3', `${emoji} *Aquí tienes tu canción!* 🎶\n\n*Título:* ${title}`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `⚠️ *Ocurrió un error:* ${error.message}`, m);
  }
};

handler.help = ['ytmp3'].map((v) => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
