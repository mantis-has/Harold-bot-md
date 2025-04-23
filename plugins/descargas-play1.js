import yts from 'yt-search';
import fetch from 'node-fetch';
import { ogmp3 } from '../lib/youtubedl.js';

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim()) {
    return conn.reply(m.chat, '🔎 Ingresa el nombre o URL del video de YouTube.', m);
  }

  const query = text.trim();
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
    } catch (e) {
      return conn.reply(m.chat, `❌ Error al buscar: ${e.message}`, m);
    }
  }

  try {
    const quality = '360p';

    // API principal
    const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true&calidad=${quality}`);
    const infoData = await infoRes.json();

    if (infoData.status !== 'success') throw new Error(infoData.mensaje);

    const { title, thumbnail, quality: q } = infoData.result;
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: `🎬 Título: ${title}\n📥 Calidad: ${q}\n⏳ Descargando...` }, { quoted: m });

    const dlRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&calidad=${quality}`);
    const dlData = await dlRes.json();
    if (dlData.status !== 'success') throw new Error(dlData.mensaje);

    const fileUrl = dlData.result.download;
    const fileSizeMB = parseFloat(dlData.result.size) || 0;
    const fileName = `${title || 'video'}.mp4`;

    await conn.sendMessage(m.chat, {
      [fileSizeMB > 100 ? 'document' : 'video']: { url: fileUrl },
      mimetype: 'video/mp4',
      fileName
    }, { quoted: m });

  } catch (err) {
    console.warn('[API principal falló, usando respaldo ogmp3]', err.message);

    const result = await ogmp3.download(youtubeUrl, '360', 'video');
    if (!result.status) {
      return conn.reply(m.chat, `❌ Error con ambos métodos: ${result.error}`, m);
    }

    const { title, download, thumbnail, quality } = result.result;
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: `🎬 Título: ${title}\n📥 Calidad: ${quality}p\n⏳ Descargando...` }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: download },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: m });
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;