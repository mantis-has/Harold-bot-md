import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let mentionedJid = [who]
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) return m.reply(`✰ 𝐘𝐚 𝐓𝐞 𝐭𝐞𝐧𝐠𝐨 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐝𝐨.\n\n*¿𝐐𝐮𝐢𝐞𝐫𝐞𝐬 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐭𝐞 𝐎𝐭𝐫𝐚 𝐕𝐞𝐳?*\n\n𝐔𝐬𝐚 𝐄𝐬𝐭𝐞 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐏𝐚𝐫𝐚 𝐄𝐥𝐢𝐦𝐢𝐧𝐚𝐫 𝐓𝐮 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐨.\n*${usedPrefix}unreg*`)
  if (!Reg.test(text)) return m.reply(`✰ 𝐌𝐚𝐥 𝐏𝐮𝐞𝐬𝐭𝐨.\n\nUso del comamdo: *${usedPrefix + command} nombre.edad*\nEjemplo : *${usedPrefix + command} ${name2}.18*`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`✰ 𝐂𝐡𝐢𝐜𝐨 𝐄𝐥 𝐍𝐨𝐦𝐛𝐫𝐞 𝐧𝐨 𝐏𝐮𝐞𝐝𝐞 𝐈𝐫 𝐯𝐚𝐜𝐢𝐨.`)
  if (!age) return m.reply(`✰ 𝐂𝐡𝐢𝐜𝐨 𝐋𝐚 𝐄𝐝𝐚𝐝 𝐍𝐨 𝐩𝐮𝐞𝐝𝐞 𝐐𝐮𝐞𝐝𝐚𝐫 𝐕𝐚𝐜𝐢𝐚.`)
  if (name.length >= 100) return m.reply(`『✦』𝐄𝐬𝐞 𝐍𝐨𝐦𝐛𝐫𝐞 𝐄𝐬 𝐌𝐮𝐲 𝐋𝐚𝐫𝐠𝐨 𝐁𝐛𝐲.`)
  age = parseInt(age)
  if (age > 1000) return m.reply(`『✦』𝐉𝐚𝐣𝐚 𝐌𝐢 𝐚𝐛𝐮𝐞𝐥𝐨 𝐐𝐮𝐢𝐞𝐫𝐞 𝐒𝐞𝐫 𝐔𝐧 𝐁𝐨𝐭.`)
  if (age < 5) return m.reply(`『✦』𝐏𝐚𝐫𝐞𝐜𝐞𝐬 𝐀𝐛𝐮𝐞𝐥𝐨 𝐁𝐞𝐛𝐞 𝐉𝐚𝐣𝐚.`)
  user.name = name + '✓'.trim()
  user.age = age
  user.regTime = + new Date      
  user.registered = true
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
let regbot = `🅁 𝐄 𝐆 𝐈 𝐒 𝐓 𝐑 𝐀 𝐃 𝐎\n`
regbot += `━━━─────━━━●─━━━───\n`
regbot += `> ✰ 𝐍𝐨𝐦𝐛𝐫𝐞 » ${name}\n`
regbot += `> ✰ 𝐄𝐝𝐚𝐝 » ${age} 𝐀𝐧̃𝐨𝐬\n`
regbot += `━━━─────━━━●─━━━──\n`
regbot += `𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:\n`
regbot += `> • ♧︎︎︎ *${moneda}* » 40\n`
regbot += `> • ✰ *𝗘𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗶𝗮* » 300\n`
regbot += `> • ❖ *𝗧𝗼𝗸𝗲𝗻𝘀* » 20\n`
regbot += `━━━─────━━━●─━━━─\n`
regbot += `> ${dev}`
await m.react('🩵')

await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '❦︎ 𝐔sᴜᴀʀɪᴏ Rᴇɢɪsᴛʀᴀᴅᴏ ꨄ︎',
                body: textbot,
                thumbnailUrl: pp,
                sourceUrl: channel,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });    
}; 
handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler