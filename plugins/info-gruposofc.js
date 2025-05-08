let handler = async (m, { conn }) => {
  let name = await conn.getName(m.sender)
  let texto = `*Hola! ${name} Estos son los enlaces oficiales del bot...*

- Oficial Group:
       𝐌500 𝐔𝐥𝐭𝐫𝐚 
━━━─────━━━●─
https://chat.whatsapp.com/CCHLbO3WkfDKr59EQ5DPO9
━━━─────━━━●─

⏤͟͞ू⃪ 𝐂𝐨𝐦𝐮𝐧𝐢𝐝𝐚𝐝 𝐃𝐞𝐥 𝐁𝐨𝐭✰

✰ https://chat.whatsapp.com/LMOxF4UrNsCF28qFuazDyd

*ׄ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ*

⚘ CANAL OFICIAL 

- ⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝐌500』࿐⟡
 https://whatsapp.com/channel/0029VbAa5sNCsU9Hlzsn651S

> ᑭᴏ𝑤𝑒𝑟𝑒𝑑 B𝑦 𝐅𝐞́𝐥𝐢𝐱 𝐌𝐚𝐧𝐮𝐞𝐥 (•̀ᴗ•́)و
`

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/oa0n3y.jpg' },
    caption: texto,
    mentions: [m.sender]
  }, { quoted: m })

  await conn.react(m.chat, m.key, '🌟') // Puedes cambiar este emoji si quieres
}

handler.help = ['enlacesbot']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler
