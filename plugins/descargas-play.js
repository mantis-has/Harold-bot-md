import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
  }

  const query = text.trim() || args[0];
  let youtubeUrl;

  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
    youtubeUrl = query;
  } else {
    try {
      const search = await yts(query);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (error) {
      console.error('Error al buscar el video:', error);
      return conn.reply(m.chat, `❌ Error al buscar el video: ${error.message}`, m);
    }
  }

  try {
    // Paso 1: Obtener info desde la API
    const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true&info=true`);
    const infoData = await infoRes.json();

    if (infoData.status !== 'success') {
      return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje}`, m);
    }

    const { title, quality, thumbnail } = infoData.result;

    const msg = `
🎶 Preparando Audio 🎶
────────────────────
📌 Título: ${title}
🎧 Calidad: ${quality || 'Máxima disponible'}
⏳ Descargando...
    `.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

    // Paso 2: Descargar audio
    const downloadRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true`);
    const downloadData = await downloadRes.json();

    if (downloadData.status !== 'success') {
      return conn.reply(m.chat, `❌ Error al descargar el audio: ${downloadData.mensaje}`, m);
    }

    const fileUrl = downloadData.result.download;
    const fileName = `${title || 'audio'}.mp3`;

    await conn.sendMessage(m.chat, {
      audio: { url: fileUrl },
      mimetype: 'audio/mpeg',
      fileName
    }, { quoted: m });

  } catch (err) {
    console.error('Error al contactar la API:', err);
    conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
  }
};

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;