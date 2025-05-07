import fetch from 'node-fetch';

const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡';
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
      sourceUrl: '', // Se eliminó 'redes' como pediste
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* pásame un link de YouTube para traer tu video.\n\nUso: *${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ*`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const url = args[0];

  try {
    await conn.reply(
      m.chat,
      `🌺 *E S P E R E*\n- 🍃 Se está descargando su video, dame un momentito >w<`,
      m,
      { contextInfo, quoted: m }
    );

    const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`);
    const json = await res.json();

    if (!json.result || !json.result.video) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.* Razón: ${json.message || 'desconocida'}`,
        m,
        { contextInfo, quoted: m }
      );
    }

    const videoRes    = await fetch(json.result.video);
    const videoBuffer = await videoRes.buffer();

    const title   = json.result.title || 'video';
    const author  = json.result.channel || 'Desconocido';
    const views   = json.result.views || 'No disponible';
    const date    = json.result.uploadDate || 'No disponible';
    const quality = '360'; // Esta API ya entrega a 360p directamente

    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption:
`${emoji} *¡Tu videito está listo!* 💖

📌 *Título:* ${title}
👤 *Autor:* ${author}
📅 *Publicado:* ${date}
👁️ *Vistas:* ${views}
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
