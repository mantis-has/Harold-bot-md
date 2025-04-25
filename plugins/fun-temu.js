import fs from 'fs';
import path from 'path';

export default async function handler(m, { conn }) {
    const usuario = global.db.data.users[m.sender];
    const costo = 1000;

    if (!usuario) return m.reply(`${emoji2} No estás registrado en la base de datos.`);

    if (usuario.coin < costo) {
        return m.reply(`${emoji2} No tienes suficiente dinero.\nTienes: ${usuario.coin}\nNecesitas: ${costo}`);
    }

    const carpeta = '../media/temu/';
    const archivos = fs.readdirSync(carpeta);

    const pedidos = archivos.filter(f => /^pedido\d+\.(jpg|jpeg|png)$/i.test(f));
    const llegadas = archivos.filter(f => /^llegada\d+\.(jpg|jpeg|png)$/i.test(f));

    const combos = pedidos.map(pedido => {
        const numero = pedido.match(/\d+/)[0];
        const llegada = llegadas.find(l => l.match(new RegExp(`llegada${numero}\\.(jpg|jpeg|png)$`, 'i')));
        if (llegada) {
            return {
                pedido: path.join(carpeta, pedido),
                llegada: path.join(carpeta, llegada)
            };
        }
    }).filter(Boolean);

    if (combos.length === 0) return m.reply(`${emoji2} No se encontraron imágenes válidas de pedido y llegada.`);

    usuario.coin -= costo;

    const combo = combos[Math.floor(Math.random() * combos.length)];
    const nombrePedido = path.basename(combo.pedido);
    const nombreLlegada = path.basename(combo.llegada);

    await conn.sendFile(m.chat, combo.pedido, nombrePedido, `✅ Pediste un paquete en Temu\nCosto: ${costo} ${moneda}\nLlega en 30 segundos...`, m);

    setTimeout(() => {
        conn.sendFile(m.chat, combo.llegada, nombreLlegada, `📦 @${m.sender.split('@')[0]}, ¡tu paquete de Temu ya llegó!`, m, { mentions: [m.sender] });
    }, 30 * 1000);
}

handler.help = ['temu'];
handler.tags = ['fun'];
handler.command = ['temu'];
handler.register = true;