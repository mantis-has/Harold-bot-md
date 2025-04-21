import yts from 'yt-search';
import { ogmp3 } from '../lib/youtubedl.js'; // Asegúrate de que la ruta al archivo ogmp3.js sea correcta

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
    }

    const query = text.trim() || args[0];
    let youtubeUrl;

    if (ogmp3.isUrl(query)) {
      youtubeUrl = query;
    } else {
      try {
        const search = await yts(query); // Asegúrate de tener importado y configurado yts
        if (!search.videos.length) {
          return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
        }
        youtubeUrl = search.videos[0].url;
      } catch (error) {
        console.error('Error al buscar el video:', error);
        return conn.reply(m.chat, `❌ Ocurrió un error al buscar el video: ${error.message}`, m);
      }
    }

    if (!youtubeUrl) {
      return conn.reply(m.chat, '❌ No se pudo obtener la URL del video.', m);
    }

    conn.reply(m.chat, '⏳ Buscando información y preparando descarga de audio...', m);

    try {
      const result = await ogmp3.download(youtubeUrl, '320', 'audio'); // Descargar en formato mp3 de 320kbps

      if (result.status && result.result && result.result.download) {
        const { title, thumbnail, download } = result.result;

        const infoMessage = `
🎶 Descargando Audio 🎶
──────────────────
📌 Título: ${title || 'Sin título'}
🎧 Calidad: 320kbps
⏳ Descargando...
        `;

        await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMessage }, { quoted: m });

        await conn.sendMessage(m.chat, {
          audio: { url: download },
          mimetype: 'audio/mpeg',
          fileName: `${title || 'audio'}.mp3`
        }, { quoted: m });

      } else {
        console.error('Error al descargar el audio:', result);
        conn.reply(m.chat, `❌ Ocurrió un error al descargar el audio: ${result.error || 'Error desconocido'}`, m);
      }

    } catch (error) {
      console.error('Error general al descargar el audio:', error);
      conn.reply(m.chat, `❌ Ocurrió un error inesperado: ${error.message}`, m);
    }
  }
};

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
