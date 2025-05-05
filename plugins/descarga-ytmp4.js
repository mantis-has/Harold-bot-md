import fetch from 'node-fetch';

const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡';

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
    }
  };

  // 1️⃣ Verificar link
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* ¡pásame un link de YouTube!*\n\n🌸 Uso:\n*${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const url = args[0];

  try {
    // 2️⃣ Mensaje de espera
    await conn.reply(
      m.chat,
      `🌺 *E S P E R A~*\n- 💫 Descargando tu video kawaii... un momento, porfi >w<`,
      m,
      { contextInfo, quoted: m }
    );

    // 3️⃣ Llamada a la API
    const res = await fetch(
      `https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`
    );
    const json = await res.json();

    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.*\nRazón: ${json.message || 'desconocida'}`,
        m,
        { contextInfo, quoted: m }
      );
    }

    // 4️⃣ Descargar buffer
    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title   = json.title   || 'video';
    const quality = json.quality || 'Desconocida';
    const author  = json.author  || 'No disponible';
    const date    = json.date    || 'No disponible';

    // 5️⃣ Enviar video con info
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
      `❌ *Ups… algo falló al descargar el video.*\n\n💢 Detalles: ${e.message}`,
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
