import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, text, command, args }) => {
  if (command === 'play') {
    if (!text.trim() && !args[0]) {
      return conn.reply(m.chat, 'Por favor, ingresa el nombre o la URL del audio a buscar/descargar.', m);
    }

    const query = text.trim() || args[0];
    let videoInfo;

    try {
      if (query.includes('youtu')) {
        const search = await yts({ videoId: query.split('v=')[1] });
        if (!search.videos.length) {
          return conn.reply(m.chat, 'No se encontró información para esa URL.', m);
        }
        videoInfo = search.videos[0];
      } else {
        const search = await yts(query);
        if (!search.videos.length) {
          return conn.reply(m.chat, 'No se encontraron resultados para tu búsqueda.', m);
        }
        videoInfo = search.videos[0];
      }

      const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
      const vistas = formatViews(views);
      const canal = author.name || 'Desconocido';

      const infoMessage = `
🎶 *Descargando Audio* 🎶
──────────────────
📌 *Título:* ${title}
🎤 *Autor:* ${canal}
👁️ *Vistas:* ${vistas}
📅 *Publicado:* ${ago}
🔗 *Enlace:* ${url}
──────────────────
⏳ *Preparando la descarga...*
      `;

      await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: infoMessage }, { quoted: m });

      const api = await fetchAPI(url, 'audio');
      const audioUrl = api.download || api.data?.url;

      if (!audioUrl) {
        return conn.reply(m.chat, '❌ No se pudo obtener la URL de descarga del audio.', m);
      }

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });

    } catch (error) {
      console.error('Error en el comando getaudio:', error);
      conn.reply(m.chat, `❌ Ocurrió un error al buscar y descargar el audio: ${error.message}`, m);
    }
  }
};

const fetchAPI = async (url, type) => {
  const endpoint = `https://api.neoxr.eu/api/youtube?url=${url}&type=${type}&quality=128kbps&apikey=Paimon`;
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching API:', error);
    return { status: false, message: error.message };
  }
};

const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

handler.command = ['play', 'audio'];
handler.help = ['play <nombre/url>', 'audio <nombre/url>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
