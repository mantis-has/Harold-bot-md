import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
// import _ from "lodash"
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
let user = global.db.data.users[m.sender]
let name2 = conn.getName(m.sender)
  let delirius = await axios.get(`https://delirius-apiofc.vercel.app/tools/country?text=${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}`)
  let paisdata = delirius.data.result
  let mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido'
  let perfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/2du81w.jpg')
  let bio = 0, fechaBio
 // let who2 = m.isGroup ? _.get(m, "mentionedJid[0]", m.quoted?.sender || m.sender) : m.sender
  let sinDefinir = '😿 Es privado'
  let biografia = await conn.fetchStatus(m.sender).catch(() => null)
  if (!biografia || !biografia[0] || biografia[0].status === null) {
  bio = sinDefinir
  fechaBio = "Fecha no disponible"
  } else {
  bio = biografia[0].status || sinDefinir
  fechaBio = biografia[0].setAt ? new Date(biografia[0].setAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", }) : "Fecha no disponible"
  }
if (user.registered === true) throw `*『✦』Ya estas registrado\n\nQuieres volver a registrarte?\n\nUsa el siguiente comando: #unreg*`
if (!Reg.test(text)) throw `*『✦』El comando ingresado es incorrecto, usalo de la siguiente manera:*\n\n#reg *Nombre.edad*\n\n\`\`\`Ejemplo:\`\`\`\n#reg *${name2}.18*`
let [_, name, splitter, age] = text.match(Reg)
if (!name) throw '*『✦』No puedes registrarte sin nombre, el nombre es obligatorio. Inténtelo de nuevo.*'
if (!age) throw '*『✦』No puedes registrarte sin la edad, la edad es opcional. Inténtelo de nuevo.*'
if (name.length >= 30) throw '*『✦』El nombre no debe de tener mas de 30 caracteres.*' 
age = parseInt(age)
if (age > 999) throw '*『✦』Este pendejo quiere jugar al bot.*'
if (age < 5) throw '*『✦』Ahora los niños juegan con los bots.*'
user.name = name.trim()
user.age = age
user.descripcion = bio
// user.persona = age >= 18? '(Persona adulta)' : '(Persona joven)'
user.regTime = + new Date
user.registered = true
global.db.data.users[m.sender].money += 5
global.db.data.users[m.sender].chocolates += 15
global.db.data.users[m.sender].exp += 245
global.db.data.users[m.sender].joincount += 12
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)        
m.react('✉️') 
let regbot = `╔━━▣━━━━⌬⌬━━▣
┃Nombre: ${name}
┃Edad: ${age} años
┗━━▣━━━━⌬⌬━━▣

《🎁》 𝐑𝖾𝖼𝗼𝗆𝗉𝖾𝗇𝗌𝗮𝗌

╔⌬━━━━━━━━━━━━
┃💎Diamantes: 100
┃
┃💰HaroldCoins: 200
┃
┃✨Experiencia: 1000
┃
┃🎫Tokens: 22
╚⌬━━━━━━━━━━━━

   ━━━SIGUENOS━━━

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹
https://whatsapp.com/channel/0029Vb5puj4KAwEc9ccRGq2d
╚▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬▭╝

> 𝕻𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 HaroldOFC`
await conn.sendMessage(m.chat, {
            text: regbot,
            contextInfo: {
externalAdReply: {
            showAdAttribution: true,
            title: 'Nuevo registro',
            body: 'Super-Harold-Bot',
            thumbnailUrl: imagen3,
            sourceUrl: redes,
            previewType: "PHOTO",
            mediaType: 1,
            renderLargerThumbnail: true
        }}
    })
  }
handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
