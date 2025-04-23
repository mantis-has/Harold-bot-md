import yts from 'yt-search'; // Para búsqueda en YouTube
import fetch from 'node-fetch'; // Para realizar las peticiones HTTP
import axios from 'axios'; // Para descargar archivos desde URL
import fs from 'fs'; // Para manipular el sistema de archivos
import path from 'path'; // Para manejar rutas de archivos

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
    let resolution = '480p';  // Resolución predeterminada

    // Intentar encontrar una resolución personalizada en el mensaje
    const fullMatch = text.match(/full\s*(\d{3,4}p)/i);
    if (fullMatch) {
      resolution = fullMatch[1];  // Si se especifica "full", usar esa resolución
      query = text.replace(fullMatch[0], '').trim();  // Eliminar la resolución del texto
    }

    let youtubeUrl;

    // Verificar si el texto es una URL de YouTube o hacer una búsqueda
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

      // Obtener la información del video sin descargarlo
      const infoRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false&info=true`);
      const infoData = await infoRes.json();

      // Verificar si la respuesta contiene datos válidos
      if (infoData.status !== 'success' || !infoData.result) {
        console.error('Error al obtener la información:', JSON.stringify(infoData, null, 2));  // Imprimir la respuesta completa
        return conn.reply(m.chat, `❌ Error al obtener la información: ${infoData.mensaje || 'Datos incompletos de la API.'}`, m);
      }

      const { title, thumbnail } = infoData.result;

      // Mensaje con resolución, aunque no se descargará según ella
      const msg = `
🎬 Preparando Video 🎬
────────────────────
📌 Título: ${title}
🎬 Resolución: ${resolution}
⏳ Descargando...
      `.trim();

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msg }, { quoted: m });

      // Descargar el video sin resolución específica, solo el video por defecto
      const downloadRes = await fetch(`http://api-nevi.ddns.net:8000/youtube?url=${encodeURIComponent(youtubeUrl)}&audio=false`);
      const downloadData = await downloadRes.json();

      // Verificar si la respuesta de descarga es válida
      if (downloadData.status !== 'success' || !downloadData.result || !downloadData.result.download) {
        console.error('Error al obtener la URL de descarga:', JSON.stringify(downloadData, null, 2));  // Imprimir la respuesta completa
        return conn.reply(m.chat, `❌ Error al descargar el video: ${downloadData.mensaje || 'No se pudo obtener la URL de descarga.'}`, m);
      }

      const fileUrl = downloadData.result.download;
      const fileSize = downloadData.result.size; // Debe ser en MB, ajusta si es en bytes
      const fileName = `${title || 'video'}.mp4`;

      // Si el video es grande (más de 100 MB), lo descargamos localmente, de lo contrario lo enviamos directamente
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
handler.help = ['play2 <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;