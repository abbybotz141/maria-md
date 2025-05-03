const { cmd } = require('../command')
const os = require('os')
const config = require('../config')

cmd({
  pattern: "uptime",
  desc: "Shows how long the bot has been running.",
  category: "tools",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
  try {
    const uptime = process.uptime() * 1000
    const formatUptime = (ms) => {
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      return `${h}h ${m}m ${s}s`
    }

    const caption = `╭─❒ ᴜᴘᴛɪᴍᴇ ʀᴇᴘᴏʀᴛ
│
├ ᴜᴘᴛɪᴍᴇ: ${formatUptime(uptime)}
├ ᴘʟᴀᴛғᴏʀᴍ: ${os.platform()}
├ ᴍᴇᴍᴏʀʏ: ${(os.totalmem() - os.freemem()) / 1024 / 1024} MB / ${os.totalmem() / 1024 / 1024} MB
╰───────────────❒`

    await conn.sendMessage(
            from,
            {
                text: caption,
                contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 9999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420003990090@newsletter',
                            newsletterName: '⏤͟͟͞͞ᴍᴀʀɪᴀ-ᴍᴅ ͟͞͞⏤'
                        },
                    externalAdReply: {
                       showAdAttribution: false,
                        containsAutoReply: true,
                        title: "✧ Maria MD - Uptime Report✧",
                        body: "Powered By Abby",
                        thumbnailUrl: "https://files.catbox.moe/bt7a3x.jpeg",
                        sourceUrl: "https://github.com/abbybotz141/maria-md",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: mek }
        );
  } catch (e) {
    console.log(e)
    reply(`${e}`)
  }
})