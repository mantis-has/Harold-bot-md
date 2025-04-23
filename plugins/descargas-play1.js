import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Función para crear la carpeta ./tmp si no existe
function crearCarpetaTmp() {
  const dir = './tmp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// Función para descargar archivo desde URL y guardarlo en ./tmp
async function descargarArchivoDesdeUrl(url, nombreArchivo) {
  const filePath = path.join('./tmp', nombreArchivo);
  const writer = fs.createWriteStream(filePath);
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  return filePath;
}

// Función para limpiar la carpeta ./tmp
function limpiarTmp() {
  const dir = './tmp';
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error al borrar archivo:', err.message);
      }
    }
  }
}

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play2') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, '🔎 Por favor, ingresa el nombre o la URL del video de YouTube.', m);
    }

    let query = text.trim() || args[0];
    let resolution = '480p';

    const fullMatch = text.match(/full\s*(\d{3,4}p)/i);
    if (fullMatch) {
      resolution = fullMatch[1];
      query = text.replace(fullMatch[0], '').trim();
    }

    let youtubeUrl;
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query)) {
      youtubeUrl = query;
    } else {
      try {
        const search = await yts(query);
        if (!search.videos.length) {
          return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
        }
        youtubeUrl = search.videos[0].url;
      } catch (error) {
        console.error('Error al buscar el video:', error);
        return conn.reply(m.chat, `❌ Error al buscar el video: ${error.message}`, m);
      }
    }

    try {
      // Crear la carpeta ./tmp si no existe
      crearCarpetaTmp();

      const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true`);
      const infoData = await infoRes.json();

      if (infoData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje}`, m);
      }

      const { title, thumbnail } = infoData.result;
      const msg = `
🎬 Preparando Video 🎬
────────────────────
📌 Título: ${title}
🎬 Resolución: ${resolution}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      const downloadRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&resolution=${resolution}`);
      const downloadData = await downloadRes.json();

      if (downloadData.status !== 'success') {
        return conn.reply(m.chat, `❌ Error al descargar el video: ${downloadData.mensaje}`, m);
      }

      const fileUrl = downloadData.result.download;
      const fileSize = downloadData.result.size;
      const fileName = `${title || 'video'}.mp4`;

      if (fileSize > 100) {
        const localPath = await descargarArchivoDesdeUrl(fileUrl, fileName);
        await conn.sendMessage(m.chat, {
          document: { url: localPath },
          mimetype: 'video/mp4',
          fileName
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: fileUrl },
          mimetype: 'video/mp4',
          fileName
        }, { quoted: m });
      }

      // Limpiar la carpeta ./tmp después de enviar el archivo
      limpiarTmp();

    } catch (err) {
      console.error('Error al contactar la API:', err);
      conn.reply(m.chat, `❌ Error al contactar la API: ${err.message}`, m);
    }
  }
};

handler.command = ['play2'];
handler.help = ['play2 <nombre/url> [full <resolución>]'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;