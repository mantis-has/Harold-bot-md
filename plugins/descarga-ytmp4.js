import fetch from 'node-fetch';

const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡';
// Variables de branding que ya tienes definidas:
const packname = 'ׄ❀ׅᮢ໋۬۟   ׁ ᮫᩠𝗥ᥙ᜔᪲𝖻ֹ𝘺 𝐇֢ᩚᨵ̷̸ׁׅׅ𝗌𝗁𝗂ᮬ𝗇֟፝͡𝗈̷̸  ꫶֡ᰵ࡙🌸̵໋ׄᮬ͜✿֪';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: dev,
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  // Verificar que haya link
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* pásame un link de YouTube para traer tu video.\n\nUso: *${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const url = args[0];

  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `🌺 *E S P E R A...* descargando tu video kawaii, dame un momentito >w<`,
      m,
      { contextInfo, quoted: m }
    );

    // Llamada a la API
    const res = await fetch(
      `https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`
    );
    const json = await res.json();

    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.* Razón: ${json.message || 'desconocida'}`,
        m,
        { contextInfo, quoted: m }
      );
    }

    // Descargar buffer
    const videoRes    = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title       = json.title   || 'video';
    const quality     = json.quality || 'Desconocida';
    const author      = json.author  || 'No disponible';
    const date        = json.date    || 'No disponible';

    // Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: 
`${emoji} *¡Tu video kawaii está listo!* 💖

📌 *Título:* ${title}
👤 *Autor:* ${author}
📆 *Publicado:* ${date}
🎞️ *Calidad:* ${quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      },
      { contextInfo, quoted: m }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo falló al descargar el video.*\nDetalles: ${e.message}`,
      m,
      { contextInfo, quoted: m }
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
