import { addMessage } from './messagestore';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import fs from "fs"

export let MESSAGES: any[] = []
let sock: any = null

if (fs.existsSync("./messages.json")) {
    try { MESSAGES = JSON.parse(fs.readFileSync("./messages.json", "utf-8")) } catch { }
}

export async function startWhatsApp() {
    if (sock) return sock

    const { state, saveCreds } = await useMultiFileAuthState("auth_6514")

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    })

    sock.ev.on("creds.update", saveCreds)
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const texte = msg.message.conversation || msg.message.extendedTextMessage?.text || "Media";
            const numero = msg.key.remoteJid?.replace("@s.whatsapp.net", "");
            addMessage({
                id: msg.key.id,
                numero: numero,
                texte: texte,
                date: new Date().toLocaleTimeString(),
            });
            console.log(`📩 Nouveau de ${numero}: ${texte}`);
        }
    });
    // SI PAS ENCORE CONNECTÉ -> DEMANDE UN CODE A 8 CHIFFRES
    if (!state.creds.registered) {
        setTimeout(async () => {
            try {
                // TON NUMÉRO SANS ESPACE, AVEC INDICATIF 237
                const code = await sock.requestPairingCode("237651465708")
                console.log("\n\n========================================")
                console.log(` TON CODE WHATSAPP EST: ${code} `)
                console.log("========================================")
                console.log("Va sur WhatsApp 651465708:")
                console.log("1. Appareils liés")
                console.log("2. Lier un appareil")
                console.log("3. En bas clique 'Lier avec numéro de téléphone'")
                console.log(`4. Tape ce code: ${code}`)
                console.log("========================================\n\n")
            } catch (e) {
                console.log("Erreur code pairing:", e)
            }
        }, 3000)
    }

    sock.ev.on("connection.update", (update: any) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) { sock = null; startWhatsApp() }
        } else if (connection === "open") {
            console.log("✅✅✅ CONNECTÉ 651465708 GRATUIT SANS MAKE! ✅✅✅")
        }
    })

    sock.ev.on("messages.upsert", async (m: any) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "media"
        const phone = msg.key.remoteJid
        console.log(`📩 DIRECT 6514: ${phone} => ${text}`)
        const newMsg = { id: Date.now(), phone, text, timestamp: new Date().toISOString(), from: "client", source: "direct" }
        MESSAGES.push(newMsg)
        fs.writeFileSync("./messages.json", JSON.stringify(MESSAGES, null, 2))
    })

    return sock
}