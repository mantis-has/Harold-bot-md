import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';  
// Importar el paquete yt-search

const handler = async (m, { conn, text, command, botname }) => {
  if (command === 'play') {
    // Validar que el usuario haya ingresado un texto
    if (!text?.trim()) {
      return conn.reply(m.chat, '❗ Por favor, ingresa el nombre o enlace del video que deseas buscar.', m);
    }

    try {
      let videoUrl;

      // Si el texto ingresado es un enlace de YouTube válido
      if (ytdl.validateURL(text)) {
        videoUrl = text;
      } else {
        // Si no es un enlace, buscar el video por nombre usando yt-search
        const results = await ytSearch(text);
        const video = results.videos[0];  // Tomar el primer video encontrado
        if (!video) {
          return conn.reply(m.chat, '❗ No se encontró ningún video con ese nombre.', m);
        }
        
        // Obtener el enlace del primer video encontrado
        videoUrl = video.url;
      }

      // Obtener información del video desde YouTube
      const videoInfo = await ytdl.getInfo(videoUrl);
      const { title, video_url, thumbnails, lengthSeconds, author, viewCount, uploadDate } = videoInfo.videoDetails;

      // Formatear duración (en minutos y segundos)
      const duration = formatDuration(lengthSeconds);

      // Formatear vistas con separador de miles
      const vistas = Number(viewCount).toLocaleString('es-ES');

      // Obtener miniatura (la última es generalmente de alta calidad)
      const thumbnail = thumbnails[thumbnails.length - 1]?.url || '';

      // Crear mensaje informativo
      const infoMessage = `
︵۪۪۪۪۪۪۪⏜໋᳝ׅ۪۪۪࣪╼╽═┅᪲━᳝ׅ࣪🍒━ּ᳝ׅ࣪ᰰᩫ┅═╽╾໋᳝۪۪۪۪࣪⏜۪۪۪۪۪۪۪۪︵
░ׅ ׄᰰׅ᷒𓎆  ֺᨳ︪︩፝֟͝. \`DESCARGAS - RUBY 🔥\` :

> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐓𝐢𝐭𝐮𝐥𝐨:* ${title}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐂𝐚𝐧𝐚𝐥:* ${author.name}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐕𝐢𝐬𝐭𝐚𝐬:* ${vistas}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧:* ${duration}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨:* ${uploadDate}
> ▭⵿ᜒ፝֟▬̸̷۪۪۪۪۪۪̈֟𐒻_ : *𝐄𝐧𝐥𝐚𝐜𝐞:* ${video_url}
.⏝࿚‿᧔᧓‿࿙⏝.

ᅟ  !    𝅼        🎬ᩙᩖ     ㅤׁ   ꒰꒰   𝅼         ꯴

❙᳝፝۫֔🍒̸̷͚᪲໑ּ๋݂͚ 𝐄𝐬𝐩𝐞𝐫𝐚... 𝐬𝐞 𝐞𝐬𝐭𝐚́ 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐭𝐮 𝐜𝐨𝐧𝐭𝐞𝐧𝐢𝐝𝐨 𓂃 🕊️
⌜ 𖦹 𝐑𝐮𝐛𝐲 𝐇𝐨𝐬𝐡𝐢𝐧𝐨 𖦹 ⌟
      `;

      // Enviar mensaje informativo al usuario
      await conn.sendMessage(m.chat, { text: infoMessage }, {
        quoted: m,
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: 'Descarga de YouTube',
            mediaType: 1,
            previewType: 0,
            mediaUrl: video_url,
            sourceUrl: video_url,
            thumbnail,
            renderLargerThumbnail: true
          }
        }
      });

      // Crear un stream solo de audio desde el video
      const audioStream = ytdl(video_url, {
        filter: 'audioonly', // Descargar solo el audio
        quality: 'highestaudio' // Usar la mejor calidad de audio disponible
      });

      // Enviar el archivo de audio al usuario
      await conn.sendMessage(m.chat, {
        audio: audioStream,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });

    } catch (err) {
      console.error('Error en .play:', err);
      m.reply(`❌ Error al procesar el audio: ${err.message}`);
    }
  }
};

// Función para convertir la duración en segundos a minutos:segundos
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Registro del comando
handler.command = ['play'];
handler.help = ['play <enlace o nombre>'];
handler.tags = ['descargas'];

export default handler;