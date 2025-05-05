import fetch from 'node-fetch';


var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';
  const ctx = {
    mentionedJid: [m.sender, userId],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363335626706839@newsletter',
      newsletterName: '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡',
      serverMessageId: -1,
    },
    externalAdReply: {
      title: 'ׄ❀ׅᮢ໋۬۟   ׁ ᮫᩠𝗥ᥙ᜔᪲𝖻ֹ𝘺 𝐇֢ᩚᨵ̷̸ׁׅׅ𝗌𝗁𝗂ᮬ𝗇֟፝͡𝗈̷̸  ꫶֡ᰵ࡙🌸̵໋ׄᮬ͜✿֪',
      body: dev,
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  // Validación de enlace
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* ¡necesito un link de YouTube para traerte el video!\n\nUso: *${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      { contextInfo: ctx }
    );
  }

  const url = args[0];
  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `🌺 *E S P E R E*\n- 🍃 *Se está descargando su video, espere un momento...*`,
      m,
      { contextInfo: ctx }
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
        m,
        { contextInfo: ctx }
      );
    }

    // Descarga en buffer
    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title = json.title || 'video';

    // Envío como video real con contextInfo
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: `${emoji} *Aquí está tu video kawaii~*\n\n📝 *Título:* ${title}\n🏷️ *Calidad:* ${json.quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        contextInfo: ctx
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo salió mal al descargar el video.*\nDetalles: ${e.message}`,
      m,
      { contextInfo: ctx }
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
