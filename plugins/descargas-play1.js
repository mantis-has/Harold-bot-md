import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play2') {
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
      // Paso 1: Obtener información del video
      const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true`);
      const infoData = await infoRes.json();

      if (infoData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje}`, m);
      }

      const { title, quality, thumbnail } = infoData.result;

      const msg = `
🎥 Preparando Video 🎥
────────────────────
📌 Título: ${title}
🖥️ Calidad: ${quality || 'Máxima disponible'}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      // Paso 2: Descargar video
      const downloadRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false`);
      const downloadData = await downloadRes.json();

      if (downloadData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al descargar el video: ${downloadData.mensaje}`, m);
      }

      const fileUrl = downloadData.result.download;
      const fileName = `${title || 'video'}.mp4`;

      await conn.sendMessage(m.chat, {
        video: { url: fileUrl },
        mimetype: 'video/mp4',
        fileName
      }, { quoted: m });

    } catch (err) {
      console.error('Error al contactar la API:', err);
      conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
    }
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;