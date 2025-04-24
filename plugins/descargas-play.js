import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
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
      // Obtener información
      const infoUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true&info=true`;
      const infoRes = await fetch(infoUrl);
      const infoData = await infoRes.json();

      const { title, audio_quality, thumbnail } = infoData;

      if (!title) {
        return conn.reply(m.chat, `❌ No se pudo obtener información del video:\n${JSON.stringify(infoData)}`, m);
      }

      const msg = `
🎶 Preparando Audio 🎶
────────────────────
📌 Título: ${title}
🎧 Calidad: ${audio_quality || 'Desconocida'}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      // Asumimos que la API ya devuelve el archivo desde una URL pública conocida
      const directUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true`;
      const fileName = `${title}.mp3`;

      await conn.sendMessage(m.chat, {
        audio: { url: directUrl },
        mimetype: 'audio/mpeg',
        fileName
      }, { quoted: m });

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