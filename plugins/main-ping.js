const { cmd } = require("../command");
const os = require("os");

cmd({
  pattern: "ping",
  alias: ["speed", "latency", "p"],
  desc: "Check bot response speed and system stats",
  category: "General",
  react: "🏓",
  filename: __filename,
}, async (
  conn,
  mek,
  m,
  {
    from,
    reply,
  }
) => {
  const start = Date.now();
  await reply("🏓 ᴘɪɴɢɪɴɢ ᴍᴀʀɪᴀ-ᴍᴅ...");
  const ping = Date.now() - start;

  // Status
  let status;
  if (ping <= 150) status = "⚡ ᴜʟᴛʀᴀ ꜰᴀꜱᴛ";
  else if (ping <= 300) status = "🚀 ꜰᴀꜱᴛ";
  else if (ping <= 600) status = "⏱️ ᴍᴏᴅᴇʀᴀᴛᴇ";
  else status = "🐢 sʟᴏᴡ";

  // Uptime (manual)
  const totalSeconds = Math.floor(process.uptime());
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedUptime = `${hours}ʜ ${minutes}ᴍ ${seconds}s`;

  // System Info
  const platform = os.platform();
  const arch = os.arch();
  const host = os.hostname();

  const output = `
╭─❍ *『 ᴍᴀʀɪᴀ-ᴍᴅ ᴘɪɴɢ ʀᴇᴘᴏʀᴛ 』* ❍─╮
│
├➤ *ʙᴏᴛ:* ${conn.user.name}
├➤ *ʀᴇsᴘᴏɴsᴇ:* ${ping}ᴍs
├➤ *sᴛᴀᴛᴜs:* ${status}
│
├➤ *ᴜᴘᴛɪᴍᴇ:* ${formattedUptime}
├➤ *ᴘʟᴀᴛꜰᴏʀᴍ:* ${platform} (${arch})
├➤ *ʜᴏsᴛ:* ${host}
│
╰─❍ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛʜᴇ ᴜɴᴋɴᴏᴡɴ ᴛᴇᴄʜɪᴇs ❍─╯
  `.trim();

  await reply(output);
});
