import { getNotionClient } from '../../lib/notion';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers['x-notion-token'];
    const databaseId = req.headers['x-notion-db-id'];

    if (!token || !databaseId) {
        return res.status(401).json({ message: 'Missing Notion credentials' });
    }

    const notion = getNotionClient(token);

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            sorts: [
                {
                    property: 'Music',
                    direction: 'ascending',
                },
            ],
        });

        const songs = response.results
            .map((page) => {
                const titleProp = page.properties.Music;
                const groupProp = page.properties.Group;

                // Handle different title types (title array)
                const title = titleProp?.title?.[0]?.plain_text ?? null;
                const group = groupProp?.select?.name ?? 'Uncategorized';

                return {
                    id: page.id,
                    title,
                    group,
                };
            })
            .filter((song) => song.title); // Filter out empty titles

        res.status(200).json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
