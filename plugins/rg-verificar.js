import axios from 'axios'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, args, usedPrefix, command }) {
    let user = global.db.data.users[m.sender]
    let name2 = conn.getName(m.sender)
    let whe = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let perfil = await conn.profilePictureUrl(whe, 'image').catch(_ => 'https://qu.ax/Mvhfa.jpg')

    if (user.registered === true) {
        return m.reply(`🩵 𝐘𝐚 𝐄𝐬𝐭𝐚𝐬 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐝𝐨.\n\n¿𝐐𝐮𝐢𝐞𝐫𝐞𝐬 𝐕𝐨𝐥𝐯𝐞𝐫 𝐀 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐭𝐞?\n\n𝐔𝐬𝐚 𝐄𝐬𝐭𝐞 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐏𝐚𝐫𝐚 𝐄𝐥𝐢𝐦𝐢𝐧𝐚𝐫 𝐓𝐮 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐨.\n*${usedPrefix}unreg*`)
    }

    if (!Reg.test(text)) return m.reply(`✰ 𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐈𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐨.\n\n𝐕𝐞𝐫𝐝𝐚𝐝𝐞𝐫𝐨 𝐔𝐬𝐨: ${usedPrefix + command} 𝐍𝐨𝐦𝐛𝐫𝐞.𝐄𝐝𝐚𝐝\n\n𝐄𝐣𝐞𝐦𝐩𝐥𝐨 : *${usedPrefix + command} ${name2}.14*`)

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('🩵 𝐄𝐥 𝐍𝐨𝐦𝐛𝐫𝐞 𝐃𝐞 𝐮𝐬𝐮𝐚𝐫𝐢𝐨 𝐍𝐨 𝐩𝐮𝐞𝐝𝐞 𝐄𝐬𝐭𝐚𝐫 𝐕𝐚𝐜𝐢𝐨.')
    if (!age) return m.reply('🩵 𝐋𝐚 𝐄𝐝𝐚𝐝 𝐃𝐞𝐥 𝐔𝐬𝐮𝐚𝐫𝐢𝐨 𝐍𝐨 𝐩𝐮𝐞𝐝𝐞 𝐄𝐬𝐭𝐚𝐫 𝐕𝐚𝐜𝐢̄𝐚.')
    if (name.length >= 100) return m.reply('🩵 𝐄𝐬𝐞 𝐍𝐨𝐦𝐛𝐫𝐞 𝐄𝐬𝐭𝐚 𝐌𝐮𝐲 𝐋𝐚𝐫𝐠𝐨 𝐀𝐦𝐢𝐠@.')

    age = parseInt(age)
    if (age > 1000) return m.reply('*𝐋𝐚 𝐄𝐝𝐚𝐝 𝐐𝐮𝐞 𝐀𝐜𝐚𝐛𝐚𝐬 𝐝𝐞 𝐏𝐨𝐧𝐞𝐫 𝐄𝐬 𝐢𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐚*')
    if (age < 5) return m.reply('*𝐋𝐚 𝐄𝐝𝐚𝐝 𝐐𝐮𝐞 𝐀𝐜𝐚𝐛𝐚𝐬 𝐝𝐞 𝐏𝐨𝐧𝐞𝐫 𝐄𝐬 𝐢𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐚*')

    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true
    global.db.data.users[m.sender].money += 600
    global.db.data.users[m.sender].estrellas += 10
    global.db.data.users[m.sender].exp += 245
    global.db.data.users[m.sender].joincount += 5    

    let who;
    if (m.quoted && m.quoted.sender) {
        who = m.quoted.sender;
    } else {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    }

    let sn = createHash('md5').update(m.sender).digest('hex')
    let regbot = `┌─🅁 𝐄 𝐆 𝐈 𝐒 𝐓 𝐑 𝐀 𝐃 𝐎\n`
regbot += `│\n`
regbot += `│ ✰ 𝐍𝐨𝐦𝐛𝐫𝐞: ${name}\n`
regbot += `│ ✰ 𝐄𝐝𝐚𝐝: ${age} 𝐚𝐧̃𝐨𝐬\n`
regbot += `│\n`
regbot += `│ ★ 𝐑𝐞𝐜𝐨𝐦𝐩𝐞𝐧𝐬𝐚𝐬 ★:\n`
regbot += `│   ├─ 💎 15 𝐃𝐢𝐚𝐦𝐚𝐧𝐭𝐞𝐬\n`
regbot += `│   ├─ ⚡ 25 𝐂𝐨𝐢𝐧𝐬\n`
regbot += `│   ├─ ✨ 245 𝐄𝐱𝐩\n`
regbot += `│   └─ ✰ 12 𝐓𝐨𝐤𝐞𝐧𝐬\n`
regbot += `│\n`
regbot += `└─➤ 𝐒𝐢𝐠𝐮𝐞 𝐍𝐮𝐞𝐬𝐭𝐫𝐨 𝐂𝐚𝐧𝐚𝐥 𝐝𝐞 𝐧𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐜𝐢𝐨𝐧𝐞𝐬 𝐞𝐥 𝐜𝐮𝐚𝐥 𝐡𝐚𝐲 𝐞𝐬𝐭𝐚𝐫𝐚 𝐭𝐮 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐨.`

await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊 / 𝐌500 𝐔𝐋𝐓𝐑𝐀 𝐁𝐎𝐓',
                thumbnailUrl: 'https://qu.ax/rJuGq.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

/*    await m.react('📪')
  await conn.sendMessage(m.chat, {
           text: regbot, 
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,                      
                containsAutoReply: true,     
                renderLargerThumbnail": true,
                title: '⊱『𝆺𝅥 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢 𝆹𝅥』⊰',  
                body: dev,  
                containsAutoReply: true,
                showAdAttribution: true,
                mediaType: 1, 
                thumbnailUrl: 'https://qu.ax/YnWMn.jpg' }}}, {quoted: m})
*/

let chtxt = `👤 *𝙪𝙨𝙪𝙖𝙧𝙞𝙤* » ${m.pushName || 'Anónimo'}
🩵 *𝙑erificación* » ${user.name}
➪ *Edad* » ${user.age} años
➪ *Descripción* » ${user.descripcion}
➪ *Código de Registro* »
⤷ ${sn}`;

    let channelID = '120363400427618550@newsletter';
        await conn.sendMessage(channelID, {
        text: chtxt,
        contextInfo: {
            externalAdReply: {
                title: "【 🩵  🅁 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 🩵 】",
                body: '𝐍𝚞𝚎𝚟𝚘 𝐮𝚜𝚞𝚊𝚛𝚒𝚘 𝐑𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚍𝚘',
                thumbnailUrl: 'perfil',
                sourceUrl: 'redes',
                mediaType: 1,
                showAdAttribution: false,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: null });
};

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler