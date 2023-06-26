import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, url }) => {
    const limit = Number(url.searchParams.get('limit') ?? '20');

    const [rows] = await locals.connection.execute(`
        SELECT sg.id, sg.title AS sgTitle, s.title AS songTitle, so.song_group_chord AS chordValue
        FROM song_groups sg
        INNER JOIN songs_order so ON sg.id = so.song_group_id
        INNER JOIN songs s ON s.id = so.song_id
        WHERE so.position = 1
        ORDER BY sg.updateAt DESC
        LIMIT ?;
    `, [limit]);

    return json({rows})
}) satisfies RequestHandler;