import yts from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToFilename } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToFilename(import.meta.url);
const __dirname = path.dirname(__filename);

// Handler para el comando .play
const playHandler = async (m, { conn, text, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video.', m);
  }

  const query = text.trim() || args[0];
  let videoInfo;

  try {
    if (query.includes('youtu')) {
      const search = await yts({ videoId: query.split('v=')[1] });
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontró información para esa URL.', m);
      }
      videoInfo = search.videos[0];
    } else {
      const search = await yts(query);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
      }
      videoInfo = search.videos[0];
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
    const vistas = formatViews(views);
    const canal = author.name || 'Desconocido';

    const infoMessage = `
🎬 Información del Video 🎬
──────────────────
📌 Título: ${title}
🎤 Autor: ${canal}
⏱️ Duración: ${timestamp}
👁️ Vistas: ${vistas}
📅 Publicado: ${ago}
🔗 Enlace del Video: ${url}
──────────────────
🎧 Descargando audio...
    `;

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMessage }, { quoted: m });

    // Ejecutar automáticamente el comando .getaudio con la URL
    await getAudioHandler(m, { conn, text: url, args: [url] });

  } catch (error) {
    console.error('Error en el comando play:', error);
    conn.reply(m.chat, `❌ Ocurrió un error al obtener la información del video: ${error.message}`, m);
  }
};

// Handler para el comando .getaudio
const getAudioHandler = async (m, { conn, text, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🎧 Por favor, ingresa la URL del video para convertir a audio.', m);
  }

  const url = text.trim() || args[0];

  if (!url.includes('youtu')) {
    return conn.reply(m.chat, '❌ Por favor, proporciona una URL de YouTube válida.', m);
  }

  try {
    // Enviar mensaje de descarga y conversión
    await conn.reply(m.chat, '⏳ Descargando video y convirtiendo a audio...', m);

    const search = await yts({ videoId: url.split('v=')[1] });
    if (!search.videos.length) {
      return conn.reply(m.chat, '❌ No se encontró información para esa URL.', m);
    }
    const videoInfo = search.videos[0];
    const { title } = videoInfo; // Solo necesitamos el título para el nombre del archivo

    const api = await fetchAPI(url, 'video');
    const videoUrl = api.download || api.data?.url;

    if (!videoUrl) {
      return conn.reply(m.chat, '❌ No se pudo obtener la URL de descarga del video.', m);
    }

    const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`);
    const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`);

    console.log(`Descargando video desde: ${videoUrl} a ${tempVideo}`);
    try {
      const videoStreamResponse = await fetch(videoUrl);
      if (!videoStreamResponse.ok || !videoStreamResponse.body) {
        throw new Error(`Error al descargar el video: ${videoStreamResponse.status} ${videoStreamResponse.statusText}`);
      }
      const file = fs.createWriteStream(tempVideo);
      await new Promise((resolve, reject) => {
        videoStreamResponse.body.pipe(file);
        videoStreamResponse.body.on('error', reject);
        file.on('finish', resolve);
      });
      console.log('Descarga de video completada.');
    } catch (error) {
      console.error('Error durante la descarga del video:', error);
      return conn.reply(m.chat, `❌ Error al descargar el video: ${error.message}`, m);
    }

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, (err) => {
        if (err) {
          console.error('Error al convertir a audio:', err);
          return reject(err);
        }
        resolve();
      });
    });
    console.log('Conversión a audio completada.');

    try {
      const buffer = await fs.readFile(tempAudio);
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
      await fs.unlink(tempVideo);
      await fs.unlink(tempAudio);
      console.log('Archivos temporales eliminados.');
    } catch (error) {
      console.error('Error al leer o enviar el audio o al eliminar archivos:', error);
      conn.reply(m.chat, `❌ Error al procesar el archivo de audio: ${error.message}`, m);
    }

  } catch (error) {
    console.error('Error en el comando getaudio:', error);
    conn.reply(m.chat, `❌ Ocurrió un error al descargar y convertir el video a audio: ${error.message}`, m);
  }
};

const fetchAPI = async (url, type) => {
  const quality = type === 'audio' ? '128kbps' : '144p'; // Descarga el video en la calidad más baja posible (144p)
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=${quality}&apikey=Paimon`;
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

const handler = {
  command: ['play', 'getaudio'],
  help: ['play <nombre/url>', 'getaudio <url>'],
  tags: ['descargas'],
  register: true,
  handler: async (m, { conn, text, command, args }) => {
    if (command === 'play') {
      await playHandler(m, { conn, text, args });
    } else if (command === 'getaudio') {
      await getAudioHandler(m, { conn, text, args });
    }
  },
};

export default handler;
