require("dotenv").config();
// Requires a seperate file to avoid circular dependencies.
// Export the client to be used in the different routes

const { Client } = require("@notionhq/client");
const notionClient = new Client({
	auth: process.env.NOTION_API,
});
module.exports = notionClient;
