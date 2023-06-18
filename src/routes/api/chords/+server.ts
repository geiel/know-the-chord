import { json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ locals, url }) => {
    const songId = url.searchParams.get("songId");

    const [chords] = await locals.connection.execute(`
        SELECT id, song_id, value, type 
        FROM chords
        WHERE song_id = ?
    `, [songId]);

    return json(chords);
}) satisfies RequestHandler;