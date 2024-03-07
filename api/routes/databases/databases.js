require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../components/notionClient");

async function DBPeopleIsExistingUser(userEmail) {
	let userData = {
		isValidUser: false,
		userRole: "Invalid",
		id: "",
		name: "",
	};

	if (!userEmail || userEmail === "") {
		return userData;
	}

	try {
		const response = await notionClient.databases.query({
			database_id: process.env.NOTION_DB_PEOPLE_ID,
			filter: {
				property: "Email",
				email: {
					equals: userEmail,
				},
			},
		});

		if (!response.results.length > 0) {
			return userData;
		}

		userData.isValidUser = true;
		userData.userRole = response.results[0].properties.Role.select.name;
		userData.id = response.results[0].id;
		return userData;
	} catch (error) {
		console.error("Error Query People Table:", error.message);
		throw error;
	}
}

router.post("/login/authUser", async (req, res) => {
	try {
		const isExistingUser = await DBPeopleIsExistingUser(req.body.userEmail);
		return res.send({
			isValidUser: isExistingUser.isValidUser,
			userRole: isExistingUser.userRole,
			id: isExistingUser.id,
		});
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(520)
			.send("Internal server error during database query:", error.message);
	}
});

module.exports = router;
