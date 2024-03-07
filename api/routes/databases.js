require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../components/notionClient");

async function DBPeopleIsExistingUser(userEmail) {
<<<<<<< HEAD
=======
	let userData = {
		isValidUser: false,
		userRole: "Invalid",
		id: "",
		name: "",
	};

	if (!userEmail || userEmail === "") {
		return userData;
	}

>>>>>>> 1027909ce0f3317477db74256d1bf4379fb7a351
	try {
		const response = await notionClient.databases.query({
			database_id: process.env.NOTION_DB_PEOPLE_ID,
			filter: {
<<<<<<< HEAD
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
=======
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
>>>>>>> 1027909ce0f3317477db74256d1bf4379fb7a351
			.send("Internal server error during database query:", error.message);
	}
});

module.exports = router;
