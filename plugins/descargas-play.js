import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
    }

    const query = text.trim() || args[0];
    let youtubeUrl;

    // Si es URL directa
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
      // Paso 1: Obtener información del video
      const infoUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true&info=true`;
      const infoRes = await fetch(infoUrl);
      const infoData = await infoRes.json();

      if (!infoData.result || !infoData.result.title) {
        return conn.reply(m.chat, `❌ No se pudo obtener información del video.`, m);
      }

      const { title, quality, thumbnail } = infoData.result;

      const infoMsg = `
🎶 Preparando Audio 🎶
────────────────────
📌 Título: ${title}
🎧 Calidad: ${quality || 'Desconocida'}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMsg }, { quoted: m });

      // Paso 2: Descargar audio
      const downloadUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true`;
      const downloadRes = await fetch(downloadUrl);
      const downloadData = await downloadRes.json();

      if (!downloadData.result || !downloadData.result.filename) {
        return conn.reply(m.chat, `❌ No se pudo obtener el archivo de audio.`, m);
      }

      const fileUrl = downloadData.result.filename;
      const fileSize = downloadData.result.size || 0; // en MB
      const fileName = `${title || 'audio'}.mp3`;

      const fileMsg = {
        [fileSize > 100 ? 'document' : 'audio']: { url: fileUrl },
        mimetype: 'audio/mpeg',
        fileName
      };

      await conn.sendMessage(m.chat, fileMsg, { quoted: m });

    } catch (err) {
      console.error('Error al contactar la API:', err);
      conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
    }
  }
};

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;