const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('./lib/functions');

const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['2347032411938'];

let dynamicMode = config.MODE;

// ========= AUTH SETUP =========
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID.replace("Maria-X~", '');
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

// ========= CONNECT FUNCTION =========
async function connectToWA() {
  console.log("🔄 Connecting Maria-MD...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) connectToWA();
      else console.log("You are logged out.");
    } else if (connection === 'open') {
      console.log('😼 Installing plugins...');

      // Load commands into global list
      const events = require('./command');
      const pluginPath = path.join(__dirname, "plugins");
      const pluginFiles = fs.readdirSync(pluginPath).filter(file => file.endsWith(".js"));

      let pluginCount = 0;
      for (const file of pluginFiles) {
        try {
          const plugin = require(path.join(pluginPath, file));
          if (plugin.pattern && plugin.function) {
            events.commands.push(plugin);
            pluginCount++;
          } else {
            console.warn(`⚠️ Skipped plugin: ${file} (invalid format)`);
          }
        } catch (err) {
          console.error(`❌ Failed to load plugin: ${file}`, err);
        }
      }

      console.log(`✅ Plugins loaded: ${pluginCount}`);
      console.log('🟢 Maria-MD connected!');

      const up = `ᴍᴀʀɪᴀ-ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ✅\n\nᴏᴡɴᴇʀ: ${config.OWNER_NAME}\nᴜsᴇʀ: ${conn.user?.id || "Unknown"}\nᴄᴏᴍᴍᴀɴᴅs: ${pluginCount}\nᴘʀᴇғɪx: ${prefix}\nCurrent mode: ${dynamicMode}`;
      conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
        image: { url: `https://telegra.ph/file/900435c6d3157c98c3c88.jpg` },
        caption: up
      });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = (getContentType(mek.message) === 'ephemeralMessage')
      ? mek.message.ephemeralMessage.message
      : mek.message;

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = (type === 'conversation')
      ? mek.message.conversation
      : (type === 'extendedTextMessage')
        ? mek.message.extendedTextMessage.text
        : (type == 'imageMessage' && mek.message.imageMessage.caption)
          ? mek.message.imageMessage.caption
          : (type == 'videoMessage' && mek.message.videoMessage.caption)
            ? mek.message.videoMessage.caption
            : '';

    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.fromMe ? conn.user.id : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const botNumber = conn.user.id.split(':')[0];
    const pushname = mek.pushName || 'Sin Nombre';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? groupMetadata.participants : '';
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

    const reply = (text) => {
      conn.sendMessage(from, { text }, { quoted: mek });
    };

    // Private mode block
    if (isCmd && dynamicMode === 'private' && !isOwner) {
      return conn.sendMessage(from, { text: 'Sorry, this bot is in private mode.' }, { quoted: mek });
    }

    // Change mode command
    if (isCmd && command === 'mode') {
      if (!isOwner) return reply('Only the owner can change the mode.');
      if (!args[0]) return reply(`Current mode: ${dynamicMode}\nUse: .mode public | private`);
      const newMode = args[0].toLowerCase();
      if (!['public', 'private'].includes(newMode)) return reply('Invalid mode.');
      dynamicMode = newMode;
      return reply(`Mode changed to: ${dynamicMode}`);
    }

    // Handle plugins
    const events = require('./command');
    const cmd = events.commands.find((cmd) => cmd.pattern === command || (cmd.alias && cmd.alias.includes(command)));

    if (isCmd && cmd) {
      if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
      try {
        cmd.function(conn, mek, m, {
          from, quoted: m.quoted, body, isCmd, command, args, q,
          isGroup, sender, senderNumber, botNumber2, botNumber,
          pushname, isMe, isOwner, groupMetadata, groupName,
          participants, groupAdmins, isBotAdmins, isAdmins, reply
        });
      } catch (e) {
        console.error("[PLUGIN ERROR]", e);
        reply("❌ Error running that command.");
      }
    }
  });
}

// Simple HTTP health check
app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`🌐 Server running at http://localhost:${port}`));

// Connect after delay
setTimeout(connectToWA, 4000);
