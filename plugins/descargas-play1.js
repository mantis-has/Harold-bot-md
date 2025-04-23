import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play2') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, '🔎 Ingresa el nombre o URL del video de YouTube.', m);
    }

    const query = text.trim();
    const isFullQuality = /full/i.test(query);
    const cleanedQuery = query.replace(/full/i, '').trim();

    let youtubeUrl;

    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(cleanedQuery)) {
      youtubeUrl = cleanedQuery;
    } else {
      try {
        const search = await yts(cleanedQuery);
        if (!search.videos.length) {
          return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
        }
        youtubeUrl = search.videos[0].url;
      } catch (error) {
        console.error('Error en búsqueda:', error);
        return conn.reply(m.chat, `❌ Error al buscar: ${error.message}`, m);
      }
    }

    try {
      const infoUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true&full=${isFullQuality}`;
      const infoRes = await fetch(infoUrl, { timeout: 600_000 }); // 10 minutos
      const infoData = await infoRes.json();

      if (infoData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al obtener información: ${infoData.mensaje}`, m);
      }

      const { title, quality, thumbnail } = infoData.result;

      const msg = `
🎬 Preparando Video
────────────────────
📌 Título: ${title}
📺 Calidad: ${quality || '480p'}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      const downloadUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&full=${isFullQuality}`;
      const downloadRes = await fetch(downloadUrl, { timeout: 600_000 });
      const downloadData = await downloadRes.json();

      if (downloadData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al descargar: ${downloadData.mensaje}`, m);
      }

      const filePath = downloadData.result.download;
      const fileName = `${title || 'video'}.mp4`;

      const head = await fetch(filePath, { method: 'HEAD' });
      const size = head.headers.get('content-length') || 0;

      const maxSize = 100 * 1024 * 1024;

      const isLarge = parseInt(size) > maxSize;

      await conn.sendMessage(m.chat, {
        [isLarge ? 'document' : 'video']: { url: filePath },
        mimetype: 'video/mp4',
        fileName: fileName
      }, { quoted: m });

    } catch (err) {
      console.error('Error al contactar API:', err);
      conn.reply(m.chat, `❌ Error al contactar API: ${err.message}`, m);
    }
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre/url> [full]'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;