const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_6514');
    const sock = makeWASocket({ auth: state, printQRInTerminal: false });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { qr, connection } = update;
        if (qr) {
            console.log('--- SCANNE CE QR ---');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log('✅ CONNECTÉ! BRAVO BOUBA!');
        }
    });
}
start();