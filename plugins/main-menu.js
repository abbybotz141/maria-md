const config = require('../config');
const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { h, m, s } = require('../lib/functions');

// Path configuration
const mediaPath = {
    audio: path.join(__dirname, '../lib/media/menu-audio.mp3')
};

cmd({
    pattern: "menu",
    desc: "Get command list with media",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const categories = {
            download: '*📥 DOWNLOAD COMMANDS*',
            main: '𝙼𝙰𝙸𝙽',
            anime: '𝙰𝙽𝙸𝙼𝙴',
            group: '𝙶𝚁𝙾𝚄𝙿',
            admin: '𝙰𝙳𝙼𝙸𝙽',
            other: '𝙾𝚃𝙷𝙴𝚁',
            owner: '𝙾𝚆𝙽𝙴𝚁',
            settings: '𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂',
            general: '𝙶𝙴𝙽𝙴𝚁𝙰𝙻',
            tools: '𝚃𝙾𝙾𝙻𝚂',
        };

        let menu = {};

        // Initialize categories
        for (const category in categories) {
            menu[category] = '';
        }

        // Populate commands
        commands.forEach(command => {
            if (command.pattern && !command.dontAddCommandList && categories[command.category]) {
                menu[command.category] += `│ ❉ ${config.PREFIX}${command.pattern}\n`;
            }
        });

        // Date and time configuration
        const dateOptions = {
            timeZone: 'Africa/Lagos',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const timeOptions = {
            timeZone: 'Africa/Lagos',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const date = new Date().toLocaleDateString('en-US', dateOptions);
        const time = new Date().toLocaleTimeString('en-US', timeOptions);

        // Uptime calculation
        const uptime = process.uptime();  // Get uptime in seconds
        const days = Math.floor(uptime / (3600 * 24));
        const hours = Math.floor((uptime % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Build menu sections
        let madeMenu = 
            `╭───〔 🌸 *𝙼𝙰𝚁𝙸𝙰-𝙼𝙳* 🌸 〕───⬣
│ 📅 *𝙳𝙰𝚃𝙴:* ${date}
│ 🕐 *𝚃𝙸𝙼𝙴:* ${time}
│ ⏱️ *𝚄𝙿𝚃𝙸𝙼𝙴:* ${days}d ${hours}h ${minutes}m ${seconds}s
│ 👑 *𝙾𝚆𝙽𝙴𝚁:* 𝙻𝙾𝚁𝙳 𝙰𝙱𝙱𝚈 𝚃𝙴𝙲𝙷
│ 🔧 *𝙿𝚁𝙴𝙵𝙸𝚇:* .\n
╰──────────────\n`;

        for (const [category, title] of Object.entries(categories)) {
            if (menu[category]) {
                madeMenu += `
┅┅┅✦《 ${title} 》✦┅┅┅
${menu[category]}╰───────────❍`;
            }
        }

        madeMenu += "\n\n> *𝙼𝙰𝚁𝙸𝙰 𝙼𝙳| 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 *";

        // Send menu with image if available
        if (config.ALIVE_IMG) {
            await conn.sendMessage(from, {
                image: { url: config.ALIVE_IMG },
                caption: madeMenu
            }, { quoted: mek });
        } else {
            // Fallback to text only
            await conn.sendMessage(from, { text: madeMenu }, { quoted: mek });
            await reply('⚠️ Menu image is missing!');
        }
    } catch (e) {
        console.error('Menu Error:', e);
        await reply(`❌ Error: ${e.message}`);
    }
});

/* Coded by Techbros*/
