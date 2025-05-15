import { search, download } from 'aptoide-scraper'

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const emoji = '📦';
  const emoji2 = '❌';
  const rwait = '⏳';
  const done = '✅';
  const msm = '⚠️';
  const fkontak = m; // Puedes personalizar esto si tienes un contacto falso

  if (!text) return conn.reply(m.chat, `${emoji2} Por favor, ingresa el nombre de la APK que deseas descargar.`, m);

  try {
    await m.react(rwait);
    await conn.reply(m.chat, `${emoji} Buscando su aplicación, espere un momento...`, m);

    let searchA = await search(text);
    if (!searchA || searchA.length === 0) return conn.reply(m.chat, `${emoji2} No se encontraron resultados para: ${text}`, m);

    let data5 = await download(searchA[0].id);

    let txt = `*乂  APTOIDE - DESCARGAS* 乂\n\n`;
    txt += `☁️ *Nombre:* ${data5.name}\n`;
    txt += `🔖 *Paquete:* ${data5.package}\n`;
    txt += `🚩 *Última actualización:* ${data5.lastup}\n`;
    txt += `⚖️ *Peso:* ${data5.size}`;

    await conn.sendFile(m.chat, data5.icon, 'icon.jpg', txt, m);
    await m.react(done);

    // Verificar si pesa más de 999 MB
    const peso = parseFloat(data5.size.replace(' MB', '').replace(',', '.'));
    if (data5.size.includes('GB') || peso > 999) {
      return await conn.reply(m.chat, `${emoji2} El archivo es demasiado pesado para enviarlo.`, m);
    }

    await conn.sendMessage(m.chat, {
      document: { url: data5.dllink },
      mimetype: 'application/vnd.android.package-archive',
      fileName: data5.name + '.apk',
      caption: null
    }, { quoted: fkontak });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, `${msm} Ocurrió un fallo al descargar.`, m);
  }
};

handler.tags = ['descargas'];
handler.help = ['apkmod'];
handler.command = ['apk', 'modapk', 'aptoide'];
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;
