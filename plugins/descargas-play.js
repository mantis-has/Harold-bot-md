import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'getaudio') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, 'Por favor, ingresa el nombre o la URL del video para convertir a audio.', m);
    }

    const query = text.trim() || args[0];
    let videoInfo;

    try {
      if (query.includes('youtu')) {
        const search = await yts({ videoId: query.split('v=')[1] });
        if (!search.videos.length) {
          return conn.reply(m.chat, 'No se encontró información para esa URL.', m);
        }
        videoInfo = search.videos[0];
      } else {
        const search = await yts(query);
        if (!search.videos.length) {
          return conn.reply(m.chat, 'No se encontraron resultados para tu búsqueda.', m);
        }
        videoInfo = search.videos[0];
      }

      const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
      const vistas = formatViews(views);
      const canal = author.name || 'Desconocido';

      const infoMessage = `
🎶 *Convirtiendo Video a Audio* 🎶
──────────────────
📌 *Título:* ${title}
🎤 *Autor:* ${canal}
👁️ *Vistas:* ${vistas}
📅 *Publicado:* ${ago}
🔗 *Enlace del Video:* ${url}
──────────────────
⏳ *Descargando video y convirtiendo a audio...*
      `;

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMessage }, { quoted: m });

      const api = await fetchAPI(url, 'video');
      const videoUrl = api.download || api.data?.url;

      if (!videoUrl) {
        return conn.reply(m.chat, '❌ No se pudo obtener la URL de descarga del video.', m);
      }

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`);
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`);

      const videoStream = await fetch(videoUrl);
      const file = fs.createWriteStream(tempVideo);
      await new Promise((resolve, reject) => {
        videoStream.body.pipe(file);
        videoStream.body.on('error', reject);
        file.on('finish', resolve);
      });

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, (err) => {
          if (err) {
            console.error('Error al convertir a audio:', err);
            return reject(err);
          }
          resolve();
        });
      });

      const buffer = fs.readFileSync(tempAudio);
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });

      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempAudio);

    } catch (error) {
      console.error('Error en el comando getaudio:', error);
      conn.reply(m.chat, `❌ Ocurrió un error al descargar y convertir el video a audio: ${error.message}`, m);
    }
  }
};

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=720p&apikey=Paimon`; // Cambiado la calidad a 720p para descargar video
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching API:', error);
    return { status: false, message: error.message };
  }
};

const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['getaudio', 'ytaudio'];
handler.help = ['getaudio <nombre/url>', 'ytaudio <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
