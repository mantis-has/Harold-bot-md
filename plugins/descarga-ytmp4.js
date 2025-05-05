import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎬';

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} *Debes ingresar un link de YouTube para descargar el video en MP4.*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/ryVgEcaJhwM`, m);
  }

  const url = args[0];

  try {
    await conn.reply(m.chat, `${emoji} *Espérame un momentito, voy por tu video~* 💨`, m);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`);
    const json = await res.json();

    if (!json.download) {
      return conn.reply(m.chat, `${emoji} *No pude encontrar el video, senpai~* 😿`, m);
    }

    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${json.title || 'video'}.mp4`,
      caption: `${emoji} *Aquí tienes tu video, senpai~!* 💖\n\n🎞️ Título: ${json.title}\n📽️ Calidad: ${json.quality}p`,
      contextInfo: {
        externalAdReply: {
          title: json.title,
          body: '🎀 Ruby Hoshino Bot - MP4',
          thumbnailUrl: 'https://files.catbox.moe/e5801p.jpg', // Imagen opcional
          mediaType: 2,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, `❌ *Ocurrió un error inesperado~*\n🧪 Mensaje: ${e.message}`, m);
  }
};

handler.help = ['ytmp4'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytvideo', 'ytmp4dl'];
handler.register = true;
handler.limit = true;
handler.coin = 3;

export default handler;
