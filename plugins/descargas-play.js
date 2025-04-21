import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audiosDir = path.join(__dirname, '../audios/');

// Crear carpeta si no existe
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir, { recursive: true });

const handler = async (m, { conn, text, command, botname }) => {
  if (!text?.trim()) return conn.reply(m.chat, '❗ Ingresa el nombre o link del video.', m);

  let videoUrl = text;
  let info;

  try {
    if (!ytdl.validateURL(text)) {
      const search = await ytSearch(text);
      if (!search.videos.length) throw new Error('No se encontró ningún video.');
      videoUrl = search.videos[0].url;
    }

    // Intentar obtener info con ytdl normal
    try {
      info = await ytdl.getInfo(videoUrl);
    } catch {
      // Intentar modo legacy
      try {
        info = await ytdl.getInfo(videoUrl, { requestOptions: { legacy: true } });
      } catch (errLegacy) {
        console.log('Fallo ytdl legacy. Intentando API...');
        return await handleWithAPI(conn, m, videoUrl, text, botname);
      }
    }

    const { title, video_url, thumbnails, lengthSeconds, author, viewCount, uploadDate } = info.videoDetails;
    const duration = formatDuration(lengthSeconds);
    const views = Number(viewCount).toLocaleString('es-ES');
    const thumb = thumbnails?.[thumbnails.length - 1]?.url || '';

    // Mensaje informativo
    const msg = `
🎬 *Título:* ${title}
👤 *Canal:* ${author.name}
⏱ *Duración:* ${duration}
👀 *Vistas:* ${views}
📅 *Publicado:* ${uploadDate}
🔗 *Enlace:* ${video_url}

⏳ *Procesando audio...*
`;

    await conn.sendMessage(m.chat, { text: msg }, {
      quoted: m,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: 'YouTube Downloader',
          mediaType: 1,
          previewType: 0,
          mediaUrl: video_url,
          sourceUrl: video_url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // Descargar video temporal
    const tempVideoPath = path.join(audiosDir, `${title}.mp4`);
    const tempAudioPath = path.join(audiosDir, `${title}.mp3`);

    await new Promise((resolve, reject) => {
      ytdl(videoUrl, { quality: 'lowest' })
        .pipe(fs.createWriteStream(tempVideoPath))
        .on('finish', resolve)
        .on('error', reject);
    });

    // Convertir a audio
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${tempVideoPath}" -vn -acodec libmp3lame -q:a 5 "${tempAudioPath}"`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: fs.createReadStream(tempAudioPath),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

    // Eliminar video temporal
    fs.unlinkSync(tempVideoPath);

  } catch (err) {
    console.error('Error final en .play:', err);
    m.reply(`❌ Error al procesar el audio: ${err.message}`);
  }
};

// Uso de API externa si ytdl falla
const handleWithAPI = async (conn, m, url, originalText, botname) => {
  try {
    const api = `https://api.neoxr.eu/api/youtube?url=${url}&type=audio&quality=128kbps&apikey=Paimon`;
    const res = await fetch(api);
    const json = await res.json();
    if (!json.success) throw new Error('API no pudo procesar el video.');
    const { url: dlUrl, title, channel, published, duration, views, thumbnail } = json.data;

    const msg = `
🎬 *Título:* ${title}
👤 *Canal:* ${channel}
⏱ *Duración:* ${duration}
👀 *Vistas:* ${views}
📅 *Publicado:* ${published}
🔗 *Enlace:* ${url}

⏳ *Procesando desde API...*
`;

    await conn.sendMessage(m.chat, { text: msg }, {
      quoted: m,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: 'YouTube API Downloader',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail,
          renderLargerThumbnail: true
        }
      }
    });

    const filePath = path.join(audiosDir, `${title}.mp3`);
    const audioStream = await fetch(dlUrl);
    const buffer = await audioStream.buffer();
    fs.writeFileSync(filePath, buffer);

    await conn.sendMessage(m.chat, {
      audio: fs.createReadStream(filePath),
      mimetype: 'audio/mp3',
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (error) {
    console.error('Error con API:', error);
    m.reply('❌ No se pudo descargar ni desde YouTube ni desde la API.');
  }
};

// Formato duración
const formatDuration = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

// Comando para limpiar audios
const clearHandler = async (m, { conn }) => {
  const folders = ['../audio', '../audios'];
  for (const folder of folders) {
    const fullPath = path.join(__dirname, folder);
    if (fs.existsSync(fullPath)) {
      fs.readdirSync(fullPath).forEach(file => {
        fs.unlinkSync(path.join(fullPath, file));
      });
    }
  }
  m.reply('✅ Todos los archivos han sido eliminados.');
};

handler.command = ['play'];
handler.tags = ['descargas'];
handler.help = ['play <texto|url>'];

const clearp = {
  command: ['clearp'],
  tags: ['tools'],
  help: ['clearp'],
  handler: clearHandler
};

export default [handler, clearp];