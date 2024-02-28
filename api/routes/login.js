require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const notionClient = require("../../notionClient");

const REDIRECT_URI = "http://localhost:3001/login/auth/callback";

// This is the endpoint the FRONTEND calls to start the oAuth procedure
router.get("/auth", (req, res) => {
	// We redirects the user to our application specific oAuth URL that we have in our .env file
	res.redirect(process.env.NOTION_AUTH_URL);
});

// This is where we authenticate the user with the information passed on
router.get("/auth/callback", async (req, res) => {
	// saving the code parameter inside the adress code=xxx
	// this is used for the authentication with oAuth
	const code = req.query.code;
	try {
		// starting the oAuth procedure with a post request
		const response = await axios.post(
			"https://api.notion.com/v1/oauth/token", // api endpoint
			{
				// This is the configuration of the API request, including headers and body.
				grant_type: "authorization_code",
				code,
				redirect_uri: REDIRECT_URI,
			},
			{
				// Additional configuration, specifically for authentication
				auth: {
					username: process.env.NOTION_OAUTH_CLIENT_ID,
					password: process.env.NOTION_OAUTH_CLIENT_SECRET,
				},
			}
		);
		// Check if the response status is 200 (the authentication was OK)
		if (response.status === 200) {
			const accessToken = response.data.access_token;

			// early workaround to make sure it works, redirects the user to a success page.
			// this will be replaced by the code bellow checking if the user exists in the
			// people database table and redirecting the user accordingly
			//console.log(response);
			console.log(response.data.owner.user);
			res.status(response.status).redirect("http://localhost:3000/success");
			// // Perform the database query to check if the user email exists
			//const userExists = await yourDatabaseQueryFunction(/* pass user email */);

			// Based on the result of the database query, redirect or respond accordingly
			// if (userExists) {
			// 	// User exists, perform redirection or other actions
			// 	res.send("Login successful - User exists!");
			// } else {
			// 	// User does not exist, handle accordingly
			// 	res.send("Login successful - User does not exist!");
			// }
		} else {
			// Handle non-200 response status from Notion
			res
				.status(response.status)
				.send("Failed to retrieve access token from Notion.");
		}
	} catch (error) {
		// Handle errors during the OAuth process
		console.error("Error during OAuth process:", error.message);
		res.status(500).send("Internal server error during OAuth process.");
	}
});

module.exports = router;
