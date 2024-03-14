require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

const database_id = process.env.NOTION_DB_PEOPLE_ID;

async function FindUserInDB(email, password, loginType) {
	let userData = {
		isValidUser: false,
		userRole: "Invalid",
		id: "",
		name: "",
		email: "",
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
			email: email,
			isValidUser: true,
		});
	} catch (error) {
		console.error("Database Error:", error.message);
		throw error(error);
	}
}

router.post("/login/integratedUser", async (req, res) => {
	try {
		const isExistingUser = await FindUserInDB(req.body.userEmail, req.body.userPassword, "Integrated");
		res.send(isExistingUser);
	} catch (error) {
		console.error("Database Error:", error.message);
		res.status(500).send(`Internal server error during people database query - Integrated: ${error.message}`);
	}
});

router.post("/login/authUser", async (req, res) => {
	try {
		const isExistingUser = await FindUserInDB(req.body.userEmail, "", "OAuth");
		res.send(isExistingUser);
	} catch (error) {
		console.error("Database Error:", error.message);
		res.status(500).send(`Internal server error during people database query - OAuth: ${error.message}`);
	}
});

//Get people
async function getPeople() {
	const payload = {
		path: `databases/${database_id}/query`,
		method: "POST",
	};

	const { results } = await notionClient.request(payload);
	//console.log("Log to see result ", results);
	const people = results.map((page) => {
		return {
			id: page.id,
			name: page.properties.Name?.title[0]?.text?.content,
		};
	});

	return people;
}

//Get people
router.get("/", async (req, res) => {
	try {
		const reports = await getPeople();

		res.json(reports);
	} catch (error) {
		console.error("Failed to fetch from the database:", error.message);
		return res.status(500).json({ error: "Server error, failed to fetch peopledata" });
	}
});

module.exports = router;
