const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: "fake",
    desc: "👤 Generate fake person data",
    react: "👤",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const user = response.data.results[0];
        const info = `
👤 *Fake Person Data:*
📛 *Name:* ${user.name.first} ${user.name.last}
📧 *Email:* ${user.email}
📞 *Phone:* ${user.phone}
🏠 *Address:*
${user.location.street.number} ${user.location.street.name}
${user.location.city}, ${user.location.state}
${user.location.country} ${user.location.postcode}
🎂 *DOB:* ${new Date(user.dob.date).toLocaleDateString()} (${user.dob.age} years)
        `;
        reply(info);
    } catch {
        reply('Failed to generate fake data. Try again later.');
    }
});