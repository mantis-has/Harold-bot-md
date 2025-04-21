import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text) throw '❗ Ingresa el nombre o enlace del video que deseas buscar.';

  const search = await yts(text);
  if (!search.videos || search.videos.length === 0) throw '❗ No se encontraron resultados.';

  const video = search.videos[0];
  const url = video.url;

  const caption = `「✦」*${video.title}*\n\n` +
    `> ✦ Canal: *${video.author.name}*\n` +
    `> ✰ Vistas: *${video.views.toLocaleString()}*\n` +
    `> ⏱ Duración: *${video.timestamp}*\n` +
    `> 📅 Publicado: *${video.ago}*\n` +
    `> 🔗 Link: ${url}`;

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    footer: 'YouTube Downloader',
    buttons: [
      { buttonId: `.yta ${url}`, buttonText: { displayText: 'ᯓ Descargar Audio' } },
      { buttonId: `.ytv ${url}`, buttonText: { displayText: 'ᯓ Descargar Video' } }
    ],
    headerType: 4,
  }, { quoted: m });

  m.react('🔍');
};

handler.command = ['play', 'play2', 'playvid'];
handler.help = ['play <texto o enlace>'];
handler.tags = ['downloader'];
handler.register = true;
handler.group = true;
handler.private = true;

export default handler;