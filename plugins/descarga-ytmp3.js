import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Ingresa un link de YouTube para convertirlo a MP3.*\n\nUso: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];

  try {
    await conn.reply(m.chat, `${emoji} *Convirtiendo el video a audio mp3... por favor espera.*`, m);

    // Paso 1: obtener datos de la API
    const res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`);
    const json = await res.json();

    if (!json.status || !json.download) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio del video.*\n⚠️ API Falló.`, m);
    }

    // Paso 2: Descargar el audio
    const audioRes = await fetch(json.download);

    if (!audioRes.ok) {
      throw new Error('No se pudo descargar el archivo MP3 desde el enlace');
    }

    const audioBuffer = await audioRes.buffer();

    // Paso 3: Enviar audio
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${json.title || 'audio'}.mp3`,
    }, { quoted: m });

  } catch (e) {
    console.error('[YTMP3 ERROR]', e);
    conn.reply(m.chat, `❌ *Error al convertir el video.*\n📄 Mensaje: ${e.message}`, m);
  }
};

handler.help = ['ytmp3'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
