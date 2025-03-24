import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId];
    let name = conn.getName(userId);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;

    // Lista de links de vídeos GIF aleatorios
    const gifVideos = [
        'https://qu.ax/yxWPb.mp4',
        'https://qu.ax/WWPEk.mp4',
        'https://qu.ax/Jgkzb.mp4',
        // Añade más enlaces de GIFs aquí
    ];

    // Escoge uno aleatorio
    const randomGif = gifVideos[Math.floor(Math.random() * gifVideos.length)];

    let txt = `
☆✼★━━━━━━━━━━━━━━━━━★✼☆｡
        ┎┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┒
    𓏲꯭֟፝੭ ꯭⌑(꯭𝐑).꯭𝐔.꯭𝐁.꯭𝐘.꯭ ⭑𝐇.꯭𝐎.꯭𝐒.꯭𝐇.꯭𝐈.꯭𝐍.꯭𝐎.꯭𓏲꯭֟፝੭ 
        ┖┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┚
｡☆✼★━━━━━━━━━━━━━━━━━★✼☆｡


"¡Hola, %name! Mi nombre es *Ruby Hoshino* ٩(˘◡˘)۶"
Aquí tienes la lista de comandos
╔═══════⩽✦✰✦⩾═══════╗
       「 𝙄𝙉𝙁𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏 」
╚═══════⩽✦✰✦⩾═══════╝
║ ☆ 🌟 *𝖳𝖨𝖯𝖮 𝖣𝖤 𝖡𝖮𝖳*: *𝖶𝖠𝖨𝖥𝖴*
║ ☆ 🚩 *𝖬𝖮𝖣𝖮*: *𝖯𝖴𝖡𝖫𝖨𝖢𝖮*
║ ☆ 📚 *B𝖠𝖨𝖫𝖤𝖸𝖲*: *𝖬𝖴𝖫𝖳𝖨 𝖣𝖤𝖵𝖨𝖢𝖤*
║ ☆ 🌐 *𝖢𝖮𝖬𝖠𝖭𝖣𝖮𝖲 𝖤𝖭 𝖳𝖮𝖳𝖠𝖫*: ${totalCommands}
║ ☆ ⏱️ *𝖳𝖨𝖤𝖬𝖯𝖮* *𝖠𝖢𝖳𝖨𝖵𝖮*: ${uptime}
║ ☆ 👤 *𝖴𝖲𝖴𝖠𝖱𝖨𝖮𝖲* *𝖱𝖤𝖦𝖨𝖲𝖳𝖱𝖠𝖣𝖮𝖲*: ${totalreg}
║ ☆ 👩‍💻 *𝖢𝖱𝖤𝖠𝖣𝖮𝖱*: [𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑](https://Wa.me/18294868853)
╚════════════════════════╝
Crea un *Sub-Bot* con tu número utilizando *#qr* o *#code*

╔═══════⩽✦✰✦⩾═══════╗
    「 ${(conn.user.jid == global.conn.user.jid ? '𝘽𝙤𝙩 𝙊𝙛𝙞𝙘𝙞𝙖𝙡' : '𝙎𝙪𝙗𝘽𝙤𝙩')} 」
╚═══════⩽✦✰✦⩾═══════╝

*L I S T A  -  D E  -  C O M A N D O S*

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙸𝚗𝚏𝚘-𝙱𝚘𝚝 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐩𝐚𝐫𝐚 𝐯𝐞𝐫 𝐞𝐬𝐭𝐚𝐝𝐨 𝐞 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐜𝐢𝐨́𝐧 𝐝𝐞 𝐥𝐚 𝐁𝐨𝐭 ✨⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#help • #menu*  
> ✦ Ver la lista de comandos de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#uptime • #runtime*  
> ✦ Ver tiempo activo o en línea de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sc • #script*  
> ✦ Link del repositorio oficial de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#staff • #colaboradores*  
> ✦ Ver la lista de desarrolladores de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#serbot • #serbot code*  
> ✦ Crea una sesión de Sub-Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#bots • #sockets*  
> ✦ Ver la lista de Sub-Bots activos.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#creador*  
> ✦ Contacto del creador de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#status • #estado*  
> ✦ Ver el estado actual de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#links • #grupos*  
> ✦ Ver los enlaces oficiales de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#infobot • #infobot*  
> ✦ Ver la información completa de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sug • #newcommand*  
> ✦ Sugiere un nuevo comando.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#p • #ping*  
> ✦ Ver la velocidad de respuesta del Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#reporte • #reportar*  
> ✦ Reporta alguna falla o problema de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sistema • #system*  
> ✦ Ver estado del sistema de alojamiento.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#speed • #speedtest*  
> ✦ Ver las estadísticas de velocidad de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#views • #usuarios*  
> ✦ Ver la cantidad de usuarios registrados en el sistema.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#funciones • #totalfunciones*  
> ✦ Ver todas las funciones de la Bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ds • #fixmsgespera*  
> ✦ Eliminar archivos de sesión innecesarios.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#editautoresponder*  
> ✦ Configurar un Prompt personalizado de la Bot.  
🎴  ੈ₊˚༅༴╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『  𝙱𝚞𝚜𝚌𝚊𝚍𝚘𝚛𝚎𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🔍⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐩𝐚𝐫𝐚 𝐫𝐞𝐚𝐥𝐢𝐳𝐚𝐫 𝐛𝐮́𝐬𝐪𝐮𝐞𝐝𝐚𝐬 𝐞𝐧 𝐝𝐢𝐬𝐭𝐢𝐧𝐭𝐚𝐬 𝐩𝐥𝐚𝐭𝐚𝐟𝐨𝐫𝐦𝐚𝐬 🔎⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tiktoksearch • #tiktoks*  
> ✦ Buscador de videos de TikTok.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tweetposts*  
> ✦ Buscador de posts de Twitter/X.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ytsearch • #yts*  
> ✦ Realiza búsquedas en YouTube.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#githubsearch*  
> ✦ Buscador de usuarios de GitHub.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cuevana • #cuevanasearch*  
> ✦ Buscador de películas/series por Cuevana.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#google*  
> ✦ Realiza búsquedas en Google.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pin • #pinterest*  
> ✦ Buscador de imágenes de Pinterest.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#imagen • #image*  
> ✦ Buscador de imágenes en Google.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#animesearch • #animess*  
> ✦ Buscador de animes en TioAnime.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#animei • #animeinfo*  
> ✦ Buscador de capítulos de #animesearch.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#infoanime*  
> ✦ Buscador de información de anime/manga.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#hentaisearch • #searchhentai*  
> ✦ Buscador de capítulos hentai.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#xnxxsearch • #xnxxs*  
> ✦ Buscador de videos de XNXX.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#xvsearch • #xvideossearch*  
> ✦ Buscador de videos de Xvideos.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pornhubsearch • #phsearch*  
> ✦ Buscador de videos de Pornhub.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#npmjs*  
> ✦ Buscador de paquetes en npmjs.  
🎴  ੈ₊˚༅༴╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

📥⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐝𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐩𝐚𝐫𝐚 𝐯𝐚𝐫𝐢𝐨𝐬 𝐚𝐫𝐜𝐡𝐢𝐯𝐨𝐬  📂⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tiktok • #tt*
> ✦ Descarga videos de TikTok.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#mediafire • #mf*
> ✦ Descargar un archivo de MediaFire.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pinvid • #pinvideo* + [enlace]
> ✦ Descargar vídeos de Pinterest. 
🎴  ੈ₊˚༅༴│.ᰔᩚ *#mega • #mg* + [enlace]
> ✦ Descargar un archivo de MEGA.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#play • #play2*
> ✦ Descarga música/video de YouTube.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ytmp3 • #ytmp4*
> ✦ Descarga música/video de YouTube mediante url.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#fb • #facebook*
> ✦ Descarga videos de Facebook.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#twitter • #x* + [Link]
> ✦ Descargar un video de Twitter/X
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ig • #instagram*
> ✦ Descarga contenido de Instagram.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tts • #tiktoks* + [busqueda]
> ✦ Buscar videos de tiktok 
🎴  ੈ₊˚༅༴│.ᰔᩚ *#terabox • #tb* + [enlace]
> ✦ Descargar archivos por Terabox.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gdrive • #drive* + [enlace]
> ✦ Descargar archivos por Google Drive.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ttimg • #ttmp3* + <url>
> ✦ Descarga fotos/audios de tiktok. 
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gitclone* + <url> 
> ✦ Descarga un repositorio de github.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#xvideosdl*
> ✦ Descarga videos porno de (Xvideos). 
🎴  ੈ₊˚༅༴│.ᰔᩚ *#xnxxdl*
> ✦ Descarga videos porno de (xnxx).
🎴  ੈ₊˚༅༴│.ᰔᩚ *#apk • #modapk*
> ✦ Descarga un apk de Aptoide.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tiktokrandom • #ttrandom*
> ✦ Descarga un video aleatorio de tiktok.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#npmdl • #npmdownloader*
> ✦ Descarga paquetes de NPMJs.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#animelinks • #animedl*
> ✦ Descarga Links disponibles de descargas.
╰──── ੈ₊˚༅༴╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙴𝚌𝚘𝚗𝚘𝚖𝚒𝚊 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

💰🎮⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐞𝐜𝐨𝐧𝐨𝐦𝐢́𝐚 𝐲 𝐑𝐏𝐆 𝐩𝐚𝐫𝐚 𝐠𝐚𝐧𝐚𝐫 𝐝𝐢𝐧𝐞𝐫𝐨 𝐲 𝐨𝐭𝐫𝐨𝐬 𝐫𝐞𝐜𝐮𝐫𝐬𝐨𝐬 🏆💎⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#w • #work • #trabajar*
> ✦ Trabaja para ganar ${moneda}.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#slut • #protituirse*
> ✦ Trabaja como prostituta y gana ${moneda}.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cf • #suerte*
> ✦ Apuesta tus ${moneda} a cara o cruz.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#crime • #crimen*
> ✦ Trabaja como ladrón para ganar ${moneda}.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ruleta • #roulette • #rt*
> ✦ Apuesta ${moneda} al color rojo o negro.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#casino • #apostar*
> ✦ Apuesta tus ${moneda} en el casino.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#slot*
> ✦ Apuesta tus ${moneda} en la ruleta y prueba tu suerte.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cartera • #wallet*
> ✦ Ver tus ${moneda} en la cartera.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#banco • #bank*
> ✦ Ver tus ${moneda} en el banco.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#deposit • #depositar • #d*
> ✦ Deposita tus ${moneda} al banco.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#with • #retirar • #withdraw*
> ✦ Retira tus ${moneda} del banco.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#transfer • #pay*
> ✦ Transfiere ${moneda} o XP a otros usuarios.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#miming • #minar • #mine*
> ✦ Trabaja como minero y recolecta recursos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#buyall • #buy*
> ✦ Compra ${moneda} con tu XP.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#daily • #diario*
> ✦ Reclama tu recompensa diaria.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cofre*
> ✦ Reclama un cofre diario lleno de recursos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#weekly • #semanal*
> ✦ Reclama tu regalo semanal.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#monthly • #mensual*
> ✦ Reclama tu recompensa mensual.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#steal • #robar • #rob*
> ✦ Intenta robarle ${moneda} a alguien.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#robarxp • #robxp*
> ✦ Intenta robar XP a un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#eboard • #baltop*
> ✦ Ver el ranking de usuarios con más ${moneda}.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#aventura • #adventure*
> ✦ Aventúrate en un nuevo reino y recolecta recursos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#curar • #heal*
> ✦ Cura tu salud para volverte aventurero.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cazar • #hunt • #berburu*
> ✦ Aventúrate en una caza de animales.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#inv • #inventario*
> ✦ Ver tu inventario con todos tus ítems.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#mazmorra • #explorar*
> ✦ Explorar mazmorras para ganar ${moneda}.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#halloween*
> ✦ Reclama tu dulce o truco (Solo en Halloween).
🎴  ੈ₊˚༅༴│.ᰔᩚ *#christmas • #navidad*
> ✦ Reclama tu regalo navideño (Solo en Navidad).
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙶𝚊𝚌𝚑𝚊 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🎴✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐠𝐚𝐜𝐡𝐚 𝐩𝐚𝐫𝐚 𝐫𝐞𝐜𝐥𝐚𝐦𝐚𝐫 𝐲 𝐜𝐨𝐥𝐞𝐜𝐜𝐢𝐨𝐧𝐚𝐫 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐣𝐞𝐬 🎭🌟⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#rollwaifu • #rw • #roll*
> ✦ Waifu o husbando aleatorio.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#claim • #c • #reclamar*
> ✦ Reclamar un personaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#harem • #waifus • #claims*
> ✦ Ver tus personajes reclamados.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#charimage • #waifuimage • #wimage*
> ✦ Ver una imagen aleatoria de un personaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#charinfo • #winfo • #waifuinfo*
> ✦ Ver información de un personaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#givechar • #givewaifu • #regalar*
> ✦ Regalar un personaje a otro usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#vote • #votar*
> ✦ Votar por un personaje para subir su valor.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#waifusboard • #waifustop • #topwaifus*
> ✦ Ver el top de personajes con mayor valor.
🎴  ੈ₊˚༅༴╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝚂𝚝𝚒𝚌𝚔𝚎𝚛𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🖼️✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐩𝐚𝐫𝐚 𝐜𝐫𝐞𝐚𝐜𝐢𝐨𝐧𝐞𝐬 𝐝𝐞 𝐬𝐭𝐢𝐜𝐤𝐞𝐫𝐬, 𝐞𝐭𝐜. 🎨🔖
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sticker • #s*
> ✦ Crea stickers de (imagen/video).
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setmeta*
> ✦ Establece un pack y autor para los stickers.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#delmeta*
> ✦ Elimina tu pack de stickers.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pfp • #getpic*
> ✦ Obtén la foto de perfil de un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#qc*
> ✦ Crea stickers con texto o de un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#toimg • #img*
> ✦ Convierte stickers en imagen.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#brat • #ttp • #attp*︎
> ✦ Crea stickers con texto.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#emojimix*
> ✦ Funciona 2 emojis para crear un sticker.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#wm*
> ✦ Cambia el nombre de los stickers.
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙷𝚎𝚛𝚛𝚊𝚖𝚒𝚎𝚗𝚝𝚊𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🛠️✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐡𝐞𝐫𝐫𝐚𝐦𝐢𝐞𝐧𝐭𝐚𝐬 𝐜𝐨𝐧 𝐦𝐮𝐜𝐡𝐚𝐬 𝐟𝐮𝐧𝐜𝐢𝐨𝐧𝐞𝐬 ⚙️🔧⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#calcular • #calcular • #cal*  
> ✦ Calcular todo tipo de ecuaciones.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#tiempo • #clima*  
> ✦ Ver el clima de un país.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#horario*  
> ✦ Ver el horario global de los países.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#fake • #fakereply*  
> ✦ Crea un mensaje falso de un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#enhance • #remini • #hd*  
> ✦ Mejora la calidad de una imagen.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#letra*  
> ✦ Cambia la fuente de las letras.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#read • #readviewonce • #ver*  
> ✦ Ver imágenes de una sola vista.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#whatmusic • #shazam*  
> ✦ Descubre el nombre de canciones o vídeos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#spamwa • #spam*  
> ✦ Envía spam a un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ss • #ssweb*  
> ✦ Ver el estado de una página web.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#length • #tamaño*  
> ✦ Cambia el tamaño de imágenes y vídeos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#say • #decir* + [texto]  
> ✦ Repetir un mensaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#todoc • #toducument*  
> ✦ Crea documentos de (audio, imágenes y vídeos).
🎴  ੈ₊˚༅༴│.ᰔᩚ *#translate • #traducir • #trad*  
> ✦ Traduce palabras en otros idiomas.
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙿𝚎𝚛𝚏𝚒𝚕 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🆔✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐩𝐞𝐫𝐟𝐢𝐥 𝐩𝐚𝐫𝐚 𝐯𝐞𝐫, 𝐜𝐨𝐧𝐟𝐢𝐠𝐮𝐫𝐚𝐫 𝐲 𝐜𝐨𝐦𝐩𝐫𝐨𝐛𝐚𝐫 𝐞𝐬𝐭𝐚𝐝𝐨𝐬 𝐝𝐞 𝐭𝐮 𝐩𝐞𝐫𝐟𝐢𝐥 📇🔍
🎴  ੈ₊˚༅༴│.ᰔᩚ *#reg • #verificar • #register*
> ✦ Registra tu nombre y edad en el bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#unreg*
> ✦ Elimina tu registro del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#profile*
> ✦ Muestra tu perfil de usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#marry* [mension / etiquetar]
> ✦ Propón matrimonio a otro usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#divorce*
> ✦ Divorciarte de tu pareja.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setgenre • #setgenero*
> ✦ Establece tu género en el perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#delgenre • #delgenero*
> ✦ Elimina tu género del perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setbirth • #setnacimiento*
> ✦ Establece tu fecha de nacimiento en el perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#delbirth • #delnacimiento*
> ✦ Elimina tu fecha de nacimiento del perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setdescription • #setdesc*
> ✦ Establece una descripción en tu perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#deldescription • #deldesc*
> ✦ Elimina la descripción de tu perfil del bot.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#lb • #lboard* + <Paginá>
> ✦ Top de usuarios con más (experiencia y nivel).
🎴  ੈ₊˚༅༴│.ᰔᩚ *#level • #lvl* + <@Mencion>
> ✦ Ver tu nivel y experiencia actual.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#comprarpremium • #premium*
> ✦ Compra un pase premium para usar el bot sin límites.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#confesiones • #confesar*
> ✦ Confiesa tus sentimientos a alguien de manera anonima.
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙶𝚛𝚞𝚙𝚘𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

👥✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐠𝐫𝐮𝐩𝐨𝐬 𝐩𝐚𝐫𝐚 𝐮𝐧𝐚 𝐦𝐞𝐣𝐨𝐫 𝐠𝐞𝐬𝐭𝐢𝐨́𝐧 𝐝𝐞 𝐞𝐥𝐥𝐨𝐬 🔧📢⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#config • #on*
> ✦ Ver opciones de configuración de grupos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#hidetag*
> ✦ Envía un mensaje mencionando a todos los usuarios.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gp • #infogrupo*
> ✦ Ver la información del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#linea • #listonline*
> ✦ Ver la lista de los usuarios en línea.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setwelcome*
> ✦ Establecer un mensaje de bienvenida personalizado.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setbye*
> ✦ Establecer un mensaje de despedida personalizado.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#link*
> ✦ El Bot envía el link del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#admins • #admin*
> ✦ Mencionar a los admins para solicitar ayuda.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#restablecer • #revoke*
> ✦ Restablecer el enlace del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#grupo • #group* [open / abrir]
> ✦ Cambia ajustes del grupo para que todos los usuarios envíen mensaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#grupo • #gruop* [close / cerrar]
> ✦ Cambia ajustes del grupo para que solo los administradores envíen mensaje.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#kick* [número / mención]
> ✦ Elimina un usuario de un grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#add • #añadir • #agregar* [número]
> ✦ Invita a un usuario a tu grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#promote* [mención / etiquetar]
> ✦ El Bot dará administrador al usuario mencionado.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#demote* [mención / etiquetar]
> ✦ El Bot quitará el rol de administrador al usuario mencionado.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gpbanner • #groupimg*
> ✦ Cambiar la imagen del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gpname • #groupname*
> ✦ Cambiar el nombre del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#gpdesc • #groupdesc*
> ✦ Cambiar la descripción del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#advertir • #warn • #warning*
> ✦ Dar una advertencia a un usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#unwarn • #delwarn*
> ✦ Quitar advertencias.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#advlist • #listadv*
> ✦ Ver lista de usuarios advertidos.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#banchat*
> ✦ Banear al Bot en un chat o grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#unbanchat*
> ✦ Desbanear al Bot del chat o grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#mute* [mención / etiquetar]
> ✦ El Bot elimina los mensajes del usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#unmute* [mención / etiquetar]
> ✦ El Bot deja de eliminar los mensajes del usuario.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#encuesta • #poll*
> ✦ Crea una encuesta.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#delete • #del*
> ✦ Elimina mensajes de otros usuarios.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#fantasmas*
> ✦ Ver lista de inactivos del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#kickfantasmas*
> ✦ Elimina a los inactivos del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#invocar • #tagall • #todos*
> ✦ Invoca a todos los usuarios del grupo.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#setemoji • #setemo*
> ✦ Cambia el emoji que se usa en la invitación de usuarios.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#listnum • #kicknum*
> ✦ Elimina a usuarios por el prefijo de país.
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭╼☁️✿⃟⃢᭄͜═✩═『 𝙰𝚗𝚒𝚖𝚎 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🎌✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐫𝐞𝐚𝐜𝐜𝐢𝐨𝐧𝐞𝐬 𝐝𝐞 𝐚𝐧𝐢𝐦𝐞 💢🎭⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#angry • #enojado* + <mencion>
> ✦ Estar enojado
🎴  ੈ₊˚༅༴│.ᰔᩚ *#bite* + <mencion>
> ✦ Muerde a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#bleh* + <mencion>
> ✦ Sacar la lengua
🎴  ੈ₊˚༅༴│.ᰔᩚ *#blush* + <mencion>
> ✦ Sonrojarte
🎴  ੈ₊˚༅༴│.ᰔᩚ *#bored • #aburrido* + <mencion>
> ✦ Estar aburrido
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cry* + <mencion>
> ✦ Llorar por algo o alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cuddle* + <mencion>
> ✦ Acurrucarse
🎴  ੈ₊˚༅༴│.ᰔᩚ *#dance* + <mencion>
> ✦ Sacate los pasitos prohibidos
🎴  ੈ₊˚༅༴│.ᰔᩚ *#drunk* + <mencion>
> ✦ Estar borracho
🎴  ੈ₊˚༅༴│.ᰔᩚ *#eat • #comer* + <mencion>
> ✦ Comer algo delicioso
🎴  ੈ₊˚༅༴│.ᰔᩚ *#facepalm* + <mencion>
> ✦ Darte una palmada en la cara
🎴  ੈ₊˚༅༴│.ᰔᩚ *#happy • #feliz* + <mencion>
> ✦ Salta de felicidad
🎴  ੈ₊˚༅༴│.ᰔᩚ *#hug* + <mencion>
> ✦ Dar un abrazo
🎴  ੈ₊˚༅༴│.ᰔᩚ *#impregnate • #preg* + <mencion>
> ✦ Embarazar a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#kill* + <mencion>
> ✦ Toma tu arma y mata a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#kiss • #besar* • #kiss2 + <mencion>
> ✦ Dar un beso
🎴  ੈ₊˚༅༴│.ᰔᩚ *#laugh* + <mencion>
> ✦ Reírte de algo o alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#lick* + <mencion>
> ✦ Lamer a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#love • #amor* + <mencion>
> ✦ Sentirse enamorado
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pat* + <mencion>
> ✦ Acaricia a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#poke* + <mencion>
> ✦ Picar a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pout* + <mencion>
> ✦ Hacer pucheros
🎴  ੈ₊˚༅༴│.ᰔᩚ *#punch* + <mencion>
> ✦ Dar un puñetazo
🎴  ੈ₊˚༅༴│.ᰔᩚ *#run* + <mencion>
> ✦ Correr
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sad • #triste* + <mencion>
> ✦ Expresar tristeza
🎴  ੈ₊˚༅༴│.ᰔᩚ *#scared* + <mencion>
> ✦ Estar asustado
🎴  ੈ₊˚༅༴│.ᰔᩚ *#seduce* + <mencion>
> ✦ Seducir a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#shy • #timido* + <mencion>
> ✦ Sentir timidez
🎴  ੈ₊˚༅༴│.ᰔᩚ *#slap* + <mencion>
> ✦ Dar una bofetada
🎴  ੈ₊˚༅༴│.ᰔᩚ *#dias • #days*
> ✦ Darle los buenos días a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#noches • #nights*
> ✦ Darle las buenas noches a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sleep* + <mencion>
> ✦ Tumbarte a dormir
🎴  ੈ₊˚༅༴│.ᰔᩚ *#smoke* + <mencion>
> ✦ Fumar
🎴  ੈ₊˚༅༴│.ᰔᩚ *#think* + <mencion>
> ✦ Pensar en algo
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙽𝚂𝙵𝚆 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🔞✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐍𝐒𝐅𝐖 (𝐂𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𝐩𝐚𝐫𝐚 𝐚𝐝𝐮𝐥𝐭𝐨𝐬) 🍑🔥⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#anal* + <mencion>
> ✦ Hacer un anal
🎴  ੈ₊˚༅༴│.ᰔᩚ *#waifu*
> ✦ Buscá una waifu aleatorio.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#bath* + <mencion>
> ✦ Bañarse
🎴  ੈ₊˚༅༴│.ᰔᩚ *#blowjob • #mamada • #bj* + <mencion>
> ✦ Dar una mamada
🎴  ੈ₊˚༅༴│.ᰔᩚ *#boobjob* + <mencion>
> ✦ Hacer una rusa
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cum* + <mencion>
> ✦ Venirse en alguien.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#fap* + <mencion>
> ✦ Hacerse una paja
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ppcouple • #ppcp*
> ✦ Genera imágenes para amistades o parejas.
🎴  ੈ₊˚༅༴│.ᰔᩚ *#footjob* + <mencion>
> ✦ Hacer una paja con los pies
🎴  ੈ₊˚༅༴│.ᰔᩚ *#fuck • #coger • #fuck2* + <mencion>
> ✦ Follarte a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#cafe • #coffe*
> ✦ Tomate un cafecito con alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#violar • #perra* + <mencion>
> ✦ Viola a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#grabboobs* + <mencion>
> ✦ Agarrar tetas
🎴  ੈ₊˚༅༴│.ᰔᩚ *#grop* + <mencion>
> ✦ Manosear a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#lickpussy* + <mencion>
> ✦ Lamer un coño
🎴  ੈ₊˚༅༴│.ᰔᩚ *#rule34 • #r34* + [Tags]
> ✦ Buscar imágenes en Rule34
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sixnine • #69* + <mencion>
> ✦ Haz un 69 con alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#spank • #nalgada* + <mencion>
> ✦ Dar una nalgada
🎴  ੈ₊˚༅༴│.ᰔᩚ *#suckboobs* + <mencion>
> ✦ Chupar tetas
🎴  ੈ₊˚༅༴│.ᰔᩚ *#undress • #encuerar* + <mencion>
> ✦ Desnudar a alguien
🎴  ੈ₊˚༅༴│.ᰔᩚ *#yuri • #tijeras* + <mencion>
> ✦ Hacer tijeras.
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,

╔═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╗
╭☁️✿⃟⃢᭄͜═✩═『 𝙹𝚞𝚎𝚐𝚘𝚜 』═✩═⃟⃢᭄͜✿☁️
╚═̸═᪵̊̈᪣═͟͜═͜═⃨̊═⃮ ⃜• °ͧͦ͛͜͡ ⃟⃘⃖❁⃙֑֖֛⃨֚͑͒֒֓֔֕֗֘֙֜ؓ⃛ͯ͜⊕⃚ֱ֦֢֣֤֥֦֧⃨᪶᪹᪽֝֞֟֠֡֨ؓ⃰⃛ͯ᪰᪼͜᪾᪰❁⃟⃘⃨⃗ °ࣶࣦࣸ͒͑͜͡͡ • ⃯═⃛═⃨̊═͜═͟͜═̈̊᪣═̷᪵╝

🎮✨⊹ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐣𝐮𝐞𝐠𝐨𝐬 𝐩𝐚𝐫𝐚 𝐣𝐮𝐠𝐚𝐫 𝐜𝐨𝐧 𝐭𝐮𝐬 𝐚𝐦𝐢𝐠𝐨𝐬 🕹️🎲⊹
🎴  ੈ₊˚༅༴│.ᰔᩚ *#amistad • #amigorandom* 
> ✦ Hacer amigos con un juego.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#chaqueta • #jalamela*  
> ✦ Hacerte una chaqueta.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#chiste*  
> ✦ La bot te cuenta un chiste.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#consejo*  
> ✦ La bot te da un consejo.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#doxeo • #doxear* + <mención>  
> ✦ Simular un doxeo falso.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#facto*  
> ✦ La bot te lanza un facto.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#formarpareja*  
> ✦ Forma una pareja.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#formarpareja5*  
> ✦ Forma 5 parejas diferentes.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#frase*  
> ✦ La bot te da una frase.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#huevo*  
> ✦ Agárrale el huevo a alguien.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#chupalo* + <mención>  
> ✦ Hacer que un usuario te la chupe.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#aplauso* + <mención>  
> ✦ Aplaudirle a alguien.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#marron* + <mención>  
> ✦ Burlarte del color de piel de un usuario.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#suicidar*  
> ✦ Suicídate.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#iq • #iqtest* + <mención>  
> ✦ Calcular el IQ de alguna persona.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#meme*  
> ✦ La bot te envía un meme aleatorio.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#morse*  
> ✦ Convierte un texto a código morse.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#nombreninja*  
> ✦ Busca un nombre ninja aleatorio.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#paja • #pajeame*  
> ✦ La bot te hace una paja.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#personalidad* + <mención>  
> ✦ La bot busca tu personalidad.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#piropo*  
> ✦ Lanza un piropo.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pregunta*  
> ✦ Hazle una pregunta a la bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ship • #pareja*  
> ✦ La bot te da la probabilidad de enamorarte de una persona.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sorteo*  
> ✦ Empieza un sorteo.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#top*  
> ✦ Empieza un top de personas.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#formartrio* + <mención>  
> ✦ Forma un trío.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ahorcado*  
> ✦ Diviértete jugando al ahorcado con la bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#genio*  
> ✦ Comienza una ronda de preguntas con el genio.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#mates • #matematicas*  
> ✦ Responde preguntas de matemáticas para ganar recompensas.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ppt*  
> ✦ Juega piedra, papel o tijeras con la bot.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#sopa • #buscarpalabra*  
> ✦ Juega al famoso juego de sopa de letras.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#pvp • #suit* + <mención>  
> ✦ Juega un PVP contra otro usuario.  
🎴  ੈ₊˚༅༴│.ᰔᩚ *#ttt*  
> ✦ Crea una sala de juego.  
╰────︶.︶ ⸙ ͛ ͎ ͛  ︶.︶ ੈ₊˚༅,
  `.trim();

  // Enviar el video GIF con el texto en un solo mensaje
  await conn.sendMessage(m.chat, { 
      video: { url: randomGif },
      caption: txt,
      gifPlayback: true, // ESTO HACE QUE EL VIDEO SE VEA COMO GIF
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardingScore: 999,
      },
  }, { quoted: m });

};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];

export default handler;

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
