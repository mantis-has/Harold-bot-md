import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Ingresa el nombre o URL del video.', m);
  }

  const input = text.trim() || args[0];
  let youtubeUrl = input;
  let calidad = '360p';

  // Extrae calidad si se incluye (ej. full 720p)
  const calidadMatch = input.match(/(?:full\s*)?(\d{3,4}p)/i);
  if (calidadMatch) {
    calidad = calidadMatch[1];
    youtubeUrl = input.replace(calidadMatch[0], '').trim();
  }

  // Si no es URL, realiza búsqueda
  if (!/^https?:\/\//i.test(youtubeUrl)) {
    try {
      const search = await yts(youtubeUrl);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (e) {
      console.error(e);
      return conn.reply(m.chat, '❌ Error en la búsqueda.', m);
    }
  }

  try {
    const apiUrl = `http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&calidad=${calidad}`;
    const res = await fetch(apiUrl);

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const error = await res.json();
      return conn.reply(m.chat, `❌ Error: ${error.error || 'No se pudo obtener el archivo'}`, m);
    }

    const buffer = await res.buffer();
    const fileSizeMB = buffer.length / (1024 * 1024);
    const fileName = res.headers.get("content-disposition")?.split("filename=")[1]?.replace(/"/g, '') || 'video.mp4';

    const fileMsg = {
      [fileSizeMB > 100 ? 'document' : 'video']: buffer,
      mimetype: contentType,
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