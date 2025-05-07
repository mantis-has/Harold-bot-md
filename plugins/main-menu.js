import fs from 'fs';
import moment from 'moment-timezone';
import path from 'path';
import os from 'os';

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const user = conn.getName(m.sender);
    const plugins = Object.values(global.plugins).filter(p => !p.disabled);
    const categories = {};

    // Inicia el tiempo de ejecución
    const startTime = process.hrtime();

    // Clasificar comandos por categorías (tags)
    for (const plugin of plugins) {
      if (!plugin.help || !plugin.tags) continue;
      for (const tag of plugin.tags) {
        if (!categories[tag]) categories[tag] = [];
        plugin.help.forEach(cmd => {
          categories[tag].push(`${usedPrefix}${cmd}`);
        });
      }
    }

    // Armar menú dinámico
    let bodyMenu = '';
    for (const [tag, cmds] of Object.entries(categories)) {
      bodyMenu += `║═════〔 *${tag.toUpperCase()}* 〕═══\n`;
      cmds.forEach(cmd => {
        bodyMenu += `║☆ ${cmd}\n`;
      });
    }

    const encabezado = `
☆✼★━━━━━━━━━━━━━━━━━★✼☆｡
        ┎┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┒
    𓏲꯭֟፝੭ ꯭⌑(꯭𝐑).꯭𝐔.꯭𝐁.꯭𝐘.꯭ ⭑𝐇.꯭𝐎.꯭𝐒.꯭𝐇.꯭𝐈.꯭𝐍.꯭𝐎.꯭𓏲꯭֟፝੭ 
        ┖┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┚
｡☆✼★━━━━━━━━━━━━━━━━━★✼☆｡


"¡Hola, Yo! Mi nombre es Ruby Hoshino ٩(˘◡˘)۶"
Aquí tienes la lista de comandos

╔═══════⩽✦✰✦⩾═══════╗
       「 𝙄𝙉𝙁𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏 」
╚═══════⩽✦✰✦⩾═══════╝
║ ☆ 🌟 𝖳𝖨𝖯𝖮 𝖣𝖤 𝖡𝖮𝖳         : 𝖶𝖠𝖨𝖥𝖴
║ ☆ 🚩 𝖬𝖮𝖣𝖮    : 𝖯𝖴𝖡𝖫𝖨𝖢𝖮
║ ☆ 📚 B𝖠𝖨𝖫𝖤𝖸𝖲      : 𝖬𝖴𝖫𝖳𝖨 𝖣𝖤𝖵𝖨𝖢𝖤
║ ☆📦 Runtime:* ${runtime(process.uptime())}
║ ☆📈 Usuarios:* ${Object.keys(global.db.data.users).length}
║ ☆📍 Plataforma:* ${os.platform()}
║ ☆📡 Velocidad:* ${getSpeed(startTime).toFixed(4)} ms
║ ☆ 👩‍💻 𝖢𝖱𝖤𝖠𝖣𝖮𝖱       : [𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑](https://Wa.me/18294868853)
╚════════════════════════╝
Crea un Sub-Bot con tu número utilizando #qr o #code

╔══⩽✦✰✦⩾══╗
   「 𝘽𝙤𝙩 𝙊𝙛𝙞𝙘𝙞𝙖𝙡 」
╚══⩽✦✰✦⩾══╝

╔═══════⩽✦✰✦⩾═══════╗
`.trim();

    const txt = `${encabezado}\n${bodyMenu}╚════════════════════════╝`;

    // Mostrar mensaje "Enviando menú..."
    await conn.reply(m.chat, '*ꪹ͜𓂃⌛͡𝗘𝗻𝘃𝗶𝗮𝗻𝗱𝗼 𝗠𝗲𝗻𝘂 𝗱𝗲𝗹 𝗕𝗼𝘁....𓏲੭*', fkontak, {
      contextInfo: {
        forwardingScore: 2022,
        isForwarded: true,
        externalAdReply: {
          title: packname,
          body: '¡explora la gran variedad de comandos!',
          sourceUrl: redes,
          thumbnail: icons
        }
      }
    });

    // Cargar video aleatorio
    const videoDir = path.join(process.cwd(), 'src', 'menu');
    const videos = fs.existsSync(videoDir)
      ? fs.readdirSync(videoDir).filter(file => file.endsWith('.mp4'))
      : [];

    if (videos.length > 0) {
      const randomGif = path.join(videoDir, videos[Math.floor(Math.random() * videos.length)]);
      await conn.sendMessage(m.chat, {
        video: { url: randomGif },
        caption: txt,
        gifPlayback: true,
        contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363335626706839@newsletter',
            newsletterName: '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡',
            serverMessageId: -1
          },
          externalAdReply: {
            title: 'ׄ❀ׅᮢ໋۬۟   ׁ ᮫᩠𝗥ᥙ᜔᪲𝖻ֹ𝘺 𝐇֢ᩚᨵ̷̸ׁׅׅ𝗌𝗁𝗂ᮬ𝗇֟፝͡𝗈̷̸  ꫶֡ᰵ࡙🌸̵໋ׄᮬ͜✿֪',
            body: dev,
            thumbnail: icons,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    } else {
      await m.reply(txt);
    }

  } catch (error) {
    console.error('[ERROR EN MENU]', error);
    await m.reply('⚠️ Error al generar el menú.\n\n' + error);
  }
};

handler.command = ['menu', 'help', 'comandos'];
export default handler;

function runtime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function getSpeed(startTime) {
  const elapsed = process.hrtime(startTime);
  const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1000000; // Convertir a milisegundos
  return elapsedMs;
}

