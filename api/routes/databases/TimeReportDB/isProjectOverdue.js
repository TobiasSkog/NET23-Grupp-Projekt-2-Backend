require("dotenv").config();
const notionClient = require("../../../components/notionClient");

async function isProjectOverdue(projectName, io) {
	const { results } = await notionClient.databases.query({
		database_id: process.env.NOTION_DB_PROJECTS_ID,
		filter: {
			and: [
				{
					property: "Projectname",
					title: {
						equals: projectName,
					},
				},
				{
					property: "Hours left",
					number: {
						less_than: 0,
					},
				},
			],
		},
	});

	if (results.length > 0) {
		const grabResults = results.map((e) => {
			return {
				name: e.properties.Projectname.title[0].text.content,
				hoursLeft: e.properties["Hours left"].formula.number,
			};
		});
		io.emit("projectOverdue", grabResults); // Emitting data to frontend
		return grabResults;
	}
	return results;
}

module.exports = { isProjectOverdue: isProjectOverdue };