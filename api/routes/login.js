require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const notionClient = require("../../notionClient");

router.get("/:code", async (req, res) => {
	const { code } = req.params;

	// Generate an access token with the code we got earlier and the client_id and client_secret we retrived earlier
	const resp = await axios({
		method: "POST",
		url: "https://api.notion.com/v1/oauth/token",
		auth: {
			username: process.env.NOTION_OAUTH_CLIENT_ID,
			password: process.env.NOTION_OAUTH_CLIENT_SECRET,
		},
		headers: { "Content-Type": "application/json" },
		data: { code, grant_type: "authorization_code" },
	});
	console.log(resp);
	// You want to save resp.data.workspace_id
	// and resp.data.access_token if you want to
	// make requests later with this Notion account
	// (otherwise they'll need to reauthenticate)

	// Use the access token we just got to search the user's workspace for databases
	const { data } = await axios({
		method: "POST",
		url: "https://api.notion.com/v1/search",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${resp.data.access_token}`,
			"Notion-Version": "2022-02-22",
		},
		data: { filter: { property: "object", value: "database" } },
	});
	res.json(data?.results);
});

module.exports = router;
