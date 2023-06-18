import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, url }) => {
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const [rows] = await locals.connection.execute(`
        SELECT sg.id, sg.title AS sgTitle, s.title AS songTitle, c.value AS chordValue
        FROM song_groups sg
        INNER JOIN songs_order so ON sg.id = so.song_group_id
        INNER JOIN songs s ON s.id = so.song_id
        LEFT JOIN chords c on s.id = c.song_id
        WHERE so.position = 1 AND c.id = (
            SELECT MAX(c2.id) FROM chords c2 WHERE c2.song_id = s.id
        )
        ORDER BY sg.updateAt DESC
        LIMIT ?;
    `, [limit]);

    return json({rows})
}) satisfies RequestHandler;