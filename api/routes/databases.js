require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../components/notionClient");

async function DBPeopleIsExistingUser(userEmail) {
	try {
		const response = await notionClient.databases.query({
			database_id: process.env.NOTION_DB_PEOPLE_ID,
			filter: {
				or: [
					{
						property: "Email",
						email: {
							equals: userEmail,
						},
					},
				],
			},
		});

		if (response.results.length > 0) {
			return {
				isValidUser: true,
				userRole: response.results[0].properties.Role.select.name,
			};
		} else {
			return {
				isValidUser: false,
				userRole: "Invalid",
			};
		}
	} catch (error) {
		console.error("Error Query People Table:");
		res.send("Error Query People Database Table:");
	}
}

router.post("/login/confirmUser", async (req, res) => {
	try {
		const isExistingUser = await DBPeopleIsExistingUser(req.body.userEmail);
		res.send({
			isValidUser: isExistingUser.isValidUser,
			userRole: isExistingUser.userRole,
		});
		return;
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(500)
			.send("Internal server error during database query:", error.message);
	}
});

module.exports = router;
