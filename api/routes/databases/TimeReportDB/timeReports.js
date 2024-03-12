require("dotenv").config();
const express = require("express");
const router = express.Router();
const notionClient = require("../../../components/notionClient");

const timeReportDbId = process.env.NOTION_DB_TIMEREPORTS_ID;

//Get tiemReport
async function getTimeReports() {
    try {
        const response = await notionClient.databases.query({
            database_id: timeReportDbId,
        });

        const timeReports = response.results.map((page) => {
            return {
                id: page.id,
                date: page.properties.Date?.date?.start ?? 'No date available',
                personId: page.properties.Person?.relation?.[0]?.id ?? 'No person ID',
                hours: page.properties.Hours?.number ?? 0,
                projectId: page.properties.Project?.relation?.[0]?.id ?? 'No project ID',
                note: page.properties.Note?.title?.[0]?.text?.content ?? 'No note',
            };
        });

        return timeReports;
    } catch (error) {
        console.error("Failed to retrieve time reports:", error);
        throw error; 
    }
}

//get TimeReports
router.get("/", async (req, res) => {
    try {
        const timeReports = await getTimeReports();
        res.json(timeReports);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve time reports", error: error.toString() });
    }
});

module.exports = router;