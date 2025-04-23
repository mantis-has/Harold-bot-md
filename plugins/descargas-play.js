import yts from 'yt-search';
import fetch from 'node-fetch';
import { ogmp3 } from '../lib/youtubedl.js';

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
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
      } catch (e) {
        return conn.reply(m.chat, `❌ Error al buscar: ${e.message}`, m);
      }
    }

    try {
      // API principal
      const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true&info=true`);
      const infoData = await infoRes.json();

      if (infoData.status !== 'success') throw new Error(infoData.mensaje);

      const { title, quality, thumbnail } = infoData.result;
      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: `🎧 Título: ${title}\n📥 Calidad: ${quality || 'Auto'}\n⏳ Descargando...` }, { quoted: m });

      const dlRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=true`);
      const dlData = await dlRes.json();
      if (dlData.status !== 'success') throw new Error(dlData.mensaje);

      const fileUrl = dlData.result.download;
      const fileSizeMB = parseFloat(dlData.result.size) || 0;
      const fileName = `${title || 'audio'}.mp3`;

      await conn.sendMessage(m.chat, {
        [fileSizeMB > 100 ? 'document' : 'audio']: { url: fileUrl },
        mimetype: 'audio/mpeg',
        fileName
      }, { quoted: m });

    } catch (err) {
      console.warn('[API principal falló, usando respaldo ogmp3]', err.message);

      const result = await ogmp3.download(youtubeUrl, '320', 'audio');
      if (!result.status) {
        return conn.reply(m.chat, `❌ Error con ambos métodos: ${result.error}`, m);
      }

      const { title, download, thumbnail, quality } = result.result;
      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: `🎧 Título: ${title}\n📥 Calidad: ${quality}kbps\n⏳ Descargando...` }, { quoted: m });

      await conn.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }
  }
};

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;