import yts from 'yt-search';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Ingresa el nombre o URL del video de YouTube.', m);
  }

  const query = text.trim() || args[0];
  let youtubeUrl;

  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
    youtubeUrl = query;
  } else {
    try {
      const search = await yts(query);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (error) {
      return conn.reply(m.chat, `❌ Error al buscar: ${error.message}`, m);
    }
  }

  try {
    // Obtener la info del video
    const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true&info=true`, {
      timeout: 60000
    });
    const infoData = await infoRes.json();

    if (infoData.status !== 'success' || !infoData.result) {
      return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje || 'Respuesta inválida'}`, m);
    }

    const { title, quality, thumbnail } = infoData.result;

    const caption = `
🎶 *Preparando Audio* 🎶
────────────────────
📌 *Título:* ${title}
🎧 *Calidad:* ${quality || 'Automática'}
⏳ *Descargando...*
    `.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

    // Descargar el archivo real
    const downloadRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true`, {
      timeout: 120000
    });
    const downloadData = await downloadRes.json();

    if (downloadData.status !== 'success' || !downloadData.result.download) {
      return conn.reply(m.chat, `❌ Error al descargar el audio: ${downloadData.mensaje || 'Respuesta inválida'}`, m);
    }

    const fileUrl = downloadData.result.download;
    const sizeMB = downloadData.result.size || 0;
    const fileName = `${title}.mp3`;

    const sendOpts = {
      quoted: m,
      mimetype: 'audio/mpeg',
      fileName
    };

    await conn.sendMessage(m.chat, {
      [sizeMB > 100 ? 'document' : 'audio']: { url: fileUrl },
      ...sendOpts
    });

  } catch (err) {
    console.error('Error:', err);
    conn.reply(m.chat, `❌ Error: ${err.message}`, m);
  }
};

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;