import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text) throw 'Por favor ingresa el nombre de la música que deseas descargar.';

  const search = await yts(text);
  if (!search.all || search.all.length === 0) throw "No se encontraron resultados.";

  const videoInfo = search.all[0];
  const url = videoInfo.url;

  const body = `「✦」Descargando *<${videoInfo.title}>*\n\n` +
    `> ✦ Canal » *${videoInfo.author.name || 'Desconocido'}*\n` +
    `> ✰ Vistas » *${videoInfo.views}*\n` +
    `> ⴵ Duración » *${videoInfo.timestamp}*\n` +
    `> ✐ Publicado » *${videoInfo.ago}*\n` +
    `> 🜸 Link » ${url}`;

  if (command === 'play' || command === 'play2' || command === 'playvid') {
    await conn.sendMessage(m.chat, {
      image: { url: videoInfo.thumbnail },
      caption: body,
      footer: 'YouTube Downloader',
      buttons: [
        {
          buttonId: `.yta ${url}`,
          buttonText: { displayText: 'ᯓ Audio' },
        },
        {
          buttonId: `.ytv ${url}`,
          buttonText: { displayText: 'ᯓ Video' },
        },
      ],
      viewOnce: true,
      headerType: 4,
    }, { quoted: m });
    return m.react('🕒');
  }

  if (command === 'yta' || command === 'ytmp3') {
    m.react('🕒');
    try {
      let audio;
      try {
        audio = await (await fetch(`https://api.alyachan.dev/api/youtube?url=${url}&type=mp3&apikey=Gata-Dios`)).json();
      } catch (e1) {
        try {
          audio = await (await fetch(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${url}`)).json();
        } catch (e2) {
          audio = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
        }
      }

      if (!audio?.data?.url) throw new Error('No se pudo obtener el enlace del audio.');
      await conn.sendFile(m.chat, audio.data.url, `${videoInfo.title}.mp3`, '', m, null, { mimetype: 'audio/mpeg' });
      return m.react('✅');
    } catch (err) {
      console.error(err);
      throw `Error al enviar el audio: ${err.message || err}`;
    }
  }

  if (command === 'ytv' || command === 'ytmp4') {
    m.react('🕒');
    try {
      let video;
      try {
        video = await (await fetch(`https://api.alyachan.dev/api/youtube?url=${url}&type=mp4&apikey=Gata-Dios`)).json();
      } catch (e1) {
        try {
          video = await (await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`)).json();
        } catch (e2) {
          video = await (await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`)).json();
        }
      }

      if (!video?.data?.url) throw new Error('No se pudo obtener el enlace del video.');
      await conn.sendMessage(m.chat, {
        video: { url: video.data.url },
        mimetype: 'video/mp4',
        caption: '',
      }, { quoted: m });
      return m.react('✅');
    } catch (err) {
      console.error(err);
      throw `Error al enviar el video: ${err.message || err}`;
    }
  }

  throw 'Comando no reconocido.';
};

handler.help = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'ytmp3', 'play2'];
handler.command = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'ytmp3', 'play2'];
handler.tags = ['dl'];
handler.register = true;

export default handler;