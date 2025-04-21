
import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
    if (!text) throw '❗ Ingresa el nombre del video que deseas buscar.'

    const search = await yts(text)
    const video = search.videos[0]
    if (!video) throw '❗ No se encontró ningún resultado.'

    const caption = `「✦」*${video.title}*\n\n` +
      `> 📺 Canal: *${video.author.name}*\n` +
      `> ⏱ Duración: *${video.timestamp}*\n` +
      `> 📅 Publicado: *${video.ago}*\n` +
      `> 👁️ Vistas: *${video.views.toLocaleString()}*\n` +
      `> 🔗 Link: ${video.url}`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption,
      footer: 'YouTube Downloader',
      buttons: [
        { buttonId: `.yta ${video.url}`, buttonText: { displayText: '🎵 Descargar Audio' } },
        { buttonId: `.ytv ${video.url}`, buttonText: { displayText: '🎥 Descargar Video' } }
      ],
      headerType: 4,
    }, { quoted: m })

    return m.react('🔍')
  }

  if (command === 'yta' || command === 'ytmp3') {
    const url = args[0]
    if (!url || !url.includes('youtu')) throw '❗ URL de YouTube no válida.'

    const apis = [
      `https://api.alyachan.dev/api/youtube?url=${url}&type=mp3&apikey=Gata-Dios`,
      `https://delirius-apiofc.vercel.app/download/ytmp3?url=${url}`,
      `https://api.vreden.my.id/api/ytmp3?url=${url}`
    ]

    let audio = null
    for (const api of apis) {
      try {
        const res = await fetch(api)
        const json = await res.json()
        const link = json?.data?.url || json?.result?.download?.url || json?.data?.download?.url
        if (link) {
          audio = link
          break
        }
      } catch (e) {
        console.log(`❌ Falló la API: ${api}`)
        continue
      }
    }

    if (!audio) throw '❌ No se pudo obtener el audio desde ninguna API.'

    await conn.sendFile(m.chat, audio, 'audio.mp3', '', m, false, {
      mimetype: 'audio/mpeg'
    })
    return m.react('✅')
  }

  if (command === 'ytv' || command === 'ytmp4') {
    const url = args[0]
    if (!url || !url.includes('youtu')) throw '❗ URL de YouTube no válida.'

    const apis = [
      `https://api.alyachan.dev/api/youtube?url=${url}&type=mp4&apikey=Gata-Dios`,
      `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`,
      `https://api.vreden.my.id/api/ytmp4?url=${url}`
    ]

    let video = null
    for (const api of apis) {
      try {
        const res = await fetch(api)
        const json = await res.json()
        const link = json?.data?.url || json?.result?.download?.url || json?.data?.download?.url
        if (link) {
          video = link
          break
        }
      } catch (e) {
        console.log(`❌ Falló la API: ${api}`)
        continue
      }
    }

    if (!video) throw '❌ No se pudo obtener el video desde ninguna API.'

    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      caption: ''
    }, { quoted: m })
    return m.react('✅')
  }
}

handler.command = ['play', 'yta', 'ytmp3', 'ytv', 'ytmp4']
handler.help = ['play <nombre>', 'yta <url>', 'ytv <url>']
handler.tags = ['downloader']
handler.register = true

export default handler