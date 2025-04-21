import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import { exec } from 'child_process'; 
// Usamos exec para ejecutar comandos del sistema
import ytSearch from 'yt-search'; 
// Usamos yt-search para búsqueda de videos

// Ruta de las carpetas donde se guardarán los audios y videos
const audioPath = path.join(__dirname, '../audio/');
const videoPath = path.join(__dirname, '../audios/');

// Comando .play
const handler = async (m, { conn, text, command, botname }) => {
  if (command === 'play') {
    // Validar que el usuario haya ingresado un texto
    if (!text?.trim()) {
      return conn.reply(m.chat, '❗ Por favor, ingresa el nombre o enlace del video que deseas buscar.', m);
    }

    let videoUrl = text;

    try {
      // Verificar si es un enlace de YouTube
      if (!ytdl.validateURL(text)) {
        // Si no es un enlace, se realiza una búsqueda con yt-search
        const searchResult = await ytSearch(text);

        if (searchResult.videos.length === 0) {
          return conn.reply(m.chat, '❗ No se encontró ningún video para esa búsqueda.', m);
        }

        // Tomamos el primer resultado de la búsqueda
        videoUrl = searchResult.videos[0].url;
      }

      // Obtener información del video desde YouTube
      const videoInfo = await ytdl.getInfo(videoUrl);
      const { title, video_url, thumbnails, lengthSeconds, author, viewCount, uploadDate } = videoInfo.videoDetails;

      // Formatear duración (en minutos:segundos)
      const duration = formatDuration(lengthSeconds);

      // Formatear vistas con separador de miles
      const vistas = Number(viewCount).toLocaleString('es-ES');

      // Obtener miniatura
      const thumbnail = thumbnails[thumbnails.length - 1]?.url || '';

      // Crear mensaje informativo para el usuario
      const infoMessage = `
🎬 **Título:** ${title}
⏲️ **Duración:** ${duration}
🔗 **Enlace:** ${video_url}
👤 **Canal:** ${author.name}
👀 **Vistas:** ${vistas}
📅 **Publicado:** ${uploadDate}

⏳ *Espera... se está preparando tu contenido.*

      `;

      // Enviar mensaje informativo con la miniatura
      await conn.sendMessage(m.chat, { text: infoMessage }, {
        quoted: m,
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: 'Descarga de YouTube',
            mediaType: 1,
            previewType: 0,
            mediaUrl: video_url,
            sourceUrl: video_url,
            thumbnail,
            renderLargerThumbnail: true
          }
        }
      });

      // Crear el stream de audio y descargar
      const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });

      // Verificar si el stream se puede obtener
      audioStream.on('info', (info) => {
        console.log('Información del video:', info);
      });

      // El archivo se guarda en ../audio/ usando ffmpeg
      const audioFilePath = path.join(audioPath, `${title}.mp3`);
      const ffmpegCommand = `ffmpeg -i pipe:0 -vn -acodec libmp3lame -ab 128k ${audioFilePath}`;

      const ffmpegProcess = exec(ffmpegCommand, { input: audioStream });

      ffmpegProcess.on('exit', () => {
        console.log('Audio convertido y guardado:', audioFilePath);
        conn.sendMessage(m.chat, {
          audio: fs.createReadStream(audioFilePath),
          mimetype: 'audio/mp3',
          fileName: `${title}.mp3`
        }, { quoted: m });
      });

      ffmpegProcess.on('error', (err) => {
        console.error('Error en ffmpeg:', err);
        m.reply(`❌ Error al procesar el audio: ${err.message}`);
      });

    } catch (err) {
      console.error('Error en .play:', err);
      if (err.message.includes('Could not extract functions')) {
        m.reply('❌ Error al procesar el video. Intenta con otro enlace o nombre de video.');
      } else {
        m.reply(`❌ Error al procesar el audio: ${err.message}`);
      }
    }
  }

  // Comando .clearp para eliminar archivos de ../audio/ y ../audios/
  if (command === 'clearp') {
    try {
      const deleteFiles = (dirPath) => {
        fs.readdirSync(dirPath).forEach(file => {
          const filePath = path.join(dirPath, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            deleteFiles(filePath);
          } else {
            fs.unlinkSync(filePath);
          }
        });
      };

      // Eliminar todos los archivos de las carpetas ../audio/ y ../audios/
      deleteFiles(audioPath);
      deleteFiles(videoPath);

      m.reply('🔒 Todos los archivos