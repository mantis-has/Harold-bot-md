import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_SIZE_MB = 100;

const handler = async (m, { conn, text, command, args, usedPrefix, botname }) => {
  if (command === 'play') {
    if (!text?.trim()) return conn.reply(m.chat, '❗ Ingresa el nombre del video que deseas buscar.', m);
    
    try {
      const search = await yts(text);
      const video = search.videos[0];
      if (!video) return m.reply('❗ No se encontró ningún resultado.');

      const info = `🎶 *Resultado encontrado:*\n\n` +
        `> *Título:* ${video.title}\n` +
        `> *Canal:* ${video.author.name}\n` +
        `> *Vistas:* ${formatViews(video.views)}\n` +
        `> *Duración:* ${video.timestamp}\n` +
        `> *Publicado:* ${video.ago}\n` +
        `> *Link:* ${video.url}\n\n` +
        `Selecciona una opción:`;

      await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: info,
        footer: `Descargas - ${botname}`,
        buttons: [
          { buttonId: `.getaudio ${video.url}`, buttonText: { displayText: '🎵 Audio' } },
          { buttonId: `.getvideo ${video.url}`, buttonText: { displayText: '🎥 Video' } }
        ],
        headerType: 4
      }, { quoted: m });

    } catch (err) {
      console.error('Error en .play:', err);
      m.reply(`❌ Error al buscar el video: ${err.message}`);
    }
    return;
  }

  if (command === 'getaudio') {
    const url = args[0];
    if (!url || !url.includes('youtu')) return m.reply('❗ URL inválida o no proporcionada.');

    try {
      const api = await fetchAPI(url, 'audio');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) throw new Error('No se pudo obtener el enlace del video.');

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`);
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`);

      const res = await fetch(videoUrl);
      const stream = fs.createWriteStream(tempVideo);
      await new Promise((resolve, reject) => {
        res.body.pipe(stream);
        res.body.on('error', reject);
        stream.on('finish', resolve);
      });

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      const buffer = fs.readFileSync(tempAudio);
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || 'audio'}.mp3`,
        ptt: false
      }, { quoted: m });

      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempAudio);
    } catch (err) {
      console.error('Error en getaudio:', err);
      m.reply(`❌ Error al obtener el audio: ${err.message}`);
    }
    return;
  }

  if (command === 'getvideo') {
    const url = args[0];
    if (!url || !url.includes('youtu')) return m.reply('❗ URL inválida o no proporcionada.');

    try {
      const api = await fetchAPI(url, 'video');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) throw new Error('No se pudo obtener el enlace del video.');

      const sizeMB = await getFileSize(videoUrl);
      const fileName = `${api.title || 'video'}.mp4`;

      if (sizeMB > MAX_SIZE_MB) {
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: api.title || ''
        }, { quoted: m });
      }
    } catch (err) {
      console.error('Error en getvideo:', err);
      m.reply(`❌ Error al obtener el video: ${err.message}`);
    }
    return;
  }
};

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=${type === 'audio' ? '128kbps' : '720p'}&apikey=Paimon`;
  const res = await fetch(endpoint);
  return await res.json();
};

const getFileSize = async (url) => {
  try {
    const res = await axios.head(url);
    const size = res.headers['content-length'] || 0;
    return parseFloat((size / (1024 * 1024)).toFixed(2));
  } catch (err) {
    return 0;
  }
};

const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['play', 'getaudio', 'getvideo'];
handler.help = ['play <nombre>', 'getaudio <url>', 'getvideo <url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;