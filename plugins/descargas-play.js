import yts from 'yt-search'
import fetch from 'node-fetch'
import axios from 'axios'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MAX_SIZE_MB = 100

const handler = async (m, { conn, text, command, args, botname }) => {
  conn.playRequests = conn.playRequests || {}

  if (command === 'play') {
    if (!text?.trim()) return conn.reply(m.chat, '❗ Ingresa el nombre del video que deseas buscar.', m)

    try {
      const search = await yts(text)
      const video = search.videos[0]
      if (!video) return m.reply('❗ No se encontró ningún resultado.')

      const info = `🎶 *Resultado encontrado:*\n\n` +
        `> *Título:* ${video.title}\n` +
        `> *Canal:* ${video.author.name}\n` +
        `> *Vistas:* ${formatViews(video.views)}\n` +
        `> *Duración:* ${video.timestamp}\n` +
        `> *Publicado:* ${video.ago}\n` +
        `> *Link:* ${video.url}\n\n` +
        `Responde con:\n🎵 para obtener el audio\n🎥 para obtener el video`

      const isValidThumb = await isImageAvailable(video.thumbnail)
      const message = isValidThumb
        ? { image: { url: video.thumbnail }, caption: info }
        : { text: info }

      await conn.sendMessage(m.chat, message, { quoted: m })
      conn.playRequests[m.sender] = video.url

    } catch (err) {
      console.error('Error en .play:', err)
      m.reply(`❌ Error al buscar el video: ${err.message}`)
    }
    return
  }

  if (m.body === '🎵') {
    const url = conn.playRequests[m.sender]
    if (!url) return m.reply('❗ No se encontró una búsqueda previa.')

    try {
      const api = await fetchAPI(url, 'audio')
      const videoUrl = api.download || api.data?.url
      if (!videoUrl) throw new Error('No se pudo obtener el enlace del video.')

      const tempVideo = path.join(__dirname, `temp_${Date.now()}.mp4`)
      const tempAudio = path.join(__dirname, `audio_${Date.now()}.mp3`)

      const res = await fetch(videoUrl)
      const stream = fs.createWriteStream(tempVideo)
      await new Promise((resolve, reject) => {
        res.body.pipe(stream)
        res.body.on('error', reject)
        stream.on('finish', resolve)
      })

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${tempVideo}" -vn -ab 128k -ar 44100 -y "${tempAudio}"`, err => {
          if (err) return reject(err)
          resolve()
        })
      })

      const buffer = fs.readFileSync(tempAudio)
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${api.title || 'audio'}.mp3`
      }, { quoted: m })

      fs.unlinkSync(tempVideo)
      fs.unlinkSync(tempAudio)
      delete conn.playRequests[m.sender]

    } catch (err) {
      console.error('Error en 🎵:', err)
      m.reply(`❌ Error al enviar el audio: ${err.message}`)
    }
    return
  }

  if (m.body === '🎥') {
    const url = conn.playRequests[m.sender]
    if (!url) return m.reply('❗ No se encontró una búsqueda previa.')

    try {
      const api = await fetchAPI(url, 'video')
      const videoUrl = api.download || api.data?.url
      if (!videoUrl) throw new Error('No se pudo obtener el enlace del video.')

      const sizeMB = await getFileSize(videoUrl)
      const fileName = `${api.title || 'video'}.mp4`

      if (sizeMB > MAX_SIZE_MB) {
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: api.title || ''
        }, { quoted: m })
      }

      delete conn.playRequests[m.sender]

    } catch (err) {
      console.error('Error en 🎥:', err)
      m.reply(`❌ Error al enviar el video: ${err.message}`)
    }
    return
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
    return parseFloat((size / (1024 * 1024)).toFixed(2))
  } catch (err) {
    return 0
  }
}

const isImageAvailable = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok && res.headers.get('content-type')?.startsWith('image/')
  } catch {
    return false
  }
}

const formatViews = (views) => {
  if (!views) return '0'
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`
  return views.toString()
}

handler.command = ['play']
handler.help = ['play <nombre>']
handler.tags = ['descargas']
handler.register = true

export default handler