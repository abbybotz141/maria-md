const { cmd, commands } = require('../command');

cmd({
    pattern: "password",
    desc: "🔑 Generate a strong password",
    react: "🔑",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    const length = q && !isNaN(q) ? Math.min(64, Math.max(8, parseInt(q))) : 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    reply(`🔑 *Generated Password (${length} chars):*\n\`\`\`${password}\`\`\``);
});
