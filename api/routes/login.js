require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/auth/callback", async (req, res) => {
	const code = req.query.code;
	let userData = {
		email: "",
		userRole: "Invalid",
		target: "/",
	};

	// Check if we got a valid code in the query
	if (!code || typeof code !== "string") {
		res.status(400).send(userData, "Invalid or missing code parameter");
		return;
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
			}
		);

		//Check if the response status is NOT 200 (the authentication FAILED)
		if (response.status !== 200) {
			console.error("OAuth Token Request Failed. Status:", response.status);
			res.status(401).send(userData);
			return;
		}

		//  The response was 200 - Control if the authorized user is in our People Database

		// BREAKING THIS OUT TO FRONTEND
		// let validUser = await axios.post(
		// 	"http://localhost:3001/databases/login/confirmUser",
		// 	{
		// 		userEmail: response.data.owner.user.person.email,
		// 	}
		// );

		// Create a dataobject to return to frontend

		// Is the user a Valid User?
		//if (!validUser.data.isValidUser) {
		// User is NOT found in the people table and is NOT a valid user
		//} else {
		// User IS FOUND in the people table and IS A VALID user
		userData = {
			accessToken: response.data.access_token,
			email: response.data.owner.user.person.email,
			userId: response.data.owner.user.id,
			botId: response.data.bot_id,
			userObj: response.data.owner.user,
		};
		//}

		// respond to the original request with the userData object
		// which will have it's data updated based on the result of
		// the database query and the authentication
		console.log("BACKEND - USERDATA:", userData);
		res.send(userData);
		return;
		// } catch (error) {
		// 	console.error("Error during user verification process:", error.message);
		// 	res
		// 		.status(500)
		// 		.send("Internal server error during user verification process.");
		// }
	} catch (error) {
		console.error("Error during OAuth process:", error.message);
		res.status(500).send("Internal server error during OAuth process.");
	}
});

module.exports = router;
