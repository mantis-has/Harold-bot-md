import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'src', 'pistolas.json');

// Función para leer los datos de pistolas desde el archivo JSON
const readPistolasData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { usuarios: {}, topPoder: {} };
  }
};

// Función para guardar los datos de pistolas en el archivo JSON
const savePistolasData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Lista de todas las armas posibles con sus poderes (basados en daño real aproximado)
const armas = {
  espadas: [
    { nombre: 'Katana', poder: 80 },
    { nombre: 'Espada Larga', poder: 70 },
    { nombre: 'Daga', poder: 30 },
    { nombre: 'Mandoble', poder: 95 },
    { nombre: 'Sable', poder: 65 },
  ],
  pistolas: [
    { nombre: 'Glock 19', poder: 45 },
    { nombre: 'Beretta M9', poder: 40 },
    { nombre: 'Colt 1911', poder: 50 },
    { nombre: 'Sig Sauer P320', poder: 42 },
    { nombre: 'Walther PPK', poder: 35 },
    { nombre: 'Desert Eagle', poder: 60 },
    { nombre: 'Revolver Smith & Wesson Modelo 29', poder: 55 },
  ],
  rifles: [
    { nombre: 'AK-47', poder: 75 },
    { nombre: 'M4A1', poder: 70 },
    { nombre: 'SCAR-L', poder: 72 },
    { nombre: 'G36', poder: 68 },
  ],
  escopetas: [
    { nombre: 'Benelli M4', poder: 90 },
    { nombre: 'Remington 870', poder: 85 },
  ],
  subfusiles: [
    { nombre: 'MP5', poder: 60 },
    { nombre: 'P90', poder: 58 },
  ],
};

// Enfriamiento para el comando .pistolas (5 minutos en milisegundos)
const cooldownTime = 5 * 60 * 1000;
const cooldowns = new Map();

const handler = async (m, { conn, command }) => {
  const userData = readPistolasData();
  const userId = m.sender;

  // Inicializar datos del usuario si no existen
  if (!userData.usuarios[userId]) {
    userData.usuarios[userId] = { pistolas: {}, pistolascoins: 0, lastPistolasTime: 0 };
  }

  if (command === 'pistolas') {
    const now = Date.now();
    if (cooldowns.has(userId) && now < cooldowns.get(userId)) {
      const timeLeft = Math.ceil((cooldowns.get(userId) - now) / 1000 / 60);
      return m.reply(`⏳ ¡Espera! El comando .pistolas estará disponible en ${timeLeft} minutos.`);
    }

    if (userData.usuarios[userId].pistolascoins < 30) {
      return m.reply('💸 No tienes suficientes PistolaCoins. Envía mensajes para conseguir más.');
    }

    userData.usuarios[userId].pistolascoins -= 30;
    cooldowns.set(userId, now + cooldownTime);

    const pistolasDisponibles = armas.pistolas;
    const randomIndex = Math.floor(Math.random() * pistolasDisponibles.length);
    const nuevaPistola = pistolasDisponibles[randomIndex];
    const nombrePistola = nuevaPistola.nombre;
    const poderPistola = nuevaPistola.poder;

    if (userData.usuarios[userId].pistolas[nombrePistola]) {
      userData.usuarios[userId].pistolas[nombrePistola].cantidad++;
    } else {
      userData.usuarios[userId].pistolas[nombrePistola] = { cantidad: 1, poder: poderPistola };
    }

    savePistolasData(userData);
    m.reply(`🔫 ¡Giro completado! Obtuviste una: *${nombrePistola}* (Poder: ${poderPistola}).`);
  } else if (command === 'mipistolas') {
    if (Object.keys(userData.usuarios[userId].pistolas).length === 0) {
      return m.reply('🔫 No tienes ninguna pistola aún. ¡Usa el comando .pistolas para conseguir una!');
    }

    let mensaje = '🔫 *Tus Pistolas:* 🔫\n';
    let poderTotal = 0;
    for (const pistola in userData.usuarios[userId].pistolas) {
      const cantidad = userData.usuarios[userId].pistolas[pistola].cantidad;
      const poderUnitario = userData.usuarios[userId].pistolas[pistola].poder;
      const poderTotalPistola = cantidad * poderUnitario;
      mensaje += `\n• ${pistola} x${cantidad} (Poder/u: ${poderUnitario}) = *${poderTotalPistola}*`;
      poderTotal += poderTotalPistola;
    }
    mensaje += `\n\n💥 *Poder Total de Pistolas:* ${poderTotal}`;
    m.reply(mensaje);
  } else if (command === 'pistolascoins') {
    m.reply(`💰 Tienes *${userData.usuarios[userId].pistolascoins}* PistolaCoins.`);
  }
};

handler.before = async (m) => {
  const userData = readPistolasData();
  const userId = m.sender;

  if (!userData.usuarios[userId]) {
    userData.usuarios[userId] = { pistolas: {}, pistolascoins: 0, lastPistolasTime: 0 };
  }

  // Otorgar PistolaCoins por enviar mensajes (ajusta la frecuencia y cantidad según lo desees)
  if (!m.isBaileys && !m.isGroup) { // Solo en chats privados
    const chance = Math.random();
    if (chance < 0.05) { // 5% de probabilidad de ganar monedas por mensaje
      const coinsGanadas = Math.floor(Math.random() * 5) + 1; // Ganar de 1 a 5 monedas
      userData.usuarios[userId].pistolascoins += coinsGanadas;
      m.reply(`✨ ¡Has encontrado ${coinsGanadas} PistolaCoins!`);
      savePistolasData(userData);
    }
  }
  return true;
};

handler.help = ['.pistolas', '.mipistolas', '.pistolascoins'];
handler.tags = ['gacha'];
handler.command = ['pistolas', 'mipistolas', 'pistolascoins'];

export default handler;
