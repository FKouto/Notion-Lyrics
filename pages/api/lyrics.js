import { getNotionClient } from '../../lib/notion';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers['x-notion-token'];

    if (!token) {
        return res.status(401).json({ message: 'Missing Notion credentials' });
    }

    if (!id) {
        return res.status(400).json({ message: 'Missing song ID' });
    }

    const notion = getNotionClient(token);

    try {
        const response = await notion.blocks.children.list({
            block_id: id,
            page_size: 100, // Adjust if lyrics are longer
        });

        // Filter only paragraph blocks and extract text
        const lyrics = response.results
            .filter((block) => block.type === 'paragraph')
            .map((block) => {
                // combine rich text parts
                return block.paragraph.rich_text.map(t => t.plain_text).join('');
            })
        // Optional: Filter out empty lines if desired, but blank lines might be intentional for spacing
        // .filter(line => line.trim() !== ''); 

        res.status(200).json(lyrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
