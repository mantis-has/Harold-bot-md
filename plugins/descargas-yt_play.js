import ytSearch from 'yt-search';
import { ogmp3 } from '../lib/youtubedl.js';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) return m.reply("¿Qué audio quieres buscar? Escribe el nombre o URL del video.");

    let url = text;
    if (!ogmp3.isUrl(text)) {
      const search = await ytSearch(text);
      const video = search.videos[0];
      if (!video) return m.reply("No encontré resultados para eso.");
      url = video.url;
    }

    m.reply("⏳ Procesando el audio, espera un momento...");

    const res = await ogmp3.download(url, null, 'audio');
    if (!res.status) {
      return m.reply(`❌ Error: ${res.error || 'Error desconocido'}\n\n${JSON.stringify(res, null, 2)}`);
    }

    const { download, title, quality } = res.result;

    const head = await fetch(download, { method: 'HEAD' });
    const size = head.headers.get('content-length');
    const sizeMB = size ? Number(size) / (1024 * 1024) : 0;

    const info = {
      caption: `✅ *${title}*\n*Calidad:* ${quality}kbps\n*Peso:* ${sizeMB.toFixed(2)} MB`,
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg'
    };

    await conn.sendMessage(m.chat, {
      audio: { url: download },
      ...info
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(`❌ Error inesperado: ${err.message}`);
  }
};

handler.command = ['play3'];
handler.help = ['play3 <nombre o URL del video>'];
handler.tags = ['descargas'];

export default handler;