import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioDir = path.join(__dirname, '../audios');

const handler = async (m, { conn, text, command, botname }) => {
  if (command === 'clearp') {
    try {
      if (!fs.existsSync(audioDir)) {
        return conn.reply(m.chat, '❗ La carpeta de audios no existe.', m);
      }

      const files = fs.readdirSync(audioDir);
      if (files.length === 0) {
        return conn.reply(m.chat, '✅ La carpeta de audios ya está vacía.', m);
      }

      for (const file of files) {
        fs.unlinkSync(path.join(audioDir, file));
      }

      return conn.reply(m.chat, '✅ Todos los audios han sido eliminados correctamente.', m);
    } catch (err) {
      console.error('Error al limpiar la carpeta:', err);
      return conn.reply(m.chat, `❌ Error al limpiar la carpeta: ${err.message}`, m);
    }
  }

  if (command === 'play') {
    if (!text?.trim()) {
      return conn.reply(m.chat, '❗ Ingresa el nombre o enlace del video.', m);
    }

    try {
      let url = text;
      if (!ytdl.validateURL(text)) {
        const searchResult = await ytSearch(text);
        if (!searchResult?.videos?.length) {
          return conn.reply(m.chat, '❌ No se encontraron resultados.', m);
        }
        url = searchResult.videos[0].url;
      }

      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '_');
      const filePath = path.join(audioDir, `${title}.mp3`);

      // Asegurar que el directorio existe
      if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

      const videoPath = path.join(audioDir, `${title}.mp4`);
      const stream = ytdl(url, { quality: 'lowestvideo' });

      // Descargar el video temporalmente
      const videoWrite = fs.createWriteStream(videoPath);
      stream.pipe(videoWrite);

      videoWrite.on('finish', () => {
        // Convertir a audio con ffmpeg
        exec(`ffmpeg -i "${videoPath}" -vn -b:a 192k -ar 44100 -y "${filePath}"`, async (err) => {
          if (err) {
            console.error('Error al convertir con ffmpeg:', err);
            return conn.reply(m.chat, `❌ Error al convertir el audio: ${err.message}`, m);
          }

          // Eliminar el archivo de video
          fs.unlinkSync(videoPath);

          // Enviar el audio
          await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(filePath),
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
          }, { quoted: m });
        });
      });

    } catch (err) {
      console.error('Error en .play:', err);
      m.reply(`❌ Error al procesar el audio: ${err.message}`);
    }
  }
};

handler.command = ['play', 'clearp'];
handler.help = ['play <texto o url>', 'clearp'];
handler.tags = ['descargas'];

export default handler;