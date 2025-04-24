import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim()) {
    return conn.reply(m.chat, '🎬 Por favor, escribe el nombre del video o pega la URL de YouTube.', m);
  }

  let quality = '480p';
  const qualityMatch = text.match(/full\s*(\d{3,4}p)/i);
  if (qualityMatch) {
    quality = qualityMatch[1];
  } else {
    const match = text.match(/(\d{3,4}p)/i);
    if (match) quality = match[1];
  }

  const query = text.replace(/full\s*\d{3,4}p?/i, '').replace(/\d{3,4}p/i, '').trim();
  let youtubeUrl = '';

  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
    youtubeUrl = query;
  } else {
    try {
      const search = await yts(query);
      if (!search.videos.length) return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
      youtubeUrl = search.videos[0].url;
    } catch (err) {
      console.error('Error en búsqueda:', err);
      return conn.reply(m.chat, '❌ Error al buscar el video.', m);
    }
  }

  try {
    const infoUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true&calidad=${quality}`;
    const infoRes = await fetch(infoUrl);
    const infoData = await infoRes.json();

    if (!infoData.title || !infoData.video_quality) {
      return conn.reply(m.chat, '❌ No se pudo obtener información del video.', m);
    }

    const { title, video_quality, thumbnail } = infoData;

    const msg = `
🎥 Preparando Video 🎥
────────────────────
📌 Título: ${title}
📺 Calidad: ${video_quality}
⏳ Descargando...
    `.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

    const downloadUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&calidad=${quality}`;
    const downloadRes = await fetch(downloadUrl);
    const downloadData = await downloadRes.json();

    if (!downloadData.result || !downloadData.result.filename) {
      return conn.reply(m.chat, '❌ No se pudo obtener el archivo del video.', m);
    }

    const fileUrl = downloadData.result.filename;
    const fileSize = downloadData.result.size || 0;
    const fileName = `${title}.mp4`;

    const fileMsg = {
      [fileSize > 100 ? 'document' : 'video']: { url: fileUrl },
      mimetype: 'video/mp4',
      fileName
    };

    await conn.sendMessage(m.chat, fileMsg, { quoted: m });

  } catch (err) {
    console.error('Error al contactar la API:', err);
    conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre/url> [calidad]'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;