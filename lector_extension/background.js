chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "leerTexto",
        title: "🔊 Leer esto",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "leerTexto" && info.selectionText) {
        chrome.tts.speak(info.selectionText, {
            lang: 'es-AR',
            rate: 1.0
        });
    }
});
