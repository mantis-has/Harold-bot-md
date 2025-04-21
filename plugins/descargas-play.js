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

const handler = async (m, { conn, text, command, args }) => {
  console.log(`Comando recibido: ${command}`); // Log al inicio

  if (command === 'play') {
    console.log('Entrando al bloque del comando "play"'); // Log de entrada
    if (!text.trim()) {
      console.log('No se proporcionó texto de búsqueda.'); // Log de falta de texto
      return m.reply('❗ Ingresa el nombre del video que deseas buscar.');
    }

    try {
      const search = await yts(text);
      const video = search.videos[0];
      if (!video) {
        console.log('No se encontraron resultados para:', text); // Log de no resultados
        return m.reply('❗ No se encontró ningún resultado.');
      }

      const info = `「✦」*${video.title}*\n\n` +
        `> 📺 Canal: *${video.author.name}*\n` +
        `> ⏱ Duración: *${video.timestamp}*\n` +
        `> 📅 Publicado: *${video.ago}*\n` +
        `> 👁️ Vistas: *${formatViews(video.views)}*\n` +
        `> 🔗 Link: ${video.url}`;

      console.log('Información del video:', info); // Log de la info

      await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: info,
        footer: 'YouTube Downloader',
        buttons: [
          { buttonId: `.getaudio ${video.url}`, buttonText: { displayText: '🎵 Descargar Audio' } },
          { buttonId: `.getvideo ${video.url}`, buttonText: { displayText: '🎥 Descargar Video' } },
          { buttonId: `.playaudio ${video.url}`, buttonText: { displayText: '🎶 Escuchar (Audio)' } },
        ],
        headerType: 4
      }, { quoted: m });

      console.log('Mensaje de información enviado.'); // Log de envío exitoso
      return;

    } catch (error) {
      console.error('Error en el comando "play":', error); // Log de error
      return m.reply(`❌ Error al buscar el video: ${error.message}`);
    }
  }

  if (command === 'playaudio') {
    console.log('Entrando al bloque del comando "playaudio"'); // Log de entrada
    if (!text.trim() && !args[0]) {
      console.log('No se proporcionó texto o URL para playaudio.'); // Log de falta de input
      return m.reply('❗ Ingresa el nombre del video o la URL.');
    }
    const queryOrUrl = text.trim() || args[0];
    let videoUrl;

    try {
      if (queryOrUrl.includes('youtu')) {
        videoUrl = queryOrUrl;
        console.log('URL de YouTube proporcionada:', videoUrl); // Log de URL
      } else {
        console.log('Buscando video con el término:', queryOrUrl); // Log de búsqueda
        const search = await yts(queryOrUrl);
        const video = search.videos[0];
        if (!video) {
          console.log('No se encontraron resultados para playaudio:', queryOrUrl); // Log de no resultados
          return m.reply('❗ No se encontró ningún resultado.');
        }
        videoUrl = video.url;
        console.log('URL del video encontrado:', videoUrl); // Log de URL encontrada
      }

      console.log('Obteniendo información del video para playaudio desde la API...'); // Log de API
      const api = await fetchAPI(videoUrl, 'video'); // Obtenemos la URL del video
      const downloadUrl = api.download || api.data?.url;
      if (!downloadUrl) {
        console.log('No se pudo obtener la URL de descarga del video para playaudio.'); // Log de fallo de URL
        throw new Error('No se pudo obtener la URL de descarga del video.');
      }
      console.log('URL de descarga del video para playaudio:', downloadUrl); // Log de URL de descarga

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`);
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`);
      console.log('Rutas de archivos temporales creadas:', tempVideo, tempAudio); // Log de rutas

      console.log('Descargando video para playaudio...'); // Log de descarga
      const videoStream = await fetch(downloadUrl);
      const file = fs.createWriteStream(tempVideo);
      await new Promise((resolve, reject) => {
        videoStream.body.pipe(file);
        videoStream.body.on('error', reject);
        file.on('finish', resolve);
      });
      console.log('Descarga de video para playaudio completada.'); // Log de descarga completa

      console.log('Convirtiendo video a audio para playaudio...'); // Log de conversión
      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, (err) => {
          if (err) {
            console.error('Error en la conversión de audio para playaudio:', err); // Log de error de ffmpeg
            return reject(err);
          }
          resolve();
        });
      });
      console.log('Conversión a audio para playaudio completada.'); // Log de conversión completa

      console.log('Leyendo archivo de audio para playaudio...'); // Log de lectura
      const buffer = fs.readFileSync(tempAudio);
      console.log('Archivo de audio leído. Enviando mensaje...'); // Log de lectura completa

      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || api.data.filename}.mp3`
      }, { quoted: m });
      console.log('Mensaje de audio enviado para playaudio.'); // Log de envío exitoso

      console.log('Eliminando archivos temporales para playaudio...'); // Log de eliminación
      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempAudio);
      console.log('Archivos temporales eliminados para playaudio.'); // Log de eliminación completa

    } catch (error) {
      console.error('Error en el comando "playaudio":', error); // Log de error
      return m.reply(`❌ Error al descargar, convertir y enviar el audio: ${error.message}`);
    }
    return;
  }

  if (command === 'getaudio') {
    console.log('Entrando al bloque del comando "getaudio"'); // Log de entrada
    if (!args[0] || !args[0].includes('youtu')) {
      console.log('URL inválida o no proporcionada para getaudio.'); // Log de URL inválida
      return m.reply('❗ URL inválida o no proporcionada.');
    }
    const url = args[0];

    try {
      console.log('Obteniendo información de audio desde la API para getaudio...'); // Log de API
      const api = await fetchAPI(url, 'audio');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) {
        console.log('No se pudo obtener la URL del video para extraer el audio en getaudio.'); // Log de fallo de URL
        throw new Error('No se pudo obtener el video para extraer el audio.');
      }
      console.log('URL del video para extraer audio en getaudio:', videoUrl); // Log de URL

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`);
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`);
      console.log('Rutas de archivos temporales creadas para getaudio:', tempVideo, tempAudio); // Log de rutas

      console.log('Descargando video para extraer audio en getaudio...'); // Log de descarga
      const videoStream = await fetch(videoUrl);
      const file = fs.createWriteStream(tempVideo);
      await new Promise((resolve, reject) => {
        videoStream.body.pipe(file);
        videoStream.body.on('error', reject);
        file.on('finish', resolve);
      });
      console.log('Descarga de video para extraer audio en getaudio completada.'); // Log de descarga completa

      console.log('Convirtiendo video a audio para getaudio...'); // Log de conversión
      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, (err) => {
          if (err) {
            console.error('Error en la conversión de audio para getaudio:', err); // Log de error de ffmpeg
            return reject(err);
          }
          resolve();
        });
      });
      console.log('Conversión a audio para getaudio completada.'); // Log de conversión completa

      console.log('Leyendo archivo de audio para getaudio...'); // Log de lectura
      const buffer = fs.readFileSync(tempAudio);
      console.log('Archivo de audio leído para getaudio. Enviando mensaje...'); // Log de lectura completa

      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || api.data.filename}.mp3`
      }, { quoted: m });
      console.log('Mensaje de audio enviado para getaudio.'); // Log de envío exitoso

      console.log('Eliminando archivos temporales para getaudio...'); // Log de eliminación
      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempAudio);
      console.log('Archivos temporales eliminados para getaudio.'); // Log de eliminación completa

    } catch (error) {
      console.error('Error en el comando "getaudio":', error); // Log de error
      return m.reply(`❌ Error al convertir audio: ${error.message}`);
    }
    return;
  }

  if (command === 'getvideo') {
    console.log('Entrando al bloque del comando "getvideo"'); // Log de entrada
    if (!args[0] || !args[0].includes('youtu')) {
      console.log('URL inválida o no proporcionada para getvideo.'); // Log de URL inválida
      return m.reply('❗ URL inválida o no proporcionada.');
    }
    const url = args[0];

    try {
      console.log('Obteniendo información del video desde la API para getvideo...'); // Log de API
      const api = await fetchAPI(url, 'video');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) {
        console.log('No se pudo obtener la URL del video para descargar en getvideo.'); // Log de fallo de URL
        throw new Error('No se pudo obtener el video.');
      }
      console.log('URL del video para descargar en getvideo:', videoUrl); // Log de URL

      console.log('Obteniendo tamaño del archivo para getvideo...'); // Log de tamaño
      const sizeMB = await getFileSize(videoUrl);
      console.log('Tamaño del archivo para getvideo:', sizeMB, 'MB'); // Log de tamaño

      if (sizeMB > MAX_SIZE_MB) {
        console.log('El tamaño del video excede el límite. Enviando como documento.'); // Log de límite excedido
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName: `${api.title || api.data.filename}.mp4`
        }, { quoted: m });
        console.log('Video enviado como documento.'); // Log de envío como documento
      } else {
        console.log('El tamaño del video está dentro del límite. Enviando como video.'); // Log dentro del límite
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `${api.title || ''}`
        }, { quoted: m });
        console.log('Video enviado como video.'); // Log de envío como video
      }

    } catch (error) {
      console.error('Error en el comando "getvideo":', error); // Log de error
      return m.reply(`❌ Error al obtener video: ${error.message}`);
    }
    return;
  }
};

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=${type === 'audio' ? '128kbps' : '720p'}&apikey=Paimon`;
  console.log('Fetching API with endpoint:', endpoint); // Log de la API
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    console.log('API Response:', data); // Log de la respuesta de la API
    return data;
  } catch (error) {
    console.error('Error fetching API:', error); // Log de error de la API
    return { status: false, message: error.message };
  }
};

const getFileSize = async (url) => {
  console.log('Getting file size for URL:', url); // Log de tamaño
  try {
    const res = await axios.head(url);
    const size = res.headers['content-length'] || 0;
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    console.log('File size:', sizeMB, 'MB'); // Log del tamaño
    return parseFloat(sizeMB);
  } catch (error) {
    console.error('Error getting file size:', error); // Log de error de tamaño
    return 0;
  }
};

const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['play', 'getaudio', 'getvideo', 'playaudio'];
handler.help = ['play <nombre>', 'getaudio <url>', 'getvideo <url>', 'playaudio <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
