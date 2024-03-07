require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

async function FindUserInDB(email, password, loginType) {
	let userData = {
		isValidUser: false,
		userRole: "Invalid",
		id: "",
		name: "",
	};
	let response;

	if (email === "" || loginType === "") {
		return userData;
	}

	if (password === "" && loginType === "Integrated") {
		return userData;
	}
	try {
		switch (loginType) {
			case "Integrated":
				response = await notionClient.databases.query({
					database_id: process.env.NOTION_DB_PEOPLE_ID,
					filter: {
						and: [
							{
								property: "Email",
								email: {
									equals: email,
								},
							},
							{
								property: "Password",
								rich_text: {
									equals: password,
								},
							},
						],
					},
				});

				break;

			case "OAuth":
				response = await notionClient.databases.query({
					database_id: process.env.NOTION_DB_PEOPLE_ID,
					filter: {
						property: "Email",
						email: {
							equals: email,
						},
					},
				});

				break;
		}

		if (!response.results.length > 0) {
			return userData;
		}
    
		return (userData = {
			id: response.results[0].id,
			name: response.results[0].properties.Name.title[0].text.content,
			userRole: response.results[0].properties.Role.select.name,
			isValidUser: true,
		});
	} catch (error) {
		console.error("Database Error:", error.message);
		throw error(error);
	}
}

router.post("/login/integratedUser", async (req, res) => {
	try {
		const isExistingUser = await FindUserInDB(
			req.body.userEmail,
			req.body.userPassword,
			"Integrated"
		);
		res.send(isExistingUser);
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(500)
			.send(
				"Internal server error during people database query Integrated:" +
					error.message
			);
	}
});

router.post("/login/authUser", async (req, res) => {
	try {
		const isExistingUser = await FindUserInDB(req.body.userEmail, "", "OAuth");
		res.send(isExistingUser);
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(500)
			.send(
				"Internal server error during people database query OAuth:" +
					error.message
			);
	}
});

module.exports = router;
