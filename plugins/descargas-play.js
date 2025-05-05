import ytdl from 'ytdl-core';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const TMP_FOLDER = path.resolve(__dirname, '../tmp');

if (!fs.existsSync(TMP_FOLDER)) {
  fs.mkdirSync(TMP_FOLDER, { recursive: true });
}

const handler = async (m, { conn, text, command, args }) => {
  if (!text.trim() && !args[0]) {
    return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
  }

  const query = text.trim() || args[0];
  let youtubeUrl;

  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
    youtubeUrl = query;
  } else {
    try {
      const search = await yts(query);
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
      }
      youtubeUrl = search.videos[0].url;
    } catch (error) {
      console.error('Error al buscar el video:', error);
      return conn.reply(m.chat, `❌ Error al buscar el video: ${error.message}`, m);
    }
  }

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const video = info.videoDetails;
    const safeTitle = video.title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').slice(0, 100);
    const outPath = path.join(TMP_FOLDER, `${Date.now()}-${safeTitle}.mp3`);

    const quality = info.formats.find(f => f.audioBitrate)?.audioBitrate + ' kbps' || 'Desconocida';
    const durationSeconds = parseInt(video.lengthSeconds);
    const durationFormatted = formatDuration(durationSeconds);
    const views = Number(video.viewCount).toLocaleString();
    const year = new Date(video.publishDate).getFullYear();
    const thumbnail = video.thumbnails?.pop()?.url || '';

    const caption = `
🎶 *Descargando audio de YouTube*
────────────────────
📌 *Título:* ${video.title}
📅 *Publicado:* ${year}
⏱️ *Duración:* ${durationFormatted}
👀 *Vistas:* ${views}
🎧 *Calidad:* ${quality}
⏳ *Extrayendo audio...*
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    await extractAudioWithFFmpeg(youtubeUrl, outPath);

    await conn.sendMessage(m.chat, {
      audio: { url: outPath },
      mimetype: 'audio/mpeg',
      fileName: `${safeTitle}.mp3`
    }, { quoted: m });

    fs.unlinkSync(outPath); // limpiar

  } catch (err) {
    console.error('Error general:', err);
    conn.reply(m.chat, `❌ Error al procesar el video: ${err.message}`, m);
  }
};

function extractAudioWithFFmpeg(youtubeUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(youtubeUrl, { quality: 'highestaudio' });

    const ffmpegProcess = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-vn',
      '-acodec', 'libmp3lame',
      '-ab', '128k',
      '-f', 'mp3',
      outputPath
    ]);

    audioStream.pipe(ffmpegProcess.stdin);

    ffmpegProcess.stderr.on('data', () => { /* puedes mostrar progreso aquí si quieres */ });

    ffmpegProcess.on('error', (err) => {
      reject(new Error(`Error al ejecutar ffmpeg: ${err.message}`));
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg terminó con código de salida ${code}`));
      }
    });
  });
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

handler.command = ['play'];
handler.help = ['play <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
