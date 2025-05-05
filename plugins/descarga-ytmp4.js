import fetch from 'node-fetch';

const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡';
const packname = 'ׄ❀ׅᮢ໋۬۟   ׁ ᮫᩠𝗥ᥙ᜔᪲𝖻ֹ𝘺 𝐇֢ᩚᨵ̷̸ׁׅׅ𝗌𝗁𝗂ᮬ𝗇֟፝͡𝗈̷̸  ꫶֡ᰵ࡙🌸̵໋ׄᮬ͜✿֪';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';

  // Verificar que haya un enlace
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Oh, senpai~* pásame un link de YouTube para traer tu video.\n\nUso: *${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      {
        contextInfo: {
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
            mediaType: 1,
            renderLargerThumbnail: false
          }
        },
        quoted: m
      }
    );
  }

  const url = args[0];

  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `🌺 *E S P E R E*\n- 🍃 Se está descargando su video, dame un momentito >w<`,
      m,
      {
        contextInfo: {
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
            mediaType: 1,
            renderLargerThumbnail: false
          }
        },
        quoted: m
      }
    );

    // Llamada a la API para obtener el video
    const res = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`);
    const json = await res.json();

    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.* Razón: ${json.message || 'desconocida'}`,
        m,
        {
          contextInfo: {
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
              mediaType: 1,
              renderLargerThumbnail: false
            }
          },
          quoted: m
        }
      );
    }

    // Descargar el video
    const videoRes = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title = json.title || 'video';
    const quality = '360'; // Forzar calidad a 360p
    const author = json.author || 'No disponible';
    const date = json.date || 'No disponible';
    const views = json.views || 'No disponible';
    const duration = json.duration || 'No disponible';

    // Enviar el video
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: 
`${emoji} *¡Tu video kawaii está listo!* 💖

📌 *Título:* ${title}
👤 *Autor:* ${author}
📆 *Publicado:* ${date}
👁️ *Vistas:* ${views}
⏱️ *Duración:* ${duration}
🎞️ *Calidad:* ${quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      },
      {
        contextInfo: {
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
            mediaType: 1,
            renderLargerThumbnail: false
          }
        },
        quoted: m
      }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo falló al descargar el video.*\nDetalles: ${e.message}`,
      m,
      {
        contextInfo: {
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
            mediaType: 1,
            renderLargerThumbnail: false
          }
        },
        quoted: m
      }
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
