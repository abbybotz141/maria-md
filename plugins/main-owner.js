const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "owner",
    desc: "👑 Get bot owner information",
    react: "👑",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Abbey-Tech
ORG:Developer of Maria-MD;
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:+${config.OWNER_NUMBER}
X-ABLabel:📞 Call Owner
EMAIL: fareedjimoh06@gmail.com
X-ABLabel:📧 Email
URL: https://abbywebsite.vercel.app
X-ABLabel:🌐 Website
NOTE:Contact for bot related queries
END:VCARD
    `.trim();
    
    await conn.sendMessage(from, {
        contacts: {
            displayName: "Abby-Tech",
            contacts: [{ vcard }]
        }
    }, { quoted: mek });
    
    reply(`👑 *Bot Owner Information* 👑
    
🤖 *Bot Name:* Maria-MD
👨‍💻 *Developer:* Abby-Tech (Gamer-Abby)
📱 *Contact:* +${config.OWNER_NUMBER}
📧 *Email:* fareedjimoh06@gmail.com
🌐 *Website:* https://abbywebsite.vercel.app`);
});
