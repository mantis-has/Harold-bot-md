import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';

  // Validación de enlace
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* ¡necesito un link de YouTube para traerte el video!*\n\nUso: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`,
      m
    );
  }

  const url = args[0];
  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `${emoji} *Un momento, convirtiendo el video con todo mi ❤️…*`,
      m
    );

    // Llamada a la API
    const res = await fetch(
      `https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`
    );
    const json = await res.json();

    // Validación de respuesta
    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.*\nRazón: ${json.message || 'desconocida'}`,
        m
      );
    }

    // Descarga en buffer
    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title = json.title || 'video';

    // Envío como video real
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: `${emoji} *Aquí está tu video kawaii~*\n\n📝 *Título:* ${title}\n🏷️ *Calidad:* ${json.quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: 'Ruby Hoshino Bot',
            thumbnailUrl: 'https://files.catbox.moe/e5801p.jpg',
            mediaType: 2,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo salió mal al descargar el video.*\nDetalles: ${e.message}`,
      m
    );
  }
};

handler.help = ['ytmp4'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytvideo', 'ytmp4dl'];
handler.register = true;
handler.limit = true;
handler.coin = 3;

export default handler;
