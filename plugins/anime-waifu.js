import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Reemplaza con el emoji que quieras usar
    const emoji = '💖'
    
    // Enviar reacción (opcional si está implementado en tu bot)
    await conn.sendMessage(m.chat, {
      react: {
        text: '💖',
        key: m.key
      }
    })

    // Mensaje de espera
    await conn.reply(m.chat, `${emoji} Buscando su *Waifu* espere un momento...`, m)

    // Solicitud a la API
    let res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw new Error('No se pudo obtener una waifu.')

    let json = await res.json()
    if (!json.url) throw new Error('No se recibió imagen.')

    // Enviar la imagen
    await conn.sendFile(m.chat, json.url, 'waifu.jpg', `${emoji} Aquí tienes tu *Waifu* ฅ^•ﻌ•^ฅ`, m)
    
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Hubo un error al obtener la waifu. Inténtalo más tarde.', m)
  }
}

handler.help = ['waifu']
handler.tags = ['anime']
handler.command = ['waifu']
handler.group = true
handler.register = true

export default handler
