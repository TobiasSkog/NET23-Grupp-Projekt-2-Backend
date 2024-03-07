require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/auth/callback", async (req, res) => {
	const code = req.query.code;
	// Create a dataobject to return to frontend
	let userData = {
		email: "",
		name: "",
		userRole: "Invalid",
		target: "/",
	};

	// Check if we got a valid code in the query
	if (!code || typeof code !== "string") {
		res.status(400).send(userData, "Invalid or missing code parameter");
	}

	try {
		let response = await axios.post(
			"https://api.notion.com/v1/oauth/token", // api endpoint
			{
				// This is the configuration of the API request, including headers and body.
				grant_type: "authorization_code",
				code,
				redirect_uri: process.env.NOTION_REDIRECT_URI,
			},
			{
				// Additional configuration, specifically for authentication
				auth: {
					username: process.env.NOTION_OAUTH_CLIENT_ID,
					password: process.env.NOTION_OAUTH_CLIENT_SECRET,
				},
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		//Check if the response status is NOT 200 (the authentication FAILED)
		if (response.status !== 200) {
			console.error("OAuth Token Request Failed. Status:", response.status);
			return res.status(401).send(userData);
		}
		// User IS FOUND in the people table and IS A VALID user

		userData = {
			email: response.data.owner.user.person.email,
			name: response.data.owner.user.name,
		};

		return res.send(userData);
	} catch (error) {
		console.error("Error during OAuth process:", error.message);
		return res.status(500).send("Internal server error during OAuth process.");
	}
});

module.exports = router;
