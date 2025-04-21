import yts from 'yt-search'
import fetch from 'node-fetch'
import axios from 'axios'

const MAX_SIZE_MB = 100

const handler = async (m, { conn, text, command, args, usedPrefix }) => {
  if (command === 'play') {
    if (!text.trim()) return m.reply('❗ Ingresa el nombre del video que deseas buscar.')

    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return m.reply('❗ No se encontró ningún resultado.')

    const info = `「✦」*${video.title}*\n\n` +
      `> 📺 Canal: *${video.author.name}*\n` +
      `> ⏱ Duración: *${video.timestamp}*\n` +
      `> 📅 Publicado: *${video.ago}*\n` +
      `> 👁️ Vistas: *${formatViews(video.views)}*\n` +
      `> 🔗 Link: ${video.url}`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: info,
      footer: 'YouTube Downloader',
      buttons: [
        { buttonId: `.getaudio ${video.url}`, buttonText: { displayText: '🎵 Descargar Audio' } },
        { buttonId: `.getvideo ${video.url}`, buttonText: { displayText: '🎥 Descargar Video' } }
      ],
      headerType: 4
    }, { quoted: m })

    return m.react('🔍')
  }

  const url = args[0]
  if (!url || !url.includes('youtu')) return m.reply('❗ URL inválida o no proporcionada.')

  if (command === 'getaudio') {
    try {
      const api = await fetchAPI(url, 'video')
      const videoUrl = api.download || api.data?.url
      if (!videoUrl) throw new Error('No se pudo obtener el video para extraer el audio.')

      const buffer = await fetch(videoUrl).then(res => res.buffer())

      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || api.data.filename}.mp3`
      }, { quoted: m })

      return m.react('✅')
    } catch (err) {
      return m.reply(`❌ Error al obtener el audio: ${err.message}`)
    }
  }

  if (command === 'getvideo') {
    try {
      const api = await fetchAPI(url, 'video')
      const videoUrl = api.download || api.data?.url
      if (!videoUrl) throw new Error('No se pudo obtener el video.')

      const sizeMB = await getFileSize(videoUrl)

      if (sizeMB > MAX_SIZE_MB) {
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName: `${api.title || api.data.filename}.mp4`
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `${api.title || ''}`
        }, { quoted: m })
      }

      return m.react('✅')
    } catch (err) {
      return m.reply(`❌ Error al obtener el video: ${err.message}`)
    }
  }
}

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=${type === 'audio' ? '128kbps' : '720p'}&apikey=Paimon`
  const res = await fetch(endpoint)
  return await res.json()
}

const getFileSize = async (url) => {
  try {
    const res = await axios.head(url)
    const size = res.headers['content-length'] || 0
    return (size / (1024 * 1024)).toFixed(2)
  } catch {
    return 0
  }
}

const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}

handler.command = ['play', 'getaudio', 'getvideo']
handler.help = ['play <nombre>', 'getaudio <url>', 'getvideo <url>']
handler.tags = ['descargas']
handler.register = true

export default handler