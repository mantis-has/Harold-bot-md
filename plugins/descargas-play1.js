import ytSearch from 'yt-search';
import { ogmp3 } from '../lib/youtubedl.js';

const handler = async (m, { conn, text }) => {
  try {
    if (!text) return m.reply("¿Qué video quieres buscar? Escribe el nombre o URL del video.");

    let url = text;
    if (!ogmp3.isUrl(text)) {
      const search = await ytSearch(text);
      const video = search.videos[0];
      if (!video) return m.reply("No encontré resultados para eso.");
      url = video.url;
    }

    m.reply("⏳ Procesando el video, espera un momento...");

    const res = await ogmp3.download(url, null, 'video');
    if (!res.status) {
      return m.reply(`❌ Error: ${res.error || 'Error desconocido'}\n\n${JSON.stringify(res, null, 2)}`);
    }

    const { download, title, quality } = res.result;

    const head = await fetch(download, { method: 'HEAD' });
    const size = head.headers.get('content-length');
    const sizeMB = size ? Number(size) / (1024 * 1024) : 0;

    const info = {
      caption: `✅ *${title}*\n*Calidad:* ${quality}\n*Peso:* ${sizeMB.toFixed(2)} MB`,
      fileName: `${title}.mp4`,
      mimetype: 'video/mp4'
    };

    // Si el archivo es mayor de 100MB, enviarlo como documento
    if (sizeMB > 100) {
      await conn.sendMessage(m.chat, {
        document: { url: download },
        ...info
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: download },
        ...info
      }, { quoted: m });
    }

  } catch (err) {
    console.error(err);
    m.reply(`❌ Error inesperado: ${err.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre o URL del video>'];
handler.tags = ['descargas'];

export default handler;