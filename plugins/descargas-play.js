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
          buttonText: { displayText: 'ᯓᡣ𐭩 Audio' },
        },
        {
          buttonId: `.ytv ${url}`,
          buttonText: { displayText: 'ᯓᡣ𐭩 Video' },
        },
      ],
      viewOnce: true,
      headerType: 4,
    }, { quoted: m });

    m.react('🕒');
  }

  // Descargar y enviar audio
  else if (command === 'yta' || command === 'ytmp3') {
    m.react('🕒');

    let audio;
    try {
      const res = await fetch(`https://api.alyachan.dev/api/youtube?url=${url}&type=mp3&apikey=Gata-Dios`);
      audio = await res.json();
    } catch {
      try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${url}`);
        audio = await res.json();
      } catch {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        audio = await res.json();
      }
    }

    if (!audio?.data?.url) throw 'No se pudo obtener el audio.';

    const audioBuffer = await fetch(audio.data.url).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${videoInfo.title}.mp3`,
      ptt: false
    }, { quoted: m });

    m.react('✅');
  }

  // Descargar y enviar video
  else if (command === 'ytv' || command === 'ytmp4') {
    m.react('🕒');

    let video;
    try {
      const res = await fetch(`https://api.alyachan.dev/api/youtube?url=${url}&type=mp4&apikey=Gata-Dios`);
      video = await res.json();
    } catch {
      try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`);
        video = await res.json();
      } catch {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`);
        video = await res.json();
      }
    }

    if (!video?.data?.url) throw 'No se pudo obtener el video.';

    const videoBuffer = await fetch(video.data.url).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${videoInfo.title}.mp4`,
      caption: '',
    }, { quoted: m });

    m.react('✅');
  }

  else {
    throw "Comando no reconocido.";
  }
};

handler.help = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'ytmp3', 'play2'];
handler.command = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'ytmp3', 'play2'];
handler.tags = ['dl'];
handler.register = true;

export default handler;