// ︵۪۪۪۪۪۪۪⏜໋᳝ׅ۪۪۪࣪╼╽═┅᪲━᳝ׅ࣪🍒━ּ᳝ׅ࣪ᰰᩫ┅═╽╾໋᳝۪۪۪۪࣪⏜۪۪۪۪۪۪۪۪︵
//      ꩘᮫۪࣫🪷 𝙈𝙤𝙙𝙪𝙡𝙤𝙨 𝙞𝙢𝙥𝙤𝙧𝙩𝙖𝙙𝙤𝙨 𝒙 𝒀𝒂𝒔𝒉𝒊𝒓𝒐
// ══╽╾🍒🌟╼╽═════╾╽🌟🍒╼╽═════╾╽🌟🍒╼╽═════
import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

// ︵‿︵‿︵‿︵‿︵‿︵‿︵
// ✧ F𝙤𝙧𝙢𝙖𝙩𝙤𝙨 𝙙𝙚 𝘼𝙪𝙙𝙞𝙤 & 𝙑𝙞𝙙𝙚𝙤 ✧
const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav']
const formatVideo = ['360', '480', '720', '1080', '1440', '4k']

// ━━᳝ׅ࣪🍒 𝙁𝙪𝙣𝙘𝙞𝙤́𝙣 𝙥𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡 - ddownr 🍒᳝ׅ࣪━━
const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('⛔ Formato no soportado, verifica los disponibles.')
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...'
      }
    }

    try {
      const response = await axios.request(config)

      if (response.data && response.data.success) {
        const { id, title, info } = response.data
        const { image } = info
        const downloadUrl = await ddownr.cekProgress(id)

        return { id, image, title, downloadUrl }
      } else {
        throw new Error('⚠︎ No se pudo obtener los detalles del video.')
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  // ╭─💠 𝙍𝙚𝙫𝙞𝙨𝙖 𝙚𝙡 𝙋𝙧𝙤𝙜𝙧𝙚𝙨𝙤 💠─╮
  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...'
      }
    }

    try {
      while (true) {
        const response = await axios.request(config)
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url
        }
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }
}

// ╰─▣🎧 𝐇𝐀𝐍𝐃𝐋𝐄𝐑 - 𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀 𝐘 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀 🎧▣─╯
const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `❀ Ingresa el nombre de la música a descargar.`, m)

    const search = await yts(text)
    if (!search.all || search.all.length === 0) {
      return m.reply('🔍 No se encontraron resultados.')
    }

    const videoInfo = search.all[0]
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo
    const vistas = formatViews(views)

    const infoMessage = `
    ︵۪۪۪۪۪۪۪⏜໋᳝ׅ۪۪۪࣪╼╽═┅᪲━᳝ׅ࣪🍒━ּ᳝ׅ࣪ᰰᩫ┅═╽╾໋᳝۪۪۪۪࣪⏜۪۪۪۪۪۪۪۪︵
░ׅ ׄᰰׅ᷒𓎆  ֺᨳ︪︩፝֟͝. `DESCARGAS - RUBY 🔥` :

> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐓𝐢𝐭𝐮𝐥𝐨:* ${title}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐂𝐚𝐧𝐚𝐥:* ${videoInfo.author.name || Desconocido}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐕𝐢𝐬𝐭𝐚𝐬:* ${vistas} 
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧:* ${timestamp}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨:* ${ago}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐄𝐧𝐥𝐚𝐜𝐞:* ${url}
       .⏝࿚‿᧔᧓‿࿙⏝.

ᅟ  !    𝅼        🎬ᩙᩖ     ㅤׁ   ꒰꒰   𝅼         ꯴

            ❙᳝፝۫֔🍒̸̷͚᪲໑ּ๋݂͚ 𝐄𝐬𝐩𝐞𝐫𝐚... 𝐬𝐞 𝐞𝐬𝐭𝐚́ 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐭𝐮 𝐜𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𓂃 🕊️
                      ⌜ 𖦹 𝐑𝐮𝐛𝐲 𝐇𝐨𝐬𝐡𝐢𝐧𝐨 𖦹 ⌟

    const thumb = (await conn.getFile(thumbnail))?.data

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    // 🎵 Audio
    if (['play', 'yta', 'ytmp3'].includes(command)) {
      const api = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=audio&quality=128kbps&apikey=GataDios`)).json()
      await conn.sendMessage(m.chat, { audio: { url: api.data.url }, mimetype: "audio/mpeg" }, { quoted: m })

    // 🎥 Video
    } else if (['play2', 'ytv', 'ytmp4'].includes(command)) {
      const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
      const json = await response.json()

      try {
        await conn.sendMessage(m.chat, {
          video: { url: json.data.url },
          fileName: json.data.filename,
          mimetype: 'video/mp4',
          caption: '',
          thumbnail: json.thumbnail
        }, { quoted: m })
      } catch (e) {
        console.error(`⚠︎ Error con la fuente de descarga:`, e.message)
      }

    } else {
      throw "⛔ Comando no reconocido."
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`)
  }
}

// ︵✧ 𝐌𝐄𝐓𝐀𝐃𝐀𝐓𝐎𝐒 ✧︵
handler.command = handler.help = ['play', 'play2', 'ytmp3', 'yta', 'ytmp4', 'ytv']
handler.tags = ['downloader']
export default handler

// ✧ 𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐝𝐞 𝐯𝐢𝐬𝐭𝐚𝐬 ✧
function formatViews(views) {
  return views >= 1000 ? (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')' : views.toString()
}
