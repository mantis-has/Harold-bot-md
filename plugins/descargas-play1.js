import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play2') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, '🔎 Por favor, escribe el nombre o la URL del video, opcionalmente con la calidad (ej: full 720p).', m);
    }

    const query = text.trim();
    let quality = '480p'; // por defecto
    let youtubeUrl;

    // Detectar calidad
    const qualityMatch = query.match(/full\s*(\d{3,4}p)?/i);
    if (qualityMatch) {
      quality = qualityMatch[1] || '1080p';
    }

    // Eliminar "full" del texto si existe para buscar correctamente
    const cleanedQuery = query.replace(/full\s*\d{0,4}p?/i, '').trim();

    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(cleanedQuery)) {
      youtubeUrl = cleanedQuery;
    } else {
      try {
        const search = await yts(cleanedQuery);
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
      // Paso 1: Pedir información para mostrar antes de descargar
      const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true&calidad=${quality}`);
      const infoData = await infoRes.json();

      if (infoData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje}`, m);
      }

      const { title, quality: finalQuality, thumbnail } = infoData.result;

      const msg = `
📹 Preparando Video
────────────────────
🎬 Título: ${title}
📺 Calidad: ${finalQuality || quality}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      // Paso 2: Descargar el video real
      const dlRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&calidad=${quality}`);
      const dlData = await dlRes.json();

      if (dlData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al descargar el video: ${dlData.mensaje}`, m);
      }

      const fileUrl = dlData.result.download;
      const sizeMB = dlData.result.size || 0;
      const fileName = `${title || 'video'}.mp4`;

      await conn.sendMessage(m.chat, {
        [sizeMB > 100 ? 'document' : 'video']: { url: fileUrl },
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
handler.help = ['play2 <nombre/url> [full 720p]'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;