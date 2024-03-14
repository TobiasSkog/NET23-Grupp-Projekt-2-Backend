require("dotenv").config();
const notionClient = require("../../../components/notionClient");

async function isProjectOverdue() {
	const { results } = await notionClient.databases.query({
		database_id: process.env.NOTION_DB_PROJECTS_ID,
		filter: {
			and: [
				{
					property: "Hours left",
					number: {
						less_than: 0,
					},
				},
				{
					property: "Status",
					type: "select",
					select: {
						equals: "Active",
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

    return grabResults;
	}
}

module.exports = isProjectOverdue;
