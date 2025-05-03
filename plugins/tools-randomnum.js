
const { cmd, commands } = require('../command');

cmd({
    pattern: "random",
    desc: "🎲 Generate random number in range",
    react: "🎲",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes('-')) return reply('Please provide range like: random 1-100');
    const [min, max] = q.split('-').map(Number);
    if (isNaN(min) || isNaN(max)) return reply('Invalid range. Use numbers like: 1-100');
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    reply(`🎲 *Random number between ${min} and ${max}:*\n${num}`);
});
