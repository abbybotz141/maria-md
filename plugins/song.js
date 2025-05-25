const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["ytplay", "play"],
    react: "🎶",
    desc: "Plays music from YouTube (audio only).",
    category: "downloader",
    filename: __filename,
}, async (conn, mek, m, { from, args, text, reply }) => {
    if (!text) return reply("❌ Please enter the name of the song.\nExample: `.play let me love you`");

    try {
        const apiUrl = `https://vihangayt.me/tools/ytplay?q=${encodeURIComponent(text)}`;
        const res = await fetchJson(apiUrl);

        if (!res.status || !res.result) return reply("❌ Song not found or API error.");

        const { title, duration, thumbnail, audio } = res.result;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `🎵 *Title:* ${title}\n🕒 *Duration:* ${duration}\n\nDownloading audio...`,
        }, { quoted: mek });

        const audioBuffer = await axios.get(audio, { responseType: 'arraybuffer' });

        await conn.sendMessage(from, {
            audio: Buffer.from(audioBuffer.data),
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Error occurred while processing your request.");
    }
});
