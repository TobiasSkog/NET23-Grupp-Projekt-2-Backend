require("dotenv").config();
const { Client } = require("@notionhq/client");

const notionClient = new Client({
	auth: process.env.NOTION_INTERNAL_SECRET,
});
module.exports = notionClient;
