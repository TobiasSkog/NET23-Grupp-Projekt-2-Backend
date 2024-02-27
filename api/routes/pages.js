require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../notionClient");

const fakeData = async () => {
	try {
		const response = { success: "Daniel är på pages" };
		return response;
	} catch (error) {
		return { Error: error.stack };
	}
};

router.get("/", async (req, res) => {
	try {
		const data = await fakeData();
		res.json(data);
	} catch (error) {
		res.status(500).json({ Error: error.stack });
	}
});

module.exports = router;
