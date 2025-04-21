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

const handler = async (m, { conn, text, usedPrefix, command, botname, dev, args }) => {
  console.log(`Comando recibido: ${command}`);

  if (command === 'play') {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m);
    }
    try {
      const search = await yts(text);
      if (!search.all.length) {
        return m.reply('✧ No se encontraron resultados para tu búsqueda.');
      }

      const videoInfo = search.all[0];
      const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
      const vistas = formatViews(views);
      const canal = author.name || 'Desconocido';
      const infoMessage =
        `︵۪۪۪۪۪۪۪⏜໋᳝ׅ۪۪۪࣪╼╽═┅᪲━᳝ׅ࣪🍒━ּ᳝ׅ࣪ᰰᩫ┅═╽╾໋᳝۪۪۪۪࣪⏜۪۪۪۪۪۪۪۪︵\n` +
        `░ׅ ׄᰰׅ᷒𓎆  ֺᨳ︪︩፝֟͝. *DESCARGAS - ${botname} 🔥* :\n\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐓𝐢𝐭𝐮𝐥𝐨:* ${title}\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐂𝐚𝐧𝐚𝐥:* ${canal}\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐕𝐢𝐬𝐭𝐚𝐬:* ${views}\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧:* ${timestamp}\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨:* ${ago}\n` +
        `> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐄𝐧𝐥𝐚𝐜𝐞:* ${url}\n` +
        `.⏝࿚‿᧔᧓‿࿙⏝.\n\n` +
        `ᅟ  !    𝅼        🎬ᩙᩖ     ㅤׁ   ꒰꒰   𝅼         ꯴\n\n` +
        `❙᳝፝۫֔🍒̸̷͚᪲໑ּ๋݂͚ 𝐄𝐬𝐩𝐞𝐫𝐚... 𝐬𝐞 𝐞𝐬𝐭𝐚́ 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐭𝐮 𝐜𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𓂃 🕊️\n` +
        `⌜ 𖦹 ${botname} 𖦹 ⌟`;

      const thumb = (await conn.getFile(thumbnail)).data;

      const buttons = [
        { buttonId: `.getaudio ${url}`, buttonText: { displayText: '🎵 Audio' } },
        { buttonId: `.getvideo ${url}`, buttonText: { displayText: '🎥 Video' } },
      ];

      const buttonMessage = {
        image: { url: thumbnail },
        caption: infoMessage,
        footer: `Descargas - ${botname}`,
        buttons: buttons,
        headerType: 4,
      };

      await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (error) {
      console.error('Error en el comando "play":', error);
      m.reply(`❌ Ocurrió un error al buscar la música: ${error.message}`);
    }
  }

  if (command === 'getaudio') {
    if (!args[0] || !args[0].includes('youtu')) {
      return m.reply('❗ URL inválida o no proporcionada.');
    }
    const url = args[0];

    try {
      const api = await fetchAPI(url, 'audio');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) throw new Error('No se pudo obtener el video para extraer el audio.');

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
          if (err) return reject(err);
          resolve();
        });
      });

      const buffer = fs.readFileSync(tempAudio);
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || api.data.filename}.mp3`
      }, { quoted: m });

      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempAudio);

    } catch (error) {
      console.error('Error en el comando "getaudio":', error);
      return m.reply(`❌ Error al convertir audio: ${error.message}`);
    }
  }

  if (command === 'getvideo') {
    if (!args[0] || !args[0].includes('youtu')) {
      return m.reply('❗ URL inválida o no proporcionada.');
    }
    const url = args[0];

    try {
      const api = await fetchAPI(url, 'video');
      const videoUrl = api.download || api.data?.url;
      if (!videoUrl) throw new Error('No se pudo obtener el video.');

      const sizeMB = await getFileSize(videoUrl);

      if (sizeMB > MAX_SIZE_MB) {
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName: `${api.title || api.data.filename}.mp4`
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `${api.title || ''}`
        }, { quoted: m });
      }

    } catch (error) {
      console.error('Error en el comando "getvideo":', error);
      return m.reply(`❌ Error al obtener video: ${error.message}`);
    }
  }
};

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=${type === 'audio' ? '128kbps' : '720p'}&apikey=Paimon`;
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching API:', error);
    return { status: false, message: error.message };
  }
};

const getFileSize = async (url) => {
  try {
    const res = await axios.head(url);
    const size = res.headers['content-length'] || 0;
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    return parseFloat(sizeMB);
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['play', 'getaudio', 'getvideo'];
handler.help = ['play <nombre de la canción>', 'getaudio <url>', 'getvideo <url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
