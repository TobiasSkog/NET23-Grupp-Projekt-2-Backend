require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

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

		if (response.results.length > 0) {
			return {
				isValidUser: true,
				userRole: response.results[0].properties.Role.select.name,
				id: response.results[0].id,
			};
		} else {
			return {
				isValidUser: false,
				userRole: "Invalid",
				id: "Nan",
			};
		}
	} catch (error) {
		console.error("Error Query People Table:", error.message);
		throw error;
	}
}

async function DBPeopleIsExistingUser2(userEmail, userPassword) {
	if (userEmail === "") {
		return {
			isValidUser: false,
			userRole: "Invalid",
			id: "",
			name: "",
		};
	}

	try {
		const response = await notionClient.databases.query({
			database_id: process.env.NOTION_DB_PEOPLE_ID,
			filter: {
				and: [
					{
						property: "Email",
						email: {
							equals: userEmail,
						},
					},
					{
						property: "Password",
						rich_text: {
							equals: userPassword,
						},
					},
				],
			},
		});

		if (response.results.length > 0) {
			return {
				id: response.results[0].id,
				name: response.results[0].properties.Name.title[0].text.content,
				userRole: response.results[0].properties.Role.select.name,
				isValidUser: true,
			};
		} else {
			return {
				isValidUser: false,
				userRole: "Invalid",
				id: "",
				name: "",
			};
		}
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(500)
			.send("Internal server error during database query:", error.message);
	}
}

router.post("/login/integratedUser", async (req, res) => {
	try {
		const isExistingUser = await DBPeopleIsExistingUser2(
			req.body.userEmail,
			req.body.userPassword
		);

		return res.send({
			isValidUser: isExistingUser.isValidUser,
			userRole: isExistingUser.userRole,
			id: isExistingUser.id,
			name: isExistingUser.name,
		});
	} catch (error) {
		console.error("Database Error:", error.message);
		res
			.status(500)
			.send("Internal server error during database query:", error.message);
	}
});

router.post("/login/authUser", async (req, res) => {
	try {
		const isExistingUser = await DBPeopleIsExistingUser(req.body.userEmail);

		return res.send({
			isValidUser: isExistingUser.isValidUser,
			userRole: isExistingUser.userRole,
			id: isExistingUser.id,
		});
	} catch (error) {
		console.error("Error Query People Table:", error.message);
		res
			.status(500)
			.send("Internal server error during database query:", error.message);
	}
});

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
