import yts from 'yt-search';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, text, command, botname }) => {
  if (command === 'play') {
    if (!text?.trim()) return conn.reply(m.chat, '❗ Ingresa el nombre del video que deseas buscar.', m);

    try {
      const search = await yts(text);
      const videoInfo = search.videos[0];
      if (!videoInfo) return m.reply('❗ No se encontró ningún resultado.');

      const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
      const vistas = formatViews(views);
      const canal = author.name || 'Desconocido';

      const infoMessage =
'︵۪۪۪۪۪۪۪⏜໋᳝ׅ۪۪۪࣪╼╽═┅᪲━᳝ׅ࣪🍒━ּ᳝ׅ࣪ᰰᩫ┅═╽╾໋᳝۪۪۪۪࣪⏜۪۪۪۪۪۪۪۪︵\n' +
'░ׅ ׄᰰׅ᷒𓎆  ֺᨳ︪︩፝֟͝. `DESCARGAS - RUBY 🔥` :\n\n' +
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐓𝐢𝐭𝐮𝐥𝐨:* ' + title + '\n' +
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐂𝐚𝐧𝐚𝐥:* ' + canal + '\n' +
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐕𝐢𝐬𝐭𝐚𝐬:* ' + vistas + '\n' +
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧:* ' + timestamp + '\n' +
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐄𝐧𝐥𝐚𝐜𝐞:* ' + url + '\n' +
'.⏝࿚‿᧔᧓‿࿙⏝.\n\n' +
'ᅟ  !    𝅼        🎬ᩙᩖ     ㅤׁ   ꒰꒰   𝅼         ꯴\n\n' +
'❙᳝፝۫֔🍒̸̷͚᪲໑ּ๋݂͚ 𝐄𝐬𝐩𝐞𝐫𝐚... 𝐬𝐞 𝐞𝐬𝐭𝐚́ 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐭𝐮 𝐜𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𓂃 🕊️\n' +
'⌜ 𖦹 𝐑𝐮𝐛𝐲 𝐇𝐨𝐬𝐡𝐢𝐧𝐨 𖦹 ⌟';

      const thumb = (await conn.getFile(thumbnail)).data;

      await conn.sendMessage(m.chat, { text: infoMessage }, {
        quoted: m,
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: 'YouTube Downloader',
            mediaType: 1,
            previewType: 0,
            mediaUrl: url,
            sourceUrl: url,
            thumbnail: thumb,
            renderLargerThumbnail: true
          }
        }
      });

      let audioUrl;
      let errorObteniendoAudio = false;

      // Intentar con la primera API (neoxr.eu) para audio
      try {
        const apiUrlAudio = `https://api.neoxr.eu/api/youtube?url=${url}&type=audio&quality=128kbps&apikey=Paimon`;
        const resAudio = await fetch(apiUrlAudio);
        const jsonAudio = await resAudio.json();
        audioUrl = jsonAudio.download || jsonAudio.data?.url;
        if (!audioUrl) {
          console.warn('Advertencia: No se obtuvo enlace de audio válido de neoxr.eu.');
          errorObteniendoAudio = true;
        }
      } catch (errorAudio) {
        console.error('Error al obtener el audio de neoxr.eu:', errorAudio);
        errorObteniendoAudio = true;
      }

      // Si hubo un error con la API de audio, intentar con yt-dlp-web
      if (errorObteniendoAudio) {
        try {
          const ytdlpWebUrl = 'https://ytdlp-web.kavin.rocks/api/info';
          const responseYtdlp = await fetch(ytdlpWebUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
          });

          if (responseYtdlp.ok) {
            const dataYtdlp = await responseYtdlp.json();
            if (dataYtdlp && dataYtdlp.formats) {
              const audioFormats = dataYtdlp.formats.filter(f => f.acodec !== 'none').sort((a, b) => (b.abr || 0) - (a.abr || 0));
              if (audioFormats.length > 0) {
                audioUrl = audioFormats[0].url;
                console.log('Éxito al obtener el audio de yt-dlp-web.');
                errorObteniendoAudio = false;
              } else {
                console.warn('Advertencia: No se encontraron formatos de audio en yt-dlp-web.');
                errorObteniendoAudio = true;
              }
            } else {
              console.warn('Advertencia: Respuesta inesperada de yt-dlp-web.');
              errorObteniendoAudio = true;
            }
          } else {
            console.error(`Error al comunicarse con yt-dlp-web: ${responseYtdlp.status} ${responseYtdlp.statusText}`);
            errorObteniendoAudio = true;
          }
        } catch (errorYtdlp) {
          console.error('Error al obtener el audio de yt-dlp-web:', errorYtdlp);
          errorObteniendoAudio = true;
        }
      }

      // Si las APIs de audio fallan, intentar descargar el video con api.neoxr.eu y convertir con ffmpeg
      if (errorObteniendoAudio) {
        try {
          m.reply('🔄 Fallaron las APIs de audio. Intentando descargar el video y convertirlo con ffmpeg...');
          const tmpDir = tmpdir();
          const videoName = `${title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
          const audioName = `${title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
          const videoPath = path.join(tmpDir, videoName);
          const audioPath = path.join(tmpDir, audioName);

          const apiUrlVideo = `https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=360p&apikey=Paimon`; // Puedes ajustar la calidad
          const resVideo = await fetch(apiUrlVideo);
          const jsonVideo = await resVideo.json();
          const videoDownloadUrl = jsonVideo.download || jsonVideo.data?.url;

          if (!videoDownloadUrl) {
            throw new Error('No se pudo obtener el enlace de descarga del video de api.neoxr.eu.');
          }

          const downloadCommand = `wget -O "${videoPath}" "${videoDownloadUrl}"`;
          const convertCommand = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -ab 128k "${audioPath}"`;

          await new Promise((resolve, reject) => {
            exec(downloadCommand, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error al descargar el video con wget: ${error.message}`);
                reject(error);
                return;
              }
              console.log(`Descarga del video exitosa (wget):\n${stdout}\n${stderr}`);
              resolve();
            });
          });

          await new Promise((resolve, reject) => {
            exec(convertCommand, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error al convertir el video a audio: ${error.message}`);
                reject(error);
                return;
              }
              console.log(`Conversión a audio exitosa:\n${stdout}\n${stderr}`);
              resolve();
            });
          });

          await conn.sendMessage(m.chat, {
            audio: { url: audioPath },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
          }, { quoted: m });

          await fs.unlink(videoPath);
          await fs.unlink(audioPath);

        } catch (ffmpegError) {
          console.error('Error al descargar o convertir con ffmpeg:', ffmpegError);
          m.reply(`❌ Error al descargar y convertir el video: ${ffmpegError.message}.`);
        }
        return; // Importante: detener la ejecución aquí si ffmpeg se usó
      }

      // Si se obtuvo audio de alguna API, enviarlo
      if (audioUrl) {
        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`
        }, { quoted: m });
      } else {
        m.reply('❌ No se pudo obtener el audio del video.');
      }

    } catch (err) {
      console.error('Error en .play:', err);
      m.reply(`❌ Error al procesar la búsqueda: ${err.message}`);
    }
  }
};

const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['play'];
handler.help = ['play <nombre>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;