import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, text, command, args, botname }) => {
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
'> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨:* ' + ago + '\n' +
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

      const api = await fetchAPI(url, 'video')
      const videoUrl = api.download || api.data?.url
      if (!videoUrl) throw new Error('No se pudo obtener el enlace del video.')

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`)
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`)

      const res = await fetch(videoUrl)
      const stream = fs.createWriteStream(tempVideo)
      await new Promise((resolve, reject) => {
        res.body.pipe(stream)
        res.body.on('error', reject)
        stream.on('finish', resolve)
      })

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 64k -ar 44100 -y "${tempAudio}"`, err => {
          if (err) return reject(err)
          resolve()
        })
      })

      const buffer = fs.readFileSync(tempAudio)
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m })

      fs.unlinkSync(tempVideo)
      fs.unlinkSync(tempAudio)

    } catch (err) {
      console.error('Error en .play:', err)
      m.reply(`❌ Error al procesar el audio: ${err.message}`)
    }
  }
}

const fetchAPI = async (url, type) => {
  const endpoints = [
    `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=144p&apikey=Paimon`,
    `https://api.vreden.my.id/api/yt${type}?url=${url}`
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint);
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.status || json.data || json.download) return json;
    } catch (e) {
      console.warn('Falló un endpoint:', endpoint);
    }
  }

  throw new Error('Todas las fuentes fallaron al intentar obtener el video/audio.');
}

const formatViews = (views) => {
  if (!views) return '0'
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`
  return views.toString()
}

handler.command = ['play']
handler.help = ['play <nombre>']
handler.tags = ['descargas']
handler.register = true

export default handler