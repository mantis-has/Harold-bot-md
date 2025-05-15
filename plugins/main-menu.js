import fs from 'fs'

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  let name = await conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

  // 🟡 ENVÍA REACCIÓN
  await conn.sendMessage(m.chat, {
    react: {
      text: '🇩🇴', // Puedes cambiar el emoji a lo que quieras
      key: m.key
    }
  })

  let txt = `
Hola ${name} Soy M500 ULTRA BOT...

_Si puedes sigue el canal oficial del bot, así nos ayudarías apoyando este hermoso proyecto._
╔════════════╗
       𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦
╚════════════╝

╭─⬣「 ✰ INFOBOT✰ 」
├ׁ̟̇❦︎ Cʀᴇᴀᴅᴏʀ: 𓆩‌۫᷼ ִֶָღܾ݉͢ғ꯭ᴇ꯭፝ℓɪ꯭ͨא𓆪
├ׁ̟̇ꨄ︎ Esᴛᴀᴅᴏ: Publico
├ׁ̟̇❤︎ Tɪᴇᴍᴘᴏ: ${uptime}
├ׁ̟̇✿︎ Bᴏᴛ:「 ${(conn.user.jid == global.conn.user.jid ? '𝘽𝙤𝙩 𝙊𝙛𝙞𝙘𝙞𝙖𝙡' : '𝙎𝙪𝙗𝘽𝙤𝙩')} 」
├ׁ̟̇ఌ︎ Rᴇɢɪsᴛʀᴏs: ${totalreg}
├ׁ̟̇☀︎︎ Cᴏᴍᴀɴᴅᴏs: ${totalCommands}
├ׁ̟̇✯ Bᴀɪʟᴇʏs: Multi Device
╰━─━─━─≪≪✠≫≫─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ PRINCIPALES╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos para ver estado e información del bot.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#help #menu
> Ver la lista de comandos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#uptime #runtime
> Ver el tiempo activo de ese bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sc #script
> Ver el repositorio oficial del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#staff #creadores
> Ver los desarrolladores del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bots #sockets
> Ver la lista de los Subbots conectados.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#owner #creador
> Envia el número de teléfono del creador del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#links #grupos
> Envía los enlaces oficiales del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#status #estado
> Ver el estado actual del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sug #newcomand
> Suguierenos un comando para añadirlo al bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sitema #system
> Ver el estado del sistema del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#funciones #totalfunciones
> Ver cuantos comandos tiene el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#p           #ping
> Ver cuantos mini segundos tarda el bot en responder a los comandos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#speed #speedtest
> Ver las estadísticas de velocidad del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#viws #usuarios
> Ver la cantidad de usuarios registrados en la base de datos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#reportar #reporte
> Envía un reporte al creador sobre cualquier error en el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#infobot
> Ver toda la información del bot.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ BUSCADORES╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos para realizar búsquedas en distintas plataformas.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tiktoksearch #tiktoks
> Buscador de videos de tiktok.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tweetposts
> Buscador de posts de Twitter/X.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ytsearch #yts
> Realiza Búsquedas de YouTube.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#gitthubsearch
> Buscador de usuarios de Gittub.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cuevana #cuevanasearch
> Buscador de películas y series de Cuevana.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#google
> Realiza Búsquedas de Google.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pin #pinterest
> Buscador de imágenes de Pinterest.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#imagen #image
> Buscador de imágenes de Google.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#infoanime
> Buscador de información de anime y manga.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#hentaisearch #searhhentai
> Buscador de capítulos de hentai.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#npmjs
> Buscador de npmjs.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ DESCARGAS╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos de descargas en el bot.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tiktok #tt
> Descarga videos de TikTok.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#mediafire #mf
> Descargar cualquier archivo de MediaFire.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pinvid #pinvideo [enlace]
> Descargar videos de Pinterest.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#mega #mg [enlace]
> Descargar archivos de Mega.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#play #play2
> Descarga musicas o videos de YouTube.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ytmp3 #ytmp4
> Descarga musicas y videos de YouTube mediante URL.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#fb #facebook
> Descarga videos de Facebook.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#twitter #x [enlace]
> Descarga videos de Twitter.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ig #instagram
> Descarga videos de Instagram.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tts #tiktoks [URL]
> Descarga videos de TikTok.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#terabox #tb [enlace]
> Descarga archivos de Terabox.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ttimg #ttmp3 [URL]
> Descarga fotos y audios de TikTok.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#gitclone [URL]
> Descarga un repositorio de GitHub.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#apk #modapk
> Descarga APK de Aptoide.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tiktokrandom #ttrandom
> Descarga un video aleatorio de TikTok.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#npmdl #npmdowloander
> Descarga paquetes de NPMJS.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ ECONOMIA╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos de economía y RPG para ganar dinero y otras cosas más con el bot.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#w #work #trabajar
> Trabaja para ganar Diamantes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#slut #prostituirse
> Trabaja como prostituta para ganar Diamantes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cf #suerte 
> Apuesta tus Diamantes en cara o cruz.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#crime #crimen
> Comete un crimen y gana Diamantes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ruleta #roulette #rt
> Apuesta tus diamantes al color rojo o azul.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#casino #apostar
> Apuesta tus Diamantes en el casino.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#slot
> Apuesta tus Diamantes en la ruleta y prueba tu suerte.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cartera #wallet
> Ver tus diamantes en la cartera.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bank #banco
> Ver tus diamantes en el banco.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#deposit #depositar #d [cantidad]
> Deposita tus diamantes al banco.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#with #retirar #withdraw
> Retira tus diamantes del banco.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#transfer #pay
> Transfiere tus Diamantes a un usuario [ Solo en grupos ]
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#miming #minar #mine
> Mina para ganar recursos con el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#buyall #buy
> Cambia tu XP por dinero.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#daily #diario
> Reclama tu recompensa diaria.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cofre
> Reclama un cofre diario lleno de recursos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#weekly #semanal
> Reclama tu recompensa semanal
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#monthly #mensual
> Reclama tu recompensa mensual.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#steal #robar #rob
> Intenta robarle diamantes a otros usuarios.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#robarxp #robxp
> Robale el XP a otros usuarios.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#eboard #baltop
> Ver el ranking de usuarios con más Diamantes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#aventura #adventure
> Aventúrate en un nuevo reino y reclama Diamantes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#curar #heal
> Cura tu salud para volverte a aventurar.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cazar #hunt #berburu
> Aventúrate en una caza de animales.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#inv #inventario #bal
> Ver tu inventario y todos tus intems.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#halloween
> Reclama tu dulce o truco [ Solo en Halloween ]
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#christmas #navidad 
> Reclama tu regalo navideño [ Solo en navidad ]
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ GACHA╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos de gacha para reclamar y recolectar personajes.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#rollwaifu #rw #roll
> Envía  Waifu o husbando aleatorio 
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#claim #c #reclamar 
> Reclama tu personaje.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#harem #waifus #claims 
> Ver tus personajes e waifus reclamados.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#charimage #waifuimage #wimage
> Ver una imagen aleatoria de un personaje.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#givechar #givewaifu #reglar 
> Regala tus personajes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#vote #votar 
> Votar tus personajes por un mayor valor.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#waifuboard #waifutop #topwaifus
> Ver el top de personajes.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ STICKERS╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos para crear stickers con el bot.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#s #sticker 
> Crea stickers de imagen o videos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#setmeta 
> Establece un pack y autor para los stickers.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#delmeta 
> Elimina tu pack de stickers.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#qc 
> Crea stickers con textos de usuarios.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#toimg #img
> Convierte stickers en imagen.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#brat #ttp #attp
> Crea stickers con textos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#emojimix
> Funciona 2 emojis para crear stickers.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#wm
> Cambia el nombre de los stickers.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ HERRAMIENTAS╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos de herramientas con muchas funciones.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#calcular #cal
> Calcular todo tipo de ecuaciones.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#tiempo #clima
> Ver el clima de un país.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#horario
> Ver el horario global de los países.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#fake #fakeply
> Crea un mensaje falso de un usuario.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#letra 
> Cambia las fuentes de las letras.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#read #readviwonce #ver
> Ver imágenes de una sola vista.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#whatmusic #shazam
> Descubre el nombre de canciones o vídeos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ss #ssweb
> Ver el estado de una página.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#length #tamaño.
> Cambia el tamaño de una imagenes o videos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#say #decir [texto]
> Repetir un mensaje.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#todoc #document
> Crea documentos de audio imágenes y vídeos.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#translate #traducir #trad
> Traduce palabras en otros idiomas.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ PERFIL︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Comandos para ver contratar y configurar estados de tu perfil.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#reg #verificar #register
> Regístrate en la base de datos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#unreg 
> Elimina tu registro de la base de datos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#profile 
> Mira tu perfil.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#marry [tag / responder]
> Casate con una persona en juegos del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#divorce 
> Divórciate con la persona que te casate.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#setgenre #setgenero
> Edita tu género en el perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#delgenre #delgenero
> Elimina tu género del perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#setbirth #setnacimiento
> Edita tu nacimiento en el perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#delbirth #delnacimiento 
> Elimina tu nacimiento del perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#setdescripcion #setdesc
> Edita una descripción para ver en el perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#deldescripcion #deldesc
> Elimina tu descripción del perfil del bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#lb #lboard [página]
> Top de usuarios con más experiencia o nivel.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#level #lvl
> Ver tu nivel y experiecia actual.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#comprarpremium #premium 
> Comprar un pase premium para usar el bot sin límites.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#confesiones #confesar
> Confiesa tus sentimientos a alguien de manera anónima.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ JUEGOS︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Comandos de juegos para jugar con tus amigos.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#amistaf #amigorandom
> Hacer amigos con un juego.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#chaqueta
> Hacerte una chaqueta.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#chiste
> El bot te cuenta un chiste.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#consejo 
> El bot te da un consejo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#dexeo #dexear [mensionar]
> Simular un deseo falso.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#facto
> Tirar un facto.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#formaroareja
> Forma una pareja.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#formarpareja5
> Forma 5 parejas diferentes.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#frase
> El bot da una frase.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#huevo
> Agarrarle el huevo a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#chupalo [mensionar]
> Hacer que un usuario te la chupe
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#aplauso
> Aplaudirle a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#marron [mensionar]
> Burlarte del color de piel de alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#suicidar 
> Suicidate.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#iq #iqtest
> Calcular el IQ de una persona.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#meme
> El bot envía un meme.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#morse
> Convierte un texto en código morse.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#nombreninja
> Busca un nombre ninja aleatorio.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#paja #pajeame
> El bot te hace una paja.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#personalidad [mensionar]
> El bot busca tu personalidad.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#piropo 
> Lanza un piropo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pregunta
> Hazle una pregunta al bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ship #pareja 
> El bot te da la probabilidad de enamorarte de alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sorteo
> Empieza un sorteo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#top
> Empieza un top de personas 
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#formartrio [mension]
> Forma un trio.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ahorcado 
> Diviertete con el bot jugando el juego ahorcado.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#mates #matematicas 
> Responde las preguntas de matemáticas para ganar recompensas
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ppt 
> Juego piedra papel l tijeras con el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sopa #buscarpalabra
> Juega el famoso juego de sopas de letras.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pvp #suit [mensionar]
> Juega un PvP contra otro usuario.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ttt
> Crea una sala de juego.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ N-S-F-W︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Comandos de NSFW (Contenido para adultos🫵🏼😂)
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#anal [mensionar]
> Hacer un anal.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#waifu
> Busca una waifu.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bath [mensionar]
> Bañarse.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#blowjob #mamada #bj [MENSIONAR]
> Dar una mamada.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#boobjob [mensionar]
> Hacer una rusa.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cum [MENSIONAR]
> Venirse en alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#fap [mensionar]
> Hacerte una paja.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#footjob [mensionar]
> Hacerte una paja con los pies.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#fuck #coger #fuck2 [MENSIONAR]
> Follarte a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cafe #coffe
> Tomarte un cafesito.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#violar #perra [mensionar]
> Viola a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#grabboobs [mensionar]
> Agarrar tetas.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#grop [mensionar]
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#lickpussy [MENSIONAR]
> Lamer un toto 😂
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#rule34 #r34 [tag]
> Buscar imágenes en Rule34
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sixnine #69 [mensionar]
> Haz un 69 con alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#spank #nalgada [mensionar]
> Dar una nalgada.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#suckboobs [mensionar]
> Chupar tetas.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#undress #encuerar [mensionar]
> Desnudar a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#yuri #tijeras [mensionar]
> Hacer tijeras.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ ANIME︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Comandos de reacciones de anime.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#angry #enojado [MENSIONAR]
> Estar enojado gay si lo lees.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bite [mensionar]
> Muerde a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bleh [mensionar]
> Sacar lengua.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#blush [mensionar]
> Sonrojarse.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#bored #aburrido [mensionar]
> Estar aburrido.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cry [mensionar]
> Llorar por alguien o algo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#cuddle [mensionar]
> Acurrucarse en alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#dance [MENSIONAR]
> Sacar los pasos prohibidos de gays.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#drunk [mensionar]
> Estar borracho.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#eat #comer [mensionar]
> Comer algo delicioso.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#facepalm [mensionar]
> Darte una palmada en la cara.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#happy #feliz [mensionar]
> Salta de felicidad.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#hug [mensionar]
> Dar un abrazo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#impregnate #preg #embarazar [mensionar]
> Embarazar a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#kill [mensionar]
> Toma tu arma y mata a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#kiss #besar #kiss2 [mensionar]
> Besar a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#laugh [mensionar]
> Reírte de algo o alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#lick [mensionar]
> Lamer q alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#love #amor [mensionar]
> Sentirse enamorado.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pat #acariciar [mensionar]
> Acaricia a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#poke [mensionar]
> Picar a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#pout [mensionar]
> Hacer pucheros.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#punch #golpear [mensionar]
> Dar puñetazo.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#run [mensionar]
> Correr de alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sad #triste [mensionar]
> Estar triste por alguien o que alguien está triste XD.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#scared [mensionar]
> Estar asustado (solo los gays se asustan, el susto es para mujeres, si te asustas eres gay JAJAJA.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#seduce [mensionar]
> Seducir a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#shy #timido
> Estar tímido.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#slap [mensionar]
> Dar una bofetada.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#dias days 
> Darle los buenos días a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#noches #nights
> Darle las buenas noches a alguien.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#sleep [mensionar]
> Hechar una fiesta y cuidado si te roban por gay XD.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#smoke [mensionar]
> Fumar.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#think [mensionar]
> Pensar en algo o alguien.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ 𝐆𝐑𝐔𝐏𝐎𝐒︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> 𝐂𝚘𝚖𝚊𝚗𝚍𝚘𝚜 𝚙𝚊𝚛𝚊 𝚚𝚞𝚎 𝚜𝚎𝚊 𝚖𝚎𝚓𝚘𝚛 𝚎𝚕 𝚖𝚊𝚗𝚎𝚓𝚘 𝚢 𝚊𝚍𝚖𝚒𝚗𝚒𝚜𝚝𝚛𝚊𝚌𝚒𝚘́𝚗 𝚎𝚗 𝚝𝚞𝚜 𝚐𝚛𝚞𝚙𝚘𝚜.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#hidetag #tag #notify
> Envia un mensaje mensionando a todos los usuarios del grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#gp #infogrupo
> Ver toda la información del grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#lenea #listonline
> Ver una lista de todas las personas que están en linea y no quieren hablar en el grupo por gays.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#setwelcome 
> Personaliza el mensaje de bienvenida para el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#setbye
> Personaliza un mensaje de despedida para el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#link
> El bot envía el enlace del grupo [el bot tiene que ser admin para poder ejecutar el comando]
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#restablecer #revoke
> El bot restablece el mensaje del grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#grupo #group [abrir o cerrar]
> Cambia ajustes del grupo para que hablen solo admins o todos los usuarios.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#kick [número o mensionar]
> Elimina a una persona de tu grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#add #añadir #agregar [número]
> El bot envía el enlace del grupo al usuauario para que se una.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#promote 
> El bot promueve a u a persona para que sea admin de tu grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#demote 
> El bot promueve a una persona para que deje de ser admin de tu grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#gpbanner #groupimg
> Cambia la foto del perfil del grupo [el bot debe ser admin para ejecutar ese comando]
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#gpdesc #groupdesc [texto]
> El bot cambia la descripción del grupo [el bot debe ser admin para ejecutar ese comando]
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#gpname #groupname [texto]
> El bot cambia el nombre del grupo [el bot debe ser admin para ejecutar ese comando]
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#advertir #warn #warning [tag]
> Darle una advertencia a un usuario.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#delwarn #unwarn [tag]
> El bot le quita la advertencia al usuario.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#listadv #advlist
> Ver la lista de los usuarios advertidos.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#mute [mensionar]
> El bot elimina los mensajes del usuario.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#unmute [mensionar]
> El bot le quita el mute a las personas.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#encuesta #poll [texto]
> El bot hace una encuesta.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#del #delete
> El bot elimina mensajes.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#fantasmas
> Ver la lista de inactivos en el grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#kickfantasmas
> El bot elimina a todos los que no están activos en el grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#invocar #tagall #todos [texto]
> El bot envía un mensaje donde están los tags de todos los usuarios para que se conecten.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#setemoji #setemo
> Cambia el emoji que se usa en la invocación del grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#kicknum #listnum
> Elimina un usuario por el prefijo del país.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ CONFIGURACIÓN︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Opciones de configuración del grupo.
╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#bot [on/off]
> Activa o desactiva al bot en tu grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#antilink [on/off]
> Activa o desactiva el anti enlaces en tu grupo.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#antibot [on/off]
> Si el bot detecta otro bot que no sea admin lo elimina automáticamente si está opción está activa.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#antisubbots
> Si hay algún SubBot de M500 ULTRA BOT, sale del grupo automáticamente para evitar el spam.
 ᳯ⃞ 𑪏𑪋ᩧ✰﹕#antitraba [on/off]
> Si el bot detecta mensaje demaciado largo elimina al usuario automáticamente.
╰━─━─━─☞︎︎︎✰☜︎︎︎─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇ I - A︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇
> Comandos de configuración virtual, no puse algunos porque se me olvidaron pero ustedes saben más que yo XD.
╚━━━━━━━━━━━━╝
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #dalle [texto]
> ┈➤El bot crea imágenes de ɪᴀ con el texto que le pongas.
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #ia
> ┈➤Habla con el bot [comando en proceso]
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #chatgpt
> ┈➤Habla con chatgpt [comando en proceso]
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #autoresponder
> ┈➤Interactúa con el bot respondiendo a sus mensajes.
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #hd [imagen]
> ┈➤Mejora la calidad de la imagen que envíes.
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #geminis 
> ┈➤No se qué hace pero es un comando XD.
├ׁ̟̇⁖ฺ۟̇࣪·֗٬̤⃟❦︎ #remini 
> ┈➤No se que hace,.solo se que es parte de ChatGpT.
╰━─━─━─ϱ✰─━─━─━╯

╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ OWNER╭ׅׄ̇─ׅ̻ׄ╮۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭
> Comandos exclusivos para el creador del bot
 ╚━━━━━━━━━━━━╝
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#banchat
> Banea a cualquier usuario para que no pueda usar el bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#unbanchat
> Desbanea a cualquier usuario que no podía usar al bot.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#ds #fixmsgespera
> Elimina datos de subbots.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#autoadmin
> Se hace admin de cualquier grupo mientras algún bot sea admin.
 ᳯ⃞ 𑪏𑪋ᩧ✿𝆬﹕#block #blockuser
> Bloquea a cualquier persona entre l