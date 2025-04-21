import fetch from 'node-fetch';
import yts from 'yt-search';
import axios from 'axios';
const MAX_SIZE_MB = 100;

const handler = async (m, { conn, text, usedPrefix, command, botname }) => {
  if (command === 'play') {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m);
    }
    try {
      conn.reply(m.chat, '⏳ Buscando y preparando descarga de audio...', m); // Mensaje de espera
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
            body: canal || 'YouTube Audio', // Indicando que es audio
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

      const api = await fetchAPI(url, 'audio');
      let result;
      if (api && api.download) {
        result = api.download;
      } else if (api && api.data && api.data.url) {
        result = api.data.url;
      } else {
        return m.reply('⚠︎ No se pudo obtener el enlace de descarga de audio.');
      }

      const fileSizeMB = await getFileSize(result);

      if (fileSizeMB > MAX_SIZE_MB) {
        await conn.sendMessage(m.chat, { document: { url: result }, fileName: `${api.title || (api.data && api.data.filename) || 'audio'}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${api.title || (api.data && api.data.filename) || 'audio'}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
      }
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`);
  }
};

const fetchAPI = async (url, type) => {
  const fallbackEndpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=128kbps&apikey=Paimon`;
  try {
    const response = await fetch(fallbackEndpoint);
    if (!response.ok) {
      console.error(`Error al fetchear la API (${fallbackEndpoint}): ${response.status} ${response.statusText}`);
      return null; // Indica que hubo un error
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al conectar con la API (${fallbackEndpoint}): ${error.message}`);
    return null; // Indica que hubo un error
  }
};

const getFileSize = async (url) => {
  try {
    const response = await axios.head(url);
    const sizeInBytes = response.headers['content-length'] || 0;
    return parseFloat((sizeInBytes / (1024 * 1024)).toFixed(2));
  } catch (error) {
    console.error(`Error al obtener el tamaño del archivo de ${url}: ${error.message}`);
    return 0;
  }
};
handler.command = ['play'];
handler.help = ['play <nombre de la canción>'];
handler.tags = ['descargas'];

export default handler;

function formatViews(views) {
  if (views === undefined) return 'No disponible';
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}