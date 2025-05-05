import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';

  // Validación de enlace
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* ¡necesito un link de YouTube para traerte el video!\n\n🌸 Uso correcto:\n*${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      {
        contextInfo: {
          forwardingScore: 0,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: packname,
            body: `👋 Hola ${nombre}`,
            mediaType: 3,
            sourceUrl: redes,
            thumbnail: icons
          }
        }
      },
      { quoted: fkontak }
    );
  }

  const url = args[0];

  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `🌺 *E S P E R A~*\n- 💫 Estoy descargando tu video kawaii... dame unos segundos, porfi >w<`,
      m,
      {
        contextInfo: {
          forwardingScore: 0,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: packname,
            body: `👋 Hola ${nombre}`,
            mediaType: 3,
            sourceUrl: redes,
            thumbnail: icons
          }
        }
      },
      { quoted: fkontak }
    );

    // Llamada a la API
    const res = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`);
    const json = await res.json();

    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.*\nRazón: ${json.message || 'desconocida'}`,
        m,
        {
          contextInfo: {
            forwardingScore: 0,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: packname,
              body: `👋 Hola ${nombre}`,
              mediaType: 3,
              sourceUrl: redes,
              thumbnail: icons
            }
          }
        },
        { quoted: fkontak }
      );
    }

    // Descarga en buffer
    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title   = json.title   || 'video';
    const quality = json.quality || 'Desconocida';
    const author  = json.author  || 'No disponible';
    const date    = json.date    || 'No disponible';

    // Envío del video
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: `${emoji} *¡Video kawaii descargado exitosamente!* 💖\n\n📌 *Título:* ${title}\n👤 *Autor:* ${author}\n📆 *Publicado:* ${date}\n🎞️ *Calidad:* ${quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        contextInfo: {
          forwardingScore: 0,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: packname,
            body: `👋 Hola ${nombre}`,
            mediaType: 3,
            sourceUrl: redes,
            thumbnail: icons
          }
        }
      },
      { quoted: fkontak }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo salió mal al descargar el video.*\n\n💢 Detalles: ${e.message}`,
      m,
      {
        contextInfo: {
          forwardingScore: 0,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: packname,
            body: `👋 Hola ${nombre}`,
            mediaType: 3,
            sourceUrl: redes,
            thumbnail: icons
          }
        }
      },
      { quoted: fkontak }
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
