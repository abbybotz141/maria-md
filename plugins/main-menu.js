const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "help",
    alias: ["menu", "h", "commands"],
    desc: "Get the command list and info",
    category: "general",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from,sender, args, pushname, reply }) => {

    try {
        const categories = {
            'MAIN': ['alive', 'ping', 'runtime', 'info'],
            'DOWNLOADER': ['play', 'video', 'ytmp3', 'ytmp4', 'instagram', 'facebook', 'tiktok', 'spotify', 'gdrive'],
            'GROUP': ['admins', 'gdesc' , 'ginfo' , 'glink' , 'gname' , 'setsubject' , 'tagall' , 'requests' , 'accept' , 'reject' , 'hidetag' , 'kick', 'unlock' , 'lock' , 'approve' , 'poll' , 'getpic'],
            'FUN': ['rate', 'ship', 'joke', 'insult', 'character', 'kiss', 'hug', 'poke'],
            'TOOLS': ['emix', 'owner', 'credits', 'password', 'random', 'fake', 'joke', 'qr', 'shorten', 'define', 'reverse', 'repeat', 'count', 'uuid', 'ascii', 'lorem', 'stats', 'color', 'url', 'emoji'],
            'SEARCH': ['weather', 'movie', 'news', 'wikipedia', 'fact', 'define'],
            'AI': ['ai', 'gpt', 'blackbox', 'imagine', 'copilot'],
            'GENERAL': ['menu', 'help', 'h', 'commands'],
            'OWNER': ['broadcast' , 'block', 'unblock', 'clearchats', 'jid', 'gjid'],
            'OTHER': ['weather'],
            'ANIME': ['akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chitanda', 'chitoge', 
  'deidara', 'doraemon', 'elaina', 'emilia', 'asuna', 'erza', 'gremory', 'hestia', 
  'hinata', 'inori', 'itachi', 'isuzu', 'itori', 'kaga', 'kagura', 'kakasih', 'kaori', 
  'kaneki', 'kosaki', 'kotori', 'kuriyama', 'kuroha', 'kurumi', 'madara', 'mikasa', 
  'miku', 'minato', 'naruto', 'natsukawa', 'neko2', 'nekohime', 'nezuko', 'nishimiya', 
  'onepiece', 'pokemon', 'rem', 'rize', 'sagiri', 'sakura', 'sasuke', 'shina', 'shinka', 
  'shizuka', 'shota', 'tomori', 'toukachan', 'tsunade', 'yatogami', 'yuki']
        };

        const totalCommands = Object.values(categories).flat().length;

        let mainMenu = `╔══════ •⊹٭✧ ✦ ✧٭⊹• ══════╗
   *𝐌𝐀𝐑𝐈𝐀 𝐌𝐃* - ℂ𝕆𝕄𝕄𝔸ℕ𝔻 ℍ𝕌𝔹
╚══════ •⊹٭✧ ✦ ✧٭⊹• ══════╝

⚡ *USER PROFILE*
┊➣ Name: ${pushname}
┊➣ Prefix: ${config.PREFIX}
┊➣ Mode: Public
┊➣ Uptime: ${runtime(process.uptime())}
┊➣ Commands: ${totalCommands}
╰────────────────❖\n\n`;

        mainMenu += `✨ *COMMAND LIST* ✨\n`;

        for (const [category, commands] of Object.entries(categories)) {
            mainMenu += `┏━━━ ${category} ━━━┓\n`;
            for (const cmd of commands) {
                mainMenu += `┊ ❥ ${config.PREFIX}${cmd}\n`;
            }
            mainMenu += `┗━━━━━━━━━━━━━━┛\n\n`;
        }
        mainMenu += `╭────〘 *MARIA BOT INFO* 〙────⊷
┊ ⋆˚✿˖°⋆ *VERSION*: 2.0
┊ ⋆˚✿˖°⋆ *POWERED BY*: Node.js
┊ ⋆˚✿˖°⋆ *CREATED*: 2025
╰───────────────────⊷

✧*•¸♡⋆。✧*•¸♡⋆。✧*•¸♡⋆。✧*•¸♡⋆。

⚠️ *NOTE:* Please avoid spamming commands.`;

        await conn.sendMessage(
            from,
            {
                text: mainMenu,
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
                        title: "✧ Maria MD - Command Center ✧",
                        body: "Elegance Meets Intelligence",
                        thumbnailUrl: "https://files.catbox.moe/bt7a3x.jpeg",
                        sourceUrl: "https://github.com/abbybotz141/maria-md",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("Help command error:", error);
        reply("*✧ SYSTEM ALERT ✧* Command center temporarily unavailable. Please try again later.");
    }
});

function runtime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
}