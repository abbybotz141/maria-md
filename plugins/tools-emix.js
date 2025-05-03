const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: "emix",
    desc: "🎭 Mix two emojis together",
    react: "🎭",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes('+')) return reply('Please provide two emojis separated by +\nExample: emix 😊+😂');
    const [emoji1, emoji2] = q.split('+');
    try {
        const response = await axios.get(`https://emix-api.vercel.app/combine?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`);
        reply({ url: response.data.url }, 'image');
    } catch {
        reply('Failed to mix emojis. Please try different emojis.');
    }
});