import yts from 'yt-search';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { exec } from 'child_process';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, text, command, botname }) => {
  if (command === 'play') {
    if (!text?.trim()) {
      return conn.reply(m.chat, '❗ Ingresa el nombre del video que deseas buscar.', m);
    }
    try {
      conn.reply(m.chat, '⏳ Buscando y preparando descarga y conversión de audio...', m);
      const search = await yts(text);
      if (!search.all.length) {
        return m.reply('✧ No se encontraron resultados para tu búsqueda.');
      }

      const videoInfo = search.all[0];
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
        '> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨:* ' + ago + '\n' +
        '> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐄𝐧𝐥𝐚𝐜𝐞:* ' + url + '\n' +
        '.⏝࿚‿᧔᧓‿࿙⏝.\n\n' +
        'ᅟ  !    𝅼        🎬ᩙᩖ     ㅤׁ   ꒰꒰   𝅼         ꯴\n\n' +
        '❙᳝፝۫֔🍒̸̷͚᪲໑ּ๋݂͚ 𝐄𝐬𝐩𝐞𝐫𝐚... 𝐬𝐞 𝐞𝐬𝐭𝐚́ 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐭𝐮 𝐜𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𓂃 🕊️\n' +
        '⌜ 𖦹 𝐑𝐮𝐛𝐲 𝐇𝐨𝐬𝐡𝐢𝐧𝐨 𖦹 ⌟';

      const thumb = (await conn.getFile(thumbnail)).data;

      const JT = {
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: 'Descargando audio...',
            mediaType: 1,
            previewType: 0,
            mediaUrl: url,
            sourceUrl: url,
            thumbnail: thumb,
            renderLargerThumbnail: true,
          },
        },
      };

      await conn.reply(m.chat, infoMessage, m, JT);

      const tmpDir = tmpdir();
      const videoName = `${title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
      const audioName = `${title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
      const videoPath = path.join(tmpDir, videoName);
      const audioPath = path.join(tmpDir, audioName);

      const downloadCommand = `yt-dlp -o "${videoPath}" "${url}"`;
      const convertCommand = `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -ab 128k "${audioPath}"`;

      try {
        await new Promise((resolve, reject) => {
          exec(downloadCommand, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error al descargar el video: ${error.message}`);
              reject(error);
              return;
            }
            console.log(`Descarga del video exitosa:\n${stdout}\n${stderr}`);
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
          fileName: `${title}.mp3`,
        }, { quoted: m });

        await fs.unlink(videoPath);
        await fs.unlink(audioPath);

      } catch (error) {
        console.error('Error durante la descarga o conversión:', error);
        m.reply(`❌ Ocurrió un error durante la descarga o conversión: ${error.message}. Asegúrate de que yt-dlp y ffmpeg estén instalados y en el PATH.`);
      }
    }
  } catch (error) {
    console.error('Error general:', error);
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`);
  }
};

function formatViews(views) {
  if (views === undefined) return 'No disponible';
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}

handler.command = ['play'];
handler.help = ['play <nombre de la canción>'];
handler.tags = ['descargas'];

export default handler;