import ytSearch from 'yt-search';
import { ogmp3 } from '../lib/youtubedl.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const handler = async (m, { sock, text, command }) => {
  try {
    if (!text) return m.reply("¿Qué audio quieres buscar? Escribe el nombre o URL del video.");

    let url = text;
    if (!ogmp3.isUrl(text)) {
      const search = await ytSearch(text);
      const video = search.videos[0];
      if (!video) return m.reply("No encontré resultados para eso.");
      url = video.url;
    }

    m.reply("⏳ Descargando el audio, espera un momento...");

    const res = await ogmp3.download(url, null, 'audio');
    if (!res.status) {
      return m.reply(`❌ Error: ${res.error || 'Error desconocido'}\n\n${JSON.stringify(res, null, 2)}`);
    }

    const { download, title, quality } = res.result;
    const filePath = `./temp/${Date.now()}.mp3`;

    const response = await axios.get(download, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    const caption = `✅ *${title}*\n*Calidad:* ${quality}kbps\n*Tamaño:* ${fileSizeMB.toFixed(2)} MB`;

    await sock.sendMessage(m.chat, {
      audio: { url: filePath },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      caption,
      ptt: false
    }, { quoted: m });

    fs.unlinkSync(filePath);

  } catch (err) {
    console.error(err);
    m.reply(`❌ Error inesperado: ${err.message}`);
  }
};

handler.command = ['play3'];
handler.help = ['play3 <nombre o URL del video>'];
handler.tags = ['descargas'];

export default handler;