// Boite qui garde les messages en mémoire
let messages: any[] = [];

export function addMessage(msg: any) {
    messages.unshift({
        id: Date.now(),
        ...msg,
        time: new Date().toLocaleString(),
    });
    // Garde seulement les 100 derniers
    if (messages.length > 100) messages = messages.slice(0, 100);
}

export function getMessages() {
    return messages;
}