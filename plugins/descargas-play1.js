import ytSearch from 'yt-search';
import { ogmp3 } from '../lib/youtubedl.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const handler = async (m, { sock, text, command }) => {
  try {
    if (!text) return m.reply("¿Qué quieres buscar? Escribe el nombre o URL del video.");

    let url = text;
    if (!ogmp3.isUrl(text)) {
      const search = await ytSearch(text);
      const video = search.videos[0];
      if (!video) return m.reply("No encontré resultados para eso.");
      url = video.url;
    }

    m.reply("⏳ Descargando el video, espera un momento...");

    const res = await ogmp3.download(url, null, 'video');
    if (!res.status) {
      return m.reply(`❌ Error: ${res.error || 'Error desconocido'}\n\n${JSON.stringify(res, null, 2)}`);
    }

    const { download, title, quality } = res.result;
    const filePath = `../tmp/${Date.now()}.mp4`;

    const response = await axios.get(download, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    const caption = `✅ *${title}*\n*Calidad:* ${quality}p\n*Tamaño:* ${fileSizeMB.toFixed(2)} MB`;

    await sock.sendMessage(m.chat, {
      [fileSizeMB > 100 ? 'document' : 'video']: { url: filePath },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption
    }, { quoted: m });

    fs.unlinkSync(filePath);

  } catch (err) {
    console.error(err);
    m.reply(`❌ Error inesperado: ${err.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre o URL del video>'];
handler.tags = ['descargas'];

export default handler;