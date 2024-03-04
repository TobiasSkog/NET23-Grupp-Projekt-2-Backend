require("dotenv").config();
const express = require("express");
const router = express.Router();
const createNotionClient = require("../../components/notionClient");

router.get("/", async (req, res) =>
	res.json({ message: "Endpoint Access Denied" })
);
// async function IsAuthenticatedUserAnExistingUser(userData) {
// 	console.log(userData.user.person.email);
// 	const notionClient = createNotionClient(userData.accessToken);
// 	const response = await notionClient.users.list({});

// 	if (response.results.length > 0) {
// 		const foundUser = response.results.filter((user) => {
// 			if (user.person && user.person.email)
// 				return user.person.email == userData.user.person.email;
// 		});
// 		//console.log("foundUser:", foundUser);

// 		return foundUser;
// 	}

// 	return false;
// }

// router.post("/authenticate", async (req, res) => {
// 	try {
// 		const userData = req.body.userData;
// 		const data = await IsAuthenticatedUserAnExistingUser(userData);
// 		res.json(data);
// 	} catch (error) {
// 		console.error("Database Error:", error.message);
// 		res
// 			.status(500)
// 			.json({ error: "Internal server error during database query." });
// 	}
// });

module.exports = router;
